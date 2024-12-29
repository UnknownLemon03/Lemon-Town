import { AccessToken } from "livekit-server-sdk";
import dotenv from 'dotenv';
dotenv.config();
export async function GetRoomToken(room:string,username:string,roomAdmin:boolean) {
  try{
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const access = new AccessToken(apiKey, apiSecret, { identity: username });
    access.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true ,roomAdmin});
    const token = await access.toJwt();
    return token;
  }catch(e){
    console.log(e)
    return null;
  }
}