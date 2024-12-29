import { io, Socket } from "socket.io-client";
import { Dispatch } from "react";
import { disconnectSocket } from "./Socket";
import { MeetDataType, MeetType } from "@/backend/client";
import AskPermission from "../meet/Permission";
import toast from "react-hot-toast";
import jwt from "jsonwebtoken"


let socket:Socket;
export async function ConnectSoketSFU({room,Auth,name}:{room:number,Auth:string,name:string}){
    console.log('working once ')
    return new Promise((res,rej)=>{
        socket = io(process.env.NEXT_PUBLIC_SOCKET_SFU_URL);
        // Join a room
        const roomName = room;
        socket.on('connect',()=>{

        })
        socket.on("AUTH",(callback)=>{
            const userData = {Auth,name,roomId:room};
            callback({...userData})
            res(socket);
        })
        socket.on("OldUser",(data:{users:{id:string,name:string,DBid:number}[]})=>{
            data.users.forEach(e=>{
                UserChat.AddUser({socketId:e.id,name:e.name,DBid:e.DBid})
            })
            UserChat.update();
            console.log("existing users",data)
        })
        socket.on('connect_error', (err) => {
            rej(new Error(`Connection failed: ${err.message}`));
        });
        socket.on("disconnect",()=>{
            // toast.success("You are existing Town")
            // UserChat.clear();
            // return redirect("/dashboard/towns")
            disconnectSocket();
        })
        socket.on("UserLeft",(data:{socketId:string})=>{
            console.log("------------------user left")
            UserChat.RemoveUser(data.socketId)
            UserChat.update();
            console.log(UserChat.Users)
        })
        socket.on("NewUser",(data:{id:string,name:string,DBid:number})=>{
            console.log(data)
            UserChat.AddUser({name:data.name,socketId:data.id,DBid:data.DBid})
            UserChat.update();
        })
        socket.on("message",(data:{message:string,socketId:string})=>{
            UserChat.AddChats(data)
            UserChat.update(); 
            console.log("new meassage")
        })


        socket.on("JoinMeetAccept",(data:{isAdmin:boolean,AdminSocketId:string,RoomName:string,MeetToken:string,type:MeetType})=>{
            Meet.setMeet(data);
        })
        socket.on("JoinMeetReject",(data:{isAdmin:boolean,AdminSocketId:string,RoomName:string,MeetToken:string,type:MeetType})=>{
            // you have been rejected
        })
        socket.on("ReqRoomJoinFresh",(data:{sender:string})=>{
            if(Meet.InMeeting && Meet.MeetData){
                console.log("I'm in meeting ",Meet.MeetData)
                const roomdata = jwt.decode(Meet.MeetData.MeetToken) as {video:{roomAdmin:boolean}} | null
                if(roomdata && roomdata.video.roomAdmin){
                    // we are admin
                    console.log(" asking admin ",Meet.MeetData)
                    return Meet.receiveMeetReqExist({reqSocketId:data.sender})
                }else{
                    console.log("forwarding message ",Meet.MeetData)
                    // forward this to admin
                    getSocketSFU().emit("Forward",{to:Meet.MeetData?.AdminSocketId,event:"ReqRoomJoinExist",data})
                }
            }else{
                Meet.receiveMeetReq({reqSocketId:data.sender});
                console.log("I'm not in meeting ",Meet.MeetData)
            }
        })
        socket.on("ReqRoomJoinExist",(data:{sender:string})=>{
            return Meet.receiveMeetReqExist({reqSocketId:data.sender})
        })
        socket.on("ResRoomJoinFresh",(data:{message:string})=>{
           toast.dismiss(data.message)
        })
        socket.on("ResRoomJoinExist",(data:{message:string})=>{
           toast.success(data.message)
        })
    })
}   



export function getSocketSFU(){
    return socket;
}
export function disconnectSocketSFU(){
    socket.disconnect();
}

export function GetUserData(){
    return UserChat.Users;
}

export function send(){

}

export class UserChat{
    static Users:{[id:string]:{name:string,count:number,messages:{other:boolean,meassage:string}[]}} = {}
    static Subscribers:any = []
    static UserIdMap:{[id:number]:string} = {}// id:socketid
    static AddUser(data:{name:string,socketId:string,DBid:number}){
        UserChat.Users[data.socketId] = {name:data.name,count:0,messages:[]}
        UserChat.UserIdMap[data.DBid] = data.socketId
    }
    static GetChats(id:string){
        return UserChat.Users[id]?.messages ?? [];
    }
    static AddChats(data:{socketId:string,message:string}){
        UserChat.Users[data.socketId].count = UserChat.Users[data.socketId].count  +1;
        UserChat.Users[data.socketId].messages.push({other:true,meassage:data.message})
    }
    static SendMessage(data:{socketId:string,message:string}){
        getSocketSFU().emit("message",{socketId:data.socketId,message:data.message},()=>{})
        console.log(UserChat.Users)
        UserChat.Users[data.socketId].messages.push({other:false,meassage:data.message});
        UserChat.update();
    }
    static RemoveUser(id:string){
        delete UserChat.Users[id];
    }
    static sub(state:Dispatch<{[id:string]:{name:string,count:0,messages:{other:boolean,meassage:string}[]}}>){
        UserChat.Subscribers.push(state);   
    }
    static update(){
        const newUsers = { ...UserChat.Users }
        UserChat.Subscribers.forEach((e:any)=>e(newUsers))
    }
    static ChatVisit(id:string){
        UserChat.Users[id].count = 0;
    }
    static clear(){
        UserChat.Users = {}
    }
}



export class Meet{
    static InMeeting:boolean = false;
    static MeetData:MeetDataType;
    static MeetSub:Dispatch<any>[] = [];

    static updateSubs(){
        const data = Meet.MeetData ? {...Meet.MeetData} : null;
        Meet.MeetSub.forEach(e=>e(data))
    }

    static setMeet(data:{isAdmin:boolean,AdminSocketId:string,RoomName:string,MeetToken:string,type:MeetType}){
        Meet.MeetData = data;
        Meet.InMeeting = true;
        Meet.updateSubs();
    }
    static exitMeet(){
        Meet.InMeeting = false;
        Meet.MeetData = null;
        Meet.updateSubs();
    }
    static sendMeetReq({id}:{id:number}){
        getSocketSFU().emit("ReqRoomJoinFresh",{
            receiver:UserChat.UserIdMap[id]
        })
    }
    static receiveMeetReq({reqSocketId}:{reqSocketId:string}){
        const name = UserChat.Users[reqSocketId].name
        function onAccept(){
            getSocketSFU().emit("ResRoomJoinFresh",{
                sender:reqSocketId,
                accept:true
            })
        }
        function onReject(){
            getSocketSFU().emit("ResRoomJoinFresh",{
                sender:reqSocketId,
                accept:false
            })
        }
        const timeOutId = setTimeout(onReject,10500)
        function cancelTimeout(){
            clearTimeout(timeOutId);
        }
        return AskPermission({name , message:`${name} is Requesting for meet`,onAccept,onReject,cancelTimeout});
    }
    static receiveMeetReqExist({reqSocketId}:{reqSocketId:string}){
        const name = UserChat.Users[reqSocketId].name
        console.log("working request meeting")
        function onAccept(){
            getSocketSFU().emit("ResRoomJoinExist",{
                sender:reqSocketId,
                accept:true,
                meetToken:Meet.MeetData?.MeetToken,
                admin:Meet.MeetData?.AdminSocketId
            })
        }
        function onReject(){
            getSocketSFU().emit("ResRoomJoinExist",{
                sender:reqSocketId,
                accept:false,
                meetToken:Meet.MeetData?.MeetToken
            })
        }
        const timeOutId = setTimeout(onReject,10500)
        function cancelTimeout(){
            clearTimeout(timeOutId);
        }
        return AskPermission({name , message:`${name} is Requesting for meet`,onAccept,onReject,cancelTimeout});
    }
}