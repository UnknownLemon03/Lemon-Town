
'use server'
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { isAdmin } from "./Auth";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



const bucketName = process.env.AWS_BUCKET_NAME!
const region = process.env.AWS_BUCKET_REGION!
const accessKeyId = process.env.AWS_ACCESS_KEY!
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})
export async function AWSUpload(fileType:string,fileSize:number,checksum:string,id:string):Promise<{error:string,success:boolean,data:string}>{
    try{ 
        ////type -> application/epub+zip
        // if(fileType != "application/epub+zip"){
        //     return {error:"", success:false,data:"File must be .epub"}
        // }
        const isadmin = await isAdmin()
        if(!isadmin)
            return {error:"you don't have permission to do that", success:false,data:""}
            
        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `${id}.json`,
            ContentType: fileType,
            ContentLength: fileSize,
            ChecksumSHA256: checksum,
        })
        const url = await getSignedUrl(s3Client,putObjectCommand,{
            expiresIn:60*5
        })
        return {error:"", success:true,data:url}
    }catch(e){
        let meassage = "";
        (e instanceof Error) ? meassage=e.message : "Some error occured while uploading";
        return {error:meassage,success:false,data:""}
    }
}

export async function AWSDelete(id:string):Promise<{error:string,success:boolean}>{
    try{
        const isadmin = await isAdmin()
        if(!isadmin)
            return {error:"you don't have permission to do that", success:false}

        const DeleteParam = {
            Bucket: bucketName,
            Key:`${id}.json`,
        }
        const res = await s3Client.send(new DeleteObjectCommand(DeleteParam))

        return {error:"",success:true}  
    }catch(e){
        let meassage = "";
        (e instanceof Error) ? meassage=e.message : "Some error occured while uploading";
        return {error:meassage,success:false}
    }
}

async function AWSGet(id:string,validity=3600):Promise<{error:string,success:boolean,data:string}>{
    try{
        const GetParams = {
            Bucket: bucketName,
            Key:`${id}.json`,
        }
        const command = new GetObjectCommand(GetParams);
        const url = await getSignedUrl(s3Client, command, { expiresIn: validity });
        return {error:"",success:true,data:url}
    }catch(e){
        let meassage = "";
        (e instanceof Error) ? meassage=e.message : "Some error occured while uploading";
        return {error:meassage,success:false,data:""}
    }
}

export async function GetMapUrlRoom(id:number):Promise<{url:string}>{
    try{
        const roomid = await prisma.roommaps.findUnique({
            where:{
                roomid:id
            }
        })
        if(!roomid) return {url:"/town/map.json"}
        const {data} = await AWSGet(roomid.mapid);
        return {url:data}
    }catch(e){
        return {url:"/town/map.json"}
    }
}