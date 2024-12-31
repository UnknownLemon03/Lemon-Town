'use client'
import { GetAdmins, SearchUser } from '@/backend/database'
import { RoomTypeDB, UserTypeDB } from '@/backend/datatype'
import { DeleteSuperAdminServerAction } from '@/backend/serverAction'
import Link from 'next/link'
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
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
        const {data,success,error} = await GetAdmins({email:e});
        if(error){
          toast.error(error)
        }else{
          setRes(data);
        }
      },400)
      console.log(data)
  }
  const [preState,action] = useActionState(DeleteSuperAdminServerAction,{success:false,error:""});
    useEffect(()=>{
        if(preState.error=="" && preState.success){
            toast.success("Admin Delete");
        }
        if(preState.error!="" && !preState.success){
            toast.success(preState.error);
        }
    },[preState])
  async function handleDelete(id:number){
      const data = new FormData();
      data.set("id",`${id}`);
      startTransition(()=>{
        action(data);
      })
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
          <Link href="#" onClick={()=>handleDelete(e.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-2">Delete Admin</Link>
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
            <Link href="#" onClick={()=>handleDelete(e.id)}  className="font-medium text-red-600 dark:text-red-500 hover:underline mx-2">Delete Admin</Link>
        </td>
    </tr>)}
    </>
  )
}
