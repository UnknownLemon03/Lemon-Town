'use server'
import { PreviewData } from "next";
import { AddMapDB, AddNewRoomDB, ChangeTownMapDB, ChangeTownNameDB, DeleteMapDB, DeleteRoomDB, ManageAdmin, SignIn, SignUp, ToogleUserFromRoom, ToogleUserFromRoomControl, UpdateUser } from "./database";
import { revalidatePath } from "next/cache";
import { CreateJWTSession, isLogin } from "./Auth";
import { AWSDelete } from "./cloude";

export async function AddRoomServerAction(formState:PreviewData,formData:FormData){
    const data = {
        name:formData.get("name") as string ,
    }
    const mapid = parseInt(formData.get("mapid") as string)
    if(isNaN(mapid)) return {error:"enter valid id",success:false}
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
        id:formData.get('id') as string 
    };

    data.start = isNaN(data.start) ? -1 : data.start;
    data.end = isNaN(data.end) ? -1 : data.end;
    const req = await AddMapDB(data)
    if(req.success) revalidatePath(`/dashboard/maps`)
    return req;
}
export async function DeleteMapServerAction(formState:PreviewData,formData:FormData){
    const data = {
        id:formData.get("id")! as string
    };
    const awsreq = await AWSDelete(data.id);
    if(!awsreq.success) return awsreq
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

export async function ChangeUserNameServerAction(formState:PreviewData,formData:FormData){
    const data = {
        name:formData.get("name")! as string,
    };
    if(data.name.trim().length == 0)
            return {error:"Invalid Name",success:false,data:''};
    const user = await isLogin()
    if(!user) return {error:"Login First",success:false,data:''};
    const req = await UpdateUser({id:user.id,name:data.name});
    if(req.success && req.data){
        CreateJWTSession(req.data);
    }
    return req;
}

export async function DeleteSuperAdminServerAction(formState:PreviewData,formData:FormData){
    let data = {
        id:parseInt(formData.get("id") as string),
    };
    if(isNaN(data.id)) return {error:"Invalid id",success:false,data:"Invalid id"};
    const {success,error} = await ManageAdmin({...data,action:"DELETE"});
    revalidatePath("/dashboard/admins","page")
    return {success,error};
}
export async function AddSuperAdminServerAction(formState:PreviewData,formData:FormData){
    const data = {
        id:parseInt(formData.get("id") as string),
    };
    if(isNaN(data.id)) return {error:"Invalid id",success:false,data:"Invalid id"};
    const req = await ManageAdmin({...data,action:"ADD"});
    revalidatePath("/dashboard/admins","page")
    return req;
}

export async function ChangeTownNameServerAction(formState:PreviewData,formData:FormData){
    const data = {
        id:parseInt(formData.get("id") as string),
        name:(formData.get("name") as string).trim()
    };
    if(data.name.length ==0 ) return {error:"Invalid Name",success:false};
    if(isNaN(data.id)) return {error:"Invalid id",success:false};
    const req = await ChangeTownNameDB(data);
    revalidatePath("/dashboard/manage","page")
    return req;
}
export async function ChangeTownMapServerAction(formState:PreviewData,formData:FormData){
    const data = {
        mapid:formData.get("mapid") as string,
        roomid:parseInt(formData.get("roomid") as string)
    };
    if(isNaN(data.roomid)) return {error:"Invalid id",success:false};
    const req = await ChangeTownMapDB(data);
    console.log("change map req",req)
    if(req.success) revalidatePath('/dashboard/manage')
    return req;
}