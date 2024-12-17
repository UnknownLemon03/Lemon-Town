'use server'
import jwt from "jsonwebtoken"
import { UserTypeDB } from "./datatype"
import { cookies } from "next/headers";


export async function CreateJWTSession(e:UserTypeDB){
    const data = {id:e.id}

    const token = jwt.sign(data,process.env.JWT_SECRETE!);
    const cookieStore = await cookies();
    cookieStore.set("AUTH",token)
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
