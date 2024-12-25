console.clear();
import { Server, Socket } from "socket.io";
import http from 'http';
import {  GetAuthRoom, GetRoomDB } from "./database/db";
import jwt from "jsonwebtoken"
const server = http.createServer();
const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"], 
    }
});

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
                socket.to(`${response.roomId}`).emit("NewUser",{id:socket.id,name:userdata.name})
                
                let ExistingUser:{id:string,name:string}[] = []
                const newUserSocketid = socket.id
                console.log(socket.data.info)
                const clientsInRoom = io.sockets.adapter.rooms.get(`${response.roomId}`);
                if (clientsInRoom) {    
                    clientsInRoom.forEach((clientId: string) => {
                        if (clientId != newUserSocketid) {
                            const clientSocket = io.sockets.sockets.get(clientId);
                            if(clientSocket){
                                const data = {id:clientId, name:clientSocket.data.info.name as string}
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
});

server.listen(8000, () => {
    console.log('Server running on port 8000');
});


setInterval(()=>{
    console.clear();
    let ExistingUser:{id:string,name:string}[] = []
    const clientsInRoom = io.sockets.adapter.rooms.get('1');
    if (clientsInRoom) {    
        clientsInRoom.forEach((clientId: string) => {
            const clientSocket = io.sockets.sockets.get(clientId);
            if(clientSocket){
                const data = {id:clientId, name:clientSocket.data.info.name as string}
                ExistingUser.push(data);
            }
        });
    }
    console.log("old users",ExistingUser)
},2000)