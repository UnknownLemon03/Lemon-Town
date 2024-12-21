"use server"

import { redirect } from "next/navigation";
import Town from "./Town"
import { parse } from "path";
import { checkRoomAccess, isLogin } from "@/backend/Auth";
import { log } from "console";

export default async function page({searchParams}:{searchParams:{roomid:string}}) {
  const login = await isLogin();
  if(!login) return redirect("/login")
  const {roomid} = await searchParams;
  if(!roomid) return redirect("/dashboard/towns")
  const id = parseInt(roomid);
  if(isNaN(id)) return redirect("/dashboard/towns")
  const access = await checkRoomAccess(id,login.id);
  if(!access) return redirect("/dashboard");
  return (<>
    <Town roomid={id} name={login.name}/>
</>
  )
}
