'use client'
import { RoomTypeDB } from '@/backend/datatype'
import { AddUserToRoomControlServerAction, AddUserToRoomServerAction, DeleteRoomServerAction } from '@/backend/serverAction'
import Link from 'next/link'
import React, { startTransition, useActionState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
type RoomType = z.infer<typeof RoomTypeDB>
type RoomsUsers= {
  id: number;
  email: string;
  name: string;
}[]
export default function RoomRow({data,roomid}:{data:RoomsUsers,roomid:number}) {
  const [preStat,action] = useActionState(AddUserToRoomControlServerAction,{error:"",success:false,data:""});
  useEffect(()=>{
      console.log(preStat)
      if(preStat.success == true && preStat.error == "" && preStat.data!=""){
          toast.success(preStat.data)
      }
  },[preStat])
  function handleDeleteUser(userid:number){
      startTransition(()=>{
        const data = new FormData();
        data.set('userid',`${userid}`);
        data.set('roomid',`${roomid}`);
        action(data)
      })
  }
  return (
    <>
    {data.map((e,i)=><tr key={i}>
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {e.id}
        </th>
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
         {e.name}
        </th>
        <td className="px-6 py-4">
            {e.email}
        </td>
        <td className="px-6 py-4">
            <Link href="#" onClick={()=>handleDeleteUser(e.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-2">Remove</Link>
        </td>
    </tr>)}
    {data.length == 0 &&<tr><td scope="row" colSpan={5} className="px-6 text-center py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            No Room found
        </td></tr>}
    </>
  )
}
