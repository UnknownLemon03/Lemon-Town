"use server"

import { redirect } from "next/navigation";
import Town from "./Town"
import { checkRoomAccess, isLogin } from "@/backend/Auth";
import { GetMapUrlRoom } from "@/backend/cloude";
export default async function page({searchParams}:{searchParams:{roomid:string}}) {
  const login = await isLogin();
  if(!login) return redirect("/login")
  const {roomid} = await searchParams;
  if(!roomid) return redirect("/dashboard/towns")
  const id = parseInt(roomid);
  if(isNaN(id)) return redirect("/dashboard/towns")
  const access = await checkRoomAccess(id,login.id);
  if(!access) return redirect("/dashboard");
  const mapurl = await GetMapUrlRoom(id);
  return (<>
  <div className="chaning-background">
    <Town roomid={id} name={login.name} mapurl={mapurl.url} x={mapurl.x} y={mapurl.y}/>
  </div>
</>
  )
}
