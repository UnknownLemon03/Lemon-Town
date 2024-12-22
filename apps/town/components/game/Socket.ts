import { io, Socket } from "socket.io-client";
import { AllSidePlayers } from "./SidePlayer";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { resolve } from "path";



let socket:Socket;
export async function ConnectSoket(x:number,y:number,room:number,{PlayerIconId,Auth,name}:{PlayerIconId:number,Auth:string,name:string}){
    return new Promise((res,rej)=>{
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
        // Join a room
        const roomName = room;
        socket.on('connect',()=>{

        })
        socket.on("AUTH",(callback)=>{
            const userData = { x , y , Auth,PlayerIconId,name};
            callback({Auth})
            res(socket);
        })
        socket.on('connect_error', (err) => {
            rej(new Error(`Connection failed: ${err.message}`));
        });
        socket.on("disconnect",()=>{
            toast.success("You are existing Town")
            return redirect("/dashboard/towns")
        })
    })
}   


export function getSocket(){
    // console.log("get socket",socket)
    return socket;
}
export function disconnectSocket(){
    socket.disconnect();
}

