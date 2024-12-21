"use server"

import { redirect } from "next/navigation";
import Town from "./Town"
import { parse } from "path";

export default async function page({searchParams}:{searchParams:{roomid:string}}) {
  const {roomid} = await searchParams;
  if(!roomid) return redirect("/dashboard/towns")
  const id = parseInt(roomid);
  if(isNaN(id)) return redirect("/dashboard/towns")
  return (<>
    <Town roomid={id}/>
</>
  )
}
