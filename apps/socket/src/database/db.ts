import { PrismaClient } from '@prisma/client';
import { RoomTypeDB } from './types';
const prisma  = new PrismaClient();


export async function GetRoomDB():Promise<{error:string,success:boolean,data:RoomTypeDB[]}>{
    try{
        const req = await prisma.room.findMany()
        return {success:true, error:"",data:req}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Creating Room",success:false,data:[]}
    }
    
}


