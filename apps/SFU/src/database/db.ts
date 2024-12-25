import { PrismaClient } from '@prisma/client';
import { RoomTypeDB } from './types';
const prisma  = new PrismaClient();


export async function GetRoomDB({id}:{id?:number}):Promise<{error:string,success:boolean}>{
    try{
        const req = await prisma.room.findMany({
            where:{
                id
            }
        })
        if(!req) return {success:false,error:"room doesn't exist"}
        return {success:true, error:""}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Creating Room",success:false}
    }
    
}

export async function GetAuthRoom({roomid,userid}:{roomid:number,userid:number}):Promise<{error:string,success:boolean}>{
    try{
        const req = await prisma.roomaccess.findMany({
            where:{
                roomid,
                userid
            }
        })
        if(!req) return {success:false,error:"no access doesn't exist"}
        return {success:true, error:""}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Creating Room",success:false}
    }
    
}
