'use server'
import { PreviewData } from "next";
import { AddNewRoomDB, DeleteRoomDB, SignIn, SignUp } from "./database";
import { revalidatePath } from "next/cache";
import { error } from "console";
import { CreateJWTSession, GetJWTSession } from "./Auth";

export async function AddRoomServerAction(formState:PreviewData,formData:FormData){
    const data = {
        name:formData.get("name") as string ,
        start:isNaN(parseInt(formData.get("start") as string)) ? -1 : parseInt(formData.get("start") as string),
        end:isNaN(parseInt(formData.get("end") as string)) ? -1 : parseInt(formData.get("end") as string),
        url:formData.get("url") as string
    }
    const req = await AddNewRoomDB(data);
    revalidatePath("/dashboard/rooms","layout")
    console.log(req)
    return req;
}

export async function DeleteRoomServerAction(formState:PreviewData,formData:FormData){
    if(isNaN(parseInt(formData.get('id') as string)))
        return {error:"enter valid id",success:false};
    
    const id = parseInt(formData.get('id') as string);
    const req = await DeleteRoomDB(id);
    revalidatePath("/dashboard/rooms","layout")
    return req;
}

export async function SignUpServerAction(formState:PreviewData,formData:FormData){
        const data = {
            name:(formData.get("name") != "" ?  formData.get("name")  : "Unknown") as string,
            email:formData.get("email")! as string,
            password:formData.get("password")! as string,
        };
        const req = await SignUp(data)
        console.log(req)
        if(req.success && req.data)
            await CreateJWTSession(req.data);
        await GetJWTSession()
        return req;
}

export async function SignInServerAction(formState:PreviewData,formData:FormData){
    const data = {
        email:formData.get("email")! as string,
        password:formData.get("password")! as string,
    };
    const req = await SignIn(data)
    console.log(req);   
    return req;
}