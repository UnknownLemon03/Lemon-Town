'use server'
import { z } from "zod";
import { MapTypeDB, RoomType, RoomTypeDB, UserTypeDB } from "./datatype";
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"
import { trackSynchronousRequestDataAccessInDev } from "next/dist/server/app-render/dynamic-rendering";
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
        const isMatch = await bcrypt.compare(password, req.password);
        if(!isMatch)
            return {error:"Invalid Credential",success:false,data:null}
        
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
        console.log(msz)
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
export async function GetAllMap({id}:{id?:string}):Promise<{error:string,success:boolean,data:MapTypeDB[]}>{
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
export async function AddMapDB({id,name,start,end}:{id:string,name:string,start:number,end:number}):Promise<{error:string,success:boolean}>{
    try{
 
        const temp = await prisma.map.create({
            data:{
                id,name,start,end
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
export async function DeleteMapDB({id}:{id:string}):Promise<{error:string,success:boolean}>{
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

export async function GetRoomOfUser({id}:{id:number}):Promise<{error:string,success:boolean,data:{roomid:number,name:string}[]}>{
    try{
 
        const temp = await prisma.roomaccess.findMany({
            where:{
                userid:id
            },
            include:{
                room:true
            }
        })
        const room = temp.map(e=>({roomid:e.roomid,name:e.room.name}))
        console.log(temp)
        return {success:true, error:"",data:room}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Seraching User",success:false,data:[]}
    }
}

export async function UpdateUser({name,id}:{name:string,id:number}):Promise<{error:string,success:boolean,data:UserTypeDB|null}>{
    try{
 
        const temp = await prisma.user.update({
            where:{
                id
            },
            data:{
                name
            }
        })
        console.log(temp)

        return {success:true, error:"",data:temp}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:null}
        }
        return {error:"Error Seraching User",success:false,data:null}
    }
}
export async function ManageAdmin({id,action}:{action:"ADD"|"DELETE",id:number}):Promise<{error:string,success:boolean,data:string}>{
    try{
        let data:string ="";
        switch(action){
            case "ADD":
                await prisma.roles.create({
                    data:{
                        userid:id,
                        role:"ADMIN",
                    }
                })
                data = "user added successfully"
                break;
            case "DELETE":
                await prisma.roles.delete({
                    where:{
                        userid:id,
                    }
                })
                data = "user deleted successfully"
                break;
        }
        return {success:true, error:"",data}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:"can't adde user"}
        }
        return {error:"Error Seraching User",success:false,data:"can't adde user"}
    }
}
export async function GetAdmins({email}:{email?:string}):Promise<{error:string,success:boolean,data:UserTypeDB[]}>{
    try{
        let data:UserTypeDB[] = [];
        if(email){  
            const req = await prisma.user.findMany({
                where:{
                    email:{
                        contains:email
                    },
                    roles:{
                        some:{}
                    }
                },
                include:{
                    roles:true
                }
            })
            req.forEach(({email,id,name})=>{
                data.push({email,id,name,password:""})
            })
        }else{
            const req = await prisma.user.findMany({
                where:{
                    roles:{
                        some:{}
                    }
                },
                include:{
                    roles:true
                }
            })
            req.forEach(e=>{
                e.password = ""
                data.push(e);
            })
            console.log('raw',req)
        }
        return {success:true, error:"",data}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Seraching User",success:false,data:[]}
    }
}


export async function GetRole({id}:{id:number}):Promise<{error:string,success:boolean,data:{userid: number,role: string}|null}>{
    try{
        const data = await prisma.roles.findFirst({
            where:{
                userid:id
            }
        })
        return {success:true, error:"",data}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:null}
        }
        return {error:"Error Seraching User",success:false,data:null}
    }
}
export async function GetUserControlRooms({id}:{id:number}):Promise<{error:string,success:boolean,data:{
    id: number;
    name: string,
    mapId:string
}[]}>{
    try{
        const data = await prisma.roomcontrol.findMany({
            where:{
                userid:id
            },
            include:{
               room:{
                    include:{
                        roommaps:{
                            include:{
                                map:true
                            }
                        }
                    }
               }
            }
        })

        const rooms = data.map(e=>{
            return {id:e.room.id,name:e.room.name,mapId: e.room.roommaps?.mapid ?? "-1"}
        })
        return {success:true, error:"",data:rooms}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false,data:[]}
        }
        return {error:"Error Seraching User",success:false,data:[]}
    }
}


export async function ChangeTownNameDB({id,name}:{id:number,name:string}):Promise<{error:string,success:boolean}>{
    try{
        const data = await prisma.room.update({
            where:{
                id
            },
            data:{
                name
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

export async function ChangeTownMapDB({mapid,roomid}:{roomid:number,mapid:string}):Promise<{error:string,success:boolean}>{
    try{
        if(mapid == "-1"){
            await prisma.roommaps.delete({
                where: { roomid},
            })
            console.clear();
            console.log("detleing")
        }else{
            await prisma.roommaps.upsert({
                where: { roomid_mapid: { roomid, mapid } }, // Use composite key
                update: { mapid }, // Update mapid if entry exists
                create: { roomid, mapid }, // Create new entry if it doesn't
            })
            console.log("updating")
        }
        return {success:true, error:""}
    }catch(e){
        if(e instanceof Error){
            return {error:`${e.name}-${e.message}`,success:false}
        }
        return {error:"Error Seraching User",success:false}
    }
}
