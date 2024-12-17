'use server'
import { z } from "zod";
import { RoomType, RoomTypeDB, UserTypeDB } from "./datatype";
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"
const prisma  = new PrismaClient();



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

export async function RoleManage(data:{userid:number,role:"ADMIN"|"SUBADMIN"}):Promise<{error:string,success:boolean}>{
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


export async function SignIn({email,password}:{email:string,password:string}):Promise<{error:string,success:boolean,data:UserTypeDB|null}>{
    try{
        const req = await prisma.user.findFirst({
            where:{
                email
            }
        })
        if(!req)
            return {error:"Invalid Credential",success:false,data:null}
        bcrypt.compare(password, req.password, function(err, result) {
            if(!result) return {error:"Invalid Credential",success:false,data:null}
        });
        return {success:true, error:"",data:req};
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:null}
        }
        return {error:"Invalid Credential",success:false,data:null}
    }
}

export async function SignUp({email,password,name}:{email:string,password:string,name:string}):Promise<{error:string,success:boolean,data:UserTypeDB|null}>{
    try{
        password = bcrypt.hashSync(password,10);
        console.log({email,password,name})
        const req = await prisma.user.create({
            data:{
                email:email,
                password:password,
                name: name || "unknown"
            }
        })
        console.log("working")
        return {success:true, error:"",data:req}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:null}
        }
        return {error:"Can't create account",success:false,data:null}
    }
}