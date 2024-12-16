import { io, Socket } from "socket.io-client";
import { AllSidePlayers } from "./SidePlayer";



let socket:Socket;
export function ConnectSoket(x:number,y:number,room:string){
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    // Join a room
    const roomName = room;
    const userData = { x , y};
    socket.emit('joinRoom', { roomName, userData });
    return socket;
}   


export function getSocket(){
    return socket;
}

