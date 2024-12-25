import { io, Socket } from "socket.io-client";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { UNABLE_TO_FIND_POSTINSTALL_TRIGGER_JSON_SCHEMA_ERROR } from "@prisma/client/scripts/postinstall.js";
import exp from "constants";
import { Dispatch } from "react";



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
        socket.on("OldUser",(data:{users:{id:string,name:string}[]})=>{
       
            data.users.forEach(e=>{
                UserChat.AddUser({socketId:e.id,name:e.name})
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
        })
        socket.on("UserLeft",(data:{socketId:string})=>{
            console.log("------------------user left")
            UserChat.RemoveUser(data.socketId)
            UserChat.update();
            console.log(UserChat.Users)
        })
        socket.on("NewUser",(data:{id:string,name:string})=>{
            UserChat.AddUser({name:data.name,socketId:data.id})
            UserChat.update();
        })
        socket.on("message",(data:{message:string,socketId:string})=>{
            UserChat.AddChats(data)
            UserChat.update();
            console.log("new meassage")
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
    static AddUser(data:{name:string,socketId:string}){
        UserChat.Users[data.socketId] = {name:data.name,count:0,messages:[]}
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
