'use server'
import { z } from "zod";
import { MapTypeDB, RoomType, RoomTypeDB, UserTypeDB } from "./datatype";
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

export async function SearchUser({email,name}:{email:string,name?:string}):Promise<{error:string,success:boolean,data:UserTypeDB[]}>{
    try{
        const req = await prisma.user.findMany({
            where:{
                email:{contains:email}
            },
            take:10 
        })
        return {success:true, error:"",data:req}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Seraching User",success:false,data:[]}
    }
}

export async function CheckRoom({roomid}:{roomid:number}):Promise<{success:boolean,error:string}>{
    try{
        const req = await prisma.room.findUnique({
            where:{
                id:roomid
            }
        })
        if(!req)
        return {success:false, error:"Room doesn't"}
        return {success:true, error:""}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Seraching User",success:false}
    }
}

export async function GetRoomUsers({roomid}:{roomid:number}):Promise<{success:boolean,error:string,data:{id:number,email:string,name:string}[]}>{
    try{
        const req = await prisma.roomaccess.findMany({
            where:{
                roomid:roomid
            },
            include:{
                user:{
                    select:{
                        id:true,
                        email:true,
                        name:true
                    }
                },
            }
        })
        const data = req.map(e=>({email:e.user.email,id:e.userid,name:e.user.name}))
        return {success:true, error:"",data}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Seraching User",success:false,data:[]}
    }
}
export async function GetRoomControlUsers({roomid}:{roomid:number}):Promise<{success:boolean,error:string,data:{id:number,email:string,name:string}[]}>{
    try{
        const req = await prisma.roomcontrol.findMany({
            where:{
                roomid:roomid
            },
            include:{
                user:{
                    select:{
                        id:true,
                        email:true,
                        name:true
                    }
                },
            }
        })
        const data = req.map(e=>({email:e.user.email,id:e.userid,name:e.user.name}))
        return {success:true, error:"",data}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Seraching User",success:false,data:[]}
    }
}

export async function ToogleUserFromRoom({roomid,userid}:{roomid:number,userid:number}):Promise<{error:string,success:boolean,data:string}>{
    try{
        let req = await prisma.roomaccess.findUnique({
            where:{
                userid_roomid:{
                    userid,
                    roomid
                }
            }
        })
        let msz:string;
        if(req){
            await prisma.roomaccess.delete({
                where:{
                    userid_roomid: {
                        userid,
                        roomid
                    }
                }
            })
            msz = "User remove sucessfully"
        }else{
            await prisma.roomaccess.create({
                data:{
                    userid,
                    roomid
                }
            })
            msz = "User added successfully"
        }
        return {success:true, error:"",data:msz}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:""}
        }
        return {error:"Error Seraching User",success:false,data:""}
    }
}
export async function ToogleUserFromRoomControl({roomid,userid}:{roomid:number,userid:number}):Promise<{error:string,success:boolean,data:string}>{
    try{
        let req = await prisma.roomcontrol.findUnique({
            where:{
                userid_roomid:{
                    userid,
                    roomid
                }
            }
        })
        let msz:string;
        if(req){
            await prisma.roomcontrol.delete({
                where:{
                    userid_roomid: {
                        userid,
                        roomid
                    }
                }
            })
            msz = "User remove sucessfully"
        }else{
            await prisma.roomcontrol.create({
                data:{
                    userid,
                    roomid
                }
            })
            msz = "User added successfully"
        }
        return {success:true, error:"",data:msz}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:""}
        }
        return {error:"Error Seraching User",success:false,data:""}
    }
}

export async function GetAllUsers({limit,skip}:{limit?:number,skip?:number}):Promise<{error:string,success:boolean,data:UserTypeDB[]}>{
    try{
        let req:UserTypeDB[];
        if(limit){
            if(!skip) skip = 0;
            req = await prisma.user.findMany({
                skip,
                take:limit
            });
        }else
            req = await prisma.user.findMany();
        return {success:true, error:"",data:req}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Seraching User",success:false,data:[]}
    }
}
export async function GetAllMap({id}:{id?:number}):Promise<{error:string,success:boolean,data:MapTypeDB[]}>{
    try{
        let req:MapTypeDB[] = [];
        if(id){
            const temp = await prisma.map.findUnique({
                where:{
                    id
                }
            })
            if(temp)
                req.push(temp);
        }else
            req =  await prisma.map.findMany({});
        
        return {success:true, error:"",data:req}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Seraching User",success:false,data:[]}
    }
}
export async function AddMapDB({name,start,end}:{name:string,start:number,end:number}):Promise<{error:string,success:boolean}>{
    try{
 
        const temp = await prisma.map.create({
            data:{
                name,start,end
            }
        })
        return {success:true, error:""}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Seraching User",success:false}
    }
}
export async function DeleteMapDB({id}:{id:number}):Promise<{error:string,success:boolean}>{
    try{
 
        const temp = await prisma.map.delete({
            where:{
                id
            }
        })
        return {success:true, error:""}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Seraching User",success:false}
    }
}

