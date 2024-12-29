console.clear();
import { Server, Socket } from "socket.io";
import http from 'http';
import {  GetAuthRoom, GetRoomDB } from "./database/db";
import jwt from "jsonwebtoken"
import { GetRoomToken } from "./room";
import { v4 } from "uuid";
const server = http.createServer();
const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"], 
    }
});

export enum MeetType {
    "local",
    'private'
}
io.on('connection', (socket: Socket) => {
    // this event gives coordinate to other player 
    socket.timeout(5000).emit("AUTH",async (err: Error | null, response: {
        Auth: string;
        name: string;
        roomId: number;
    }) => {
        try{
            if (err) {
                socket.disconnect();
            } else {
                if(!response || !response.Auth || ! response.name || !response.roomId)
                    return socket.disconnect();
                // const data:{id:number}
                const userdata = jwt.verify(response.Auth,process.env.JWT_SECRETE as string) as {id:number,name:string};
                if(!userdata) return socket.disconnect();
                const accessroom = await GetAuthRoom({roomid:response.roomId,userid:userdata.id});
                if(!accessroom) return socket.disconnect();
                socket.data.info = {id:userdata.id,name:userdata.name,roomid:response.roomId} as {id:number,name:string};
                
                socket.join(`${response.roomId}`)
                socket.to(`${response.roomId}`).emit("NewUser",{id:socket.id,name:userdata.name,DBid:userdata.id})
                
                let ExistingUser:{id:string,name:string,DBid:number}[] = []
                const newUserSocketid = socket.id
                console.log(socket.data.info)
                const clientsInRoom = io.sockets.adapter.rooms.get(`${response.roomId}`);
                if (clientsInRoom) {    
                    clientsInRoom.forEach((clientId: string) => {
                        if (clientId != newUserSocketid) {
                            const clientSocket = io.sockets.sockets.get(clientId);
                            if(clientSocket){
                                const data = {id:clientId, name:clientSocket.data.info.name as string,DBid:clientSocket.data.info.id}
                                ExistingUser.push(data);
                        }
                    }
                });
                console.log("old users",ExistingUser)
                if(ExistingUser.length > 0) socket.emit("OldUser",{users:ExistingUser})
            }
            }
            console.log("user connected successfull ",socket.data.info.name," ",socket.id)
        }catch(e){
            console.log("something error ")
            socket.disconnect();
        }
    });

    socket.on("message",(data:{message:string,socketId:string})=>{
        const client = io.sockets.sockets.get(data.socketId);
        if(client){
            client.emit('message',{message:data.message,socketId:socket.id})
        }
    })
   
    socket.on('disconnect', () => {
        // Loop through the rooms the user was in
        socket.broadcast.emit("UserLeft",{socketId:socket.id})
    });
    // getSocketSFU().emit("Forward",{to:Meet.MeetData?.AdminSocketId,event:"ResRoomJoinExist",data})
    socket.on('Forward', (data:{to:string,event:string,data:{sender:string}}) => {
        // Loop through the rooms the user was in
        console.log("data forwarding")
        const to = io.sockets.sockets.get(data.to); // this is admin
        switch(data.event){
            case "ReqRoomJoinExist":
                to?.emit("ReqRoomJoinExist",data.data)
                break;
        }
    });

    socket.on("ResRoomJoinExist",async(data:{sender:string,accept:boolean,meetToken:string,admin:string})=>{
        const receiver = io.sockets.sockets.get(data.sender);
        const adminSocket = io.sockets.sockets.get(data.admin)
        if(data.accept){
            //creat tokem
            console.clear();
            console.log("existing meeting request has accpeted");
            const roomdata = jwt.decode(data.meetToken) as {video:{room:string}}|null
            if(roomdata?.video.room){
                const token = await GetRoomToken(roomdata.video.room,receiver?.data.info.name,false);
                receiver?.emit("ResRoomJoinExist",{message:"Your Request have been Accepted",name:adminSocket?.data.info.name})
                receiver?.emit("JoinMeetAccept",{isAdmin:false,AdminSocketId:data.admin,RoomName:roomdata.video.room,MeetToken:token,type:MeetType.private})
            }
        }else{
            receiver?.emit("ResRoomJoinExist",{message:"Your Request have been rejected",name:adminSocket?.data.info.name})
        }
    })

    socket.on("ReqRoomJoinFresh",(data:{receiver:string})=>{
        // send a join request to user 
        console.log("working here",data)
        if(!data?.receiver) return;
        console.log("working here")
        const receiverSocket = io.sockets.sockets.get(data.receiver);
        if(receiverSocket) receiverSocket.emit("ReqRoomJoinFresh",{sender:socket.id});
    })

    socket.on("ResRoomJoinFresh",async (data:{sender:string,accept:boolean})=>{
        try{
            // create room and send token to both 
            const senderSocket = io.sockets.sockets.get(data.sender);
            const roomName = v4()
            const senderToken = await GetRoomToken(roomName,senderSocket?.data.info.name,true);
            const receiverToken = await GetRoomToken(roomName,socket?.data.info.name,false);
            console.clear();
            console.log(senderSocket?.data.info.name)
            console.log(socket?.data.info.name)
            if(data.accept && senderSocket){
                // create room 
                // senderSocket?.emit("ResRoomJoinFresh",{message:`${socket.data.info.name} has accepted the request`})
                senderSocket?.emit("JoinMeetAccept",{
                    isAdmin:true,
                    AdminSocketId:senderSocket.id,
                    RoomName:roomName,
                    MeetToken:senderToken,
                    type:MeetType.private
                } as {isAdmin:boolean,AdminSocketId:string,RoomName:string,MeetToken:string,type:MeetType})
                socket?.emit("JoinMeetAccept",{
                    isAdmin:false,
                    AdminSocketId:senderSocket.id,
                    RoomName:roomName,
                    MeetToken:receiverToken,
                    type:MeetType.private
                } as {isAdmin:boolean,AdminSocketId:string,RoomName:string,MeetToken:string,type:MeetType})
                console.log("room token create",receiverToken,senderToken)
        }else{
            senderSocket?.emit("ResRoomJoinFresh",{message:`${socket.data.info.name} has rejected the request`})
        }
    }catch(e){
        console.log("some error occured while creating room token")
    }
    })
});

server.listen(8000, () => {
    console.log('Server running on port 8000');
});


// setInterval(()=>{
//     console.clear();
//     let ExistingUser:{id:string,name:string}[] = []
//     const clientsInRoom = io.sockets.adapter.rooms.get('1');
//     if (clientsInRoom) {    
//         clientsInRoom.forEach((clientId: string) => {
//             const clientSocket = io.sockets.sockets.get(clientId);
//             if(clientSocket){
//                 const data = {id:clientId, name:clientSocket.data.info.name as string}
//                 ExistingUser.push(data);
//             }
//         });
//     }
//     console.log("old users",ExistingUser)
// },2000)