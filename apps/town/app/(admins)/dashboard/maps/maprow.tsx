'use client'
import { MapTypeDB, RoomTypeDB } from '@/backend/datatype'
import { DeleteMapServerAction } from '@/backend/serverAction'
import Link from 'next/link'
import { act, startTransition, useActionState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
export default function MapRow({data}:{data:MapTypeDB[]}) {
    const [preState,action] = useActionState(DeleteMapServerAction,{success:false,error:""});
    useEffect(()=>{
        if(preState.error=="" && preState.success){
            toast.success("Room Delete");
        }
        if(preState.error!="" && !preState.success){
            toast.success(preState.error);
        }
    },[preState])
    function deleteRoom(id:number){
        const data = new FormData()
        data.set("id",`${id}`);
        startTransition(()=>{
            action(data);
        })
    }
  return (
    <>
    {data.map((e,i)=><tr key={i}>
        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {e.id}
        </td>
        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {e.name}
        </td>
        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {e.start}
        </td>
        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {e.end}
        </td>
        <td className="px-6 py-4">
            <div onClick={()=>deleteRoom(e.id)} className="font-medium cursor-pointer text-red-600 dark:text-red-500 hover:underline mx-2">Delete</div>
        </td>
    </tr>)}
    {data.length == 0 &&<tr><td scope="row" colSpan={5} className="px-6 text-center py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            No map found
        </td></tr>}
    </>
  )
}
