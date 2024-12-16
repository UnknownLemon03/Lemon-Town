'use server'
import { z } from "zod";
import { RoomType, RoomTypeDB } from "./datatype";
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from "next/cache";
const prisma  = new PrismaClient();

type RoomType = z.infer<typeof RoomType>
type RoomTypeDB = z.infer<typeof RoomTypeDB>

export async function AddNewRoomDB(data:RoomType):Promise<{error:string,success:boolean}>{
    try{
        RoomType.parse(data);
        const req = await prisma.room.create({
            data
        })
        return {success:true, error:""}
    }catch(e){
        if (e instanceof z.ZodError) {
            const formattedMessage = e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
            return { error: formattedMessage, success: false };
        }
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Creating Room",success:false}
    }
    
}
export async function GetRoomDB():Promise<{error:string,success:boolean,data:RoomTypeDB[]}>{
    try{

        const req = await prisma.room.findMany()
        return {success:true, error:"",data:req};
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Creating Room",success:false,data:[]}
    }
    
}
export async function DeleteRoomDB(id:number):Promise<{error:string,success:boolean}>{
    try{
        revalidatePath("/dashboard/rooms",'layout')
        const req = await prisma.room.delete({
            where:{
                id
            }
        })
        return {success:true, error:""};
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Creating Room",success:false}
    }
    
}

export async function RoleManage(data:{userid:number,role:"ADMIN"}):Promise<{error:string,success:boolean}>{
    try{
        const req = await prisma.roles.upsert({
            update:{
                ...data
            },
            create:{
                ...data
            },
            where:{
                userid:data.userid
            }
        })
        return {success:true, error:""}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Creating Room",success:false}
    }
    
}