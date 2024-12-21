'use server'
import jwt from "jsonwebtoken"
import { UserTypeDB } from "./datatype"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GetRole } from "./database";
import { PrismaClient } from '@prisma/client';
const prisma  = new PrismaClient();
export async function CreateJWTSession(e:UserTypeDB){
    const data = {
        id:e.id,
        name:e.name,
    }

    const token = jwt.sign(data,process.env.JWT_SECRETE!,{expiresIn:"12h"});
    const cookieStore = await cookies();
    cookieStore.set("AUTH",token,{expires:new Date(Date.now()+1000*60*60*12)})
}

export async function GetJWTSession(){
    const cookieStore = await cookies();
    const token = cookieStore.get("AUTH");
    if(token){
        const {value} = token;
        const res = jwt.verify(value,process.env.JWT_SECRETE!)
        return {data:res,error:false};
    }
    return {data:null,error:true};
}

export async function LogOut(){
    'use client'
    const cookieStore = await cookies();
    cookieStore.delete("AUTH");
    return redirect("/")
}

export async function Auth(){
    const cookie = await cookies();
    return cookie.get("AUTH")
}

export async function isLogin(redirect?:boolean):Promise<undefined|null|{id:number,name:string}>{
    const cookie = await cookies();
    const token = cookie.get("AUTH");
    if(!token) return null;
    const data = jwt.verify(token.value,process.env.JWT_SECRETE as string) as {id:number,name:string}
    return data;
}

export async function isAdmin(id?:number){
    let nid;
    if(!id){
        const data = await isLogin();
        if(!data) return false;
        nid = data.id;
    }else{
        nid = id
    }
    const {data:Role} = await GetRole({id:nid})
    if(!Role) return false;
    return true;
}

export async function isRoomAdmin(id?:number){
    let nid ;
    if(!id){
        const data = await isLogin();
        if(!data) return false;
        nid = data.id
    }else 
        nid = id;
    const req = await prisma.roomcontrol.findFirst({where:{userid:nid}})

    return !req ? false : true;
}

export async function isRoomAdminCheck(){
     const islogin = await isLogin()
    if(!islogin) return redirect("/login")
    const isroomadmin = await isRoomAdmin(islogin.id);
    if(!isroomadmin) redirect("/dashboard");
}

export  async function checkRoomAccess(roomid:number,userid:number){
    const req = await prisma.roomaccess.findFirst({
        where:{
            AND:{
                roomid,
                userid
            }
        }
    })
    console.log(req,"room access");
    if(req) return true;
    return false;
}
