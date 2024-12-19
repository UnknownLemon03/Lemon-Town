'use client'
import { SearchUser } from '@/backend/database'
import { RoomTypeDB, UserTypeDB } from '@/backend/datatype'
import { AddUserToRoomServerAction, DeleteRoomServerAction } from '@/backend/serverAction'
import Link from 'next/link'
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
type RoomType = z.infer<typeof RoomTypeDB>
type RoomsUsers= {
  id: number;
  email: string;
  name: string;
}[]
export default function UserRow({data,search}:{data:RoomsUsers,search:string}) {
  const [res,setRes] = useState<UserTypeDB[]>([]);
  async function handleChange(e:string){
      if(e == ""){
        return setRes([])
      }
      setTimeout(async ()=>{
        const {data,success,error} = await SearchUser({email:e});
        if(error){
          toast.error(error)
        }else{
          setRes(data);
        }
      },400)
      console.log(data)
  }
  useEffect(()=>{
    handleChange(search);
  },[search])
  return (
    <>
    {!search && data.map((e,i)=><tr key={i}>
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
            <Link href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline mx-2">Delete Account</Link>
        </td>
    </tr>)}
    {(data.length == 0 || (search && res.length == 0)) &&<tr><td scope="row" colSpan={5} className="px-6 text-center py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            No user found
        </td></tr>}
    {res.length != 0 && res.map((e,i)=><tr key={i}>
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
            <Link href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline mx-2">Delete Account</Link>
        </td>
    </tr>)}
    </>
  )
}
