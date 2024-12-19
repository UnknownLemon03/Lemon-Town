'use server'
import { PreviewData } from "next";
import { AddMapDB, AddNewRoomDB, DeleteMapDB, DeleteRoomDB, SignIn, SignUp, ToogleUserFromRoom, ToogleUserFromRoomControl } from "./database";
import { revalidatePath } from "next/cache";
import { error } from "console";
import { CreateJWTSession, GetJWTSession } from "./Auth";
import AddMap from "@/components/AddMap";

export async function AddRoomServerAction(formState:PreviewData,formData:FormData){
    const data = {
        name:formData.get("name") as string ,
        mapid:parseInt(formData.get("mapid") as string)
    }
    if(isNaN(data.mapid)) return {error:"enter valid id",success:false}
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

        return req;
}

export async function SignInServerAction(formState:PreviewData,formData:FormData){
    const data = {
        email:formData.get("email")! as string,
        password:formData.get("password")! as string,
    };
    const req = await SignIn(data)
    if(req.success && req.data)
        await CreateJWTSession(req.data);
    return req;
}

export async function AddUserToRoomServerAction(formState:PreviewData,formData:FormData){
    const data = {
        roomid:parseInt(formData.get("roomid")! as string),
        userid:parseInt(formData.get("userid")! as string),
    };
    console.clear();
    console.log(data)
    if(isNaN(data.roomid) || isNaN(data.userid))
            return {error:"Invalid data",success:false,data:''};
    const req = await ToogleUserFromRoom(data);
    if(req.success) revalidatePath(`/dashboard/manage/${data.roomid}`)
    // console.log(req)
    return req;
}
export async function AddUserToRoomControlServerAction(formState:PreviewData,formData:FormData){
    const data = {
        roomid:parseInt(formData.get("roomid")! as string),
        userid:parseInt(formData.get("userid")! as string),
    };
    console.clear();
    console.log(data)
    if(isNaN(data.roomid) || isNaN(data.userid))
            return {error:"Invalid data",success:false,data:''};
    const req = await ToogleUserFromRoomControl(data);
    if(req.success) revalidatePath(`/dashboard/rooms/${data.roomid}`)
    // console.log(req)
    return req;
}
export async function AddMapServerAction(formState:PreviewData,formData:FormData){
    const data = {
        name:formData.get("name")! as string,
        start:parseInt(formData.get("start")! as string) || -1,
        end:parseInt(formData.get("end")! as string)|| -1,
    };

    const req = await AddMapDB(data)
    if(req.success) revalidatePath(`/dashboard/maps`)
    return req;
}
export async function DeleteMapServerAction(formState:PreviewData,formData:FormData){
    const data = {
        id:parseInt(formData.get("id")! as string)
    };

    const req = await DeleteMapDB(data)
    if(req.success) revalidatePath(`/dashboard/maps`)
    return req;
}

export async function AddRoomAdminServerAction(formState:PreviewData,formData:FormData){
    const data = {
        roomid:parseInt(formData.get("roomid")! as string),
        userid:parseInt(formData.get("userid")! as string),
    };
    if(isNaN(data.roomid) || isNaN(data.userid))
            return {error:"Invalid data",success:false,data:''};
    const req = await ToogleUserFromRoomControl(data);
    if(req.success) revalidatePath(`/dashboard/manage/${data.roomid}`)
    return req;
}