console.clear();
import { Server, Socket } from "socket.io";
import http from 'http';
import {  GetAuthRoom, GetRoomDB } from "./database/db";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const server = http.createServer();
dotenv.config();
const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"], 
    }
});

io.on('connection', (socket: Socket) => {
    // this event gives coordinate to other player 
    socket.timeout(5000).emit("AUTH",(err: Error | null, response: any) => {
        try{
            if (err) {
                console.log("timeout exiceed")
                // socket.disconnect();
            } else {
                if(!response && !response?.Auth)
                    return socket.disconnect();
                const authdata = jwt.verify(response.Auth,process.env.JWT_SECRETE as string) as null | {id:number,name:string};
                console.log(authdata,'auth data')
                if(!authdata?.id) return socket.disconnect();
                socket.data.info.id = authdata.id;
            }
        }catch(e){
            console.log("something error ")
            // socket.disconnect();
        }
    });
    socket.on("UpdatePlayerLocation",(data:{roomName:number,userData:{x:number,y:number,Auth:string} })=>{
        // send to every other player except sender 
        socket.broadcast.to(`${data.roomName}`).emit("UserNewLocation",{id:socket.id,x:data.userData.x,y:data.userData.y})
        // i'm also saving this in on server on player socket instance
        socket.data.info.x = data.userData.x;
        socket.data.info.y = data.userData.y;
    })

    socket.on('joinRoom',async (data: { roomName: number, userData: {x:number,y:number , Auth:string,PlayerIconId:number,name:string} }) => {
        try{
            if(!data.userData.Auth){
                return socket.disconnect();
            }
            // const authdata = jwt.verify(data.userData.Auth,process.env.JWT_SECRETE as string);
            const { roomName, userData } = data;
            const {success} = await GetRoomDB({id:roomName})
            if(!success) return socket.disconnect()
            const authdata = jwt.verify(data.userData.Auth,process.env.JWT_SECRETE as string) as {id:number,name:string};    
            const {success:hasRoomAccess} = await GetAuthRoom({roomid:roomName,userid:authdata.id})
            if(!hasRoomAccess) return socket.disconnect();
            socket.join(`${roomName}`);
            const newUserId = socket.id;
            socket.data.info = {x:userData.x,y:userData.y,PlayerIconId:data.userData.PlayerIconId,name:userData.name,id:authdata.id};
            // infoming other player on server about player 
            socket.broadcast.to(`${data.roomName}`).emit("NewPlayer",{
                id:newUserId,
                x:userData.x,
                y:userData.y,
                PlayerIconId:data.userData.PlayerIconId,
                name:userData.name,
                DBid:authdata.id
            })
            // here i'm getting all players on room and sending their details to new joined player
            const clientsInRoom = io.sockets.adapter.rooms.get(`${roomName}`);
            let ExistingPlayers:{id:string,x:number,y:number,PlayerIconId:number,name:string,DBid:number}[] = []
            if (clientsInRoom) {    
                clientsInRoom.forEach((clientId: string) => {
                    if (clientId != newUserId) {
                        const clientSocket = io.sockets.sockets.get(clientId);
                        if(clientSocket){
                            ExistingPlayers.push({id:clientId,x:clientSocket.data.info.x,y:clientSocket.data.info.y,PlayerIconId:clientSocket.data.info.PlayerIconId,name:clientSocket.data.info.name
                                ,DBid:clientSocket.data.info.id
                            })
                        }
                    }
                });
            }
            socket.emit("GetExistingPlayer", {
                id: newUserId,
                userData: {ExistingPlayers}
            });
        }catch(e){
            console.log("join room error",e )
        }
    });
    // sending other that player has been disconnected to all connected player , lemon remember to change this to send to only that room
    socket.on('disconnect', () => {
        // Loop through the rooms the user was in
        const id = socket.id
        console.log("disconnec4etd")
        io.emit("RoomRemoveResponse",{id})
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

setInterval(()=>{
    // console.clear();
    const clientsInRoom = io.sockets.adapter.rooms.get('1');
    if (clientsInRoom) {    
        clientsInRoom.forEach((clientId: string) => {
            const clientSocket = io.sockets.sockets.get(clientId);
            if(clientSocket){
               console.log(clientSocket.data.info)
            }
        });
    }
    
},2000)