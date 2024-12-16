'use client'
import { RoomTypeDB } from '@/backend/datatype'
import { DeleteRoomServerAction } from '@/backend/serverAction'
import Link from 'next/link'
import React, { startTransition, useActionState, useEffect } from 'react'
import { z } from 'zod'
type RoomType = z.infer<typeof RoomTypeDB>
export default function RoomRow({data}:{data:RoomType[]}) {
    const [preState,action,isPending] = useActionState(DeleteRoomServerAction,{error:"",success:false})
    useEffect(()=>{
        if(preState.success){
            // do something
        }
    },[preState])
    function handleDelete(id:number){
        const data = new FormData();
        data.set("id",`${id}`);
        startTransition(() => {
            action(data); // This ensures the action is dispatched within the transition
        });
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
            {e.start}
        </td>
        <td className="px-6 py-4">
            {e.end}
        </td>
        <td className="px-6 py-4">
            <Link href="/admin/edit" className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2">Edit</Link>
            <Link href="#" onClick={()=>handleDelete(e.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-2">Delete</Link>
        </td>
    </tr>)}
    </>
  )
}
