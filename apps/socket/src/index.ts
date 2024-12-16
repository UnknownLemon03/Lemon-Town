console.clear();
import { Server, Socket } from "socket.io";
import http from 'http';
import {  GetRoomDB } from "./database/db";

const server = http.createServer();
const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"], 
    }
});

io.on('connection', (socket: Socket) => {
    // this event gives coordinate to other player 
    socket.on("UpdatePlayerLocation",(data:{roomName:string,userData:{x:number,y:number} })=>{
        // send to every other player except sender 
        socket.broadcast.to(data.roomName).emit("UserNewLocation",{id:socket.id,x:data.userData.x,y:data.userData.y})
        // i'm also saving this in on server on player socket instance
        socket.data.location = {x:data.userData.x,y:data.userData.y}
    })

    socket.on('joinRoom', (data: { roomName: string, userData: {x:number,y:number} }) => {
        console.log("somebody is joining ",socket.id)
        const { roomName, userData } = data;
        socket.join(roomName);
        const newUserId = socket.id;
        socket.data.location = {x:userData.x,y:userData.y};
        // infoming other player on server about player 
        socket.broadcast.to(data.roomName).emit("NewPlayer",{
            id:newUserId,
            x:userData.x,
            y:userData.y
        })
        // here i'm getting all players on room and sending their details to new joined player
        const clientsInRoom = io.sockets.adapter.rooms.get(roomName);
        let ExistingPlayers:{id:string,x:number,y:number}[] = []
        if (clientsInRoom) {    
            clientsInRoom.forEach((clientId: string) => {
                if (clientId != newUserId) {
                    const clientSocket = io.sockets.sockets.get(clientId);
                    if(clientSocket){
                        ExistingPlayers.push({id:clientId,x:clientSocket.data.location.x,y:clientSocket.data.location.y})
                    }
                }
            });
        }
        socket.emit("GetExistingPlayer", {
            id: newUserId,
            userData: {ExistingPlayers}
        });
    });
    // sending other that player has been disconnected to all connected player , lemon remember to change this to send to only that room
    socket.on('disconnect', () => {
        // Loop through the rooms the user was in
        const id = socket.id
        io.emit("RoomRemoveResponse",{id})
    });
});
async function getRoom(){
    setTimeout(async()=>{
        GetRoomDB().then((e=>{
            console.log(e.data)
        }))
        getRoom();
    },2000)
}
getRoom();
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
