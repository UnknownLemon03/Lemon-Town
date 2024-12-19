import { io, Socket } from "socket.io-client";
import { AllSidePlayers } from "./SidePlayer";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { resolve } from "path";



let socket:Socket;
export async function ConnectSoket(x:number,y:number,room:string,Auth:string){
    return new Promise((res,rej)=>{
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
        // Join a room
        const roomName = room;
        socket.on('connect',()=>{

        })
        socket.on("AUTH",(data,callback)=>{
            const userData = { x , y , Auth};
            callback({Auth})
            socket.emit('joinRoom', { roomName, userData });
            res(socket);
        })
        socket.on('connect_error', (err) => {
            rej(new Error(`Connection failed: ${err.message}`));
        });
        socket.on("disconnect",()=>{
            toast.error("You are disconnected from server")
            redirect("/dashboard")
        })
        return socket;
    })
}   


export function getSocket(){
    return socket;
}

