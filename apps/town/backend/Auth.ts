'use server'
import jwt from "jsonwebtoken"
import { UserTypeDB } from "./datatype"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


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

export async function isLogin():Promise<null|{id:number,name:string}>{
    const cookie = await cookies();
    const token = cookie.get("AUTH");
    if(!token) return null;
    const data = jwt.verify(token.value,process.env.JWT_SECRETE as string) as {id:number,name:string}
    return data;
}
