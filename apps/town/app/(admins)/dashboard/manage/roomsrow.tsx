'use client'
import { MapTypeDB, RoomTypeDB } from '@/backend/datatype'
import { ChangeTownMapServerAction, ChangeTownNameServerAction, DeleteRoomServerAction } from '@/backend/serverAction'
import Image from 'next/image'
import Link from 'next/link'
import React, { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
type RoomType = z.infer<typeof RoomTypeDB>
export default function RoomRow({data,mapData}:{data:{id:number,name:string,mapId:string}[],mapData:MapTypeDB[]}) {
    const [preStateNameChange,actionNameChange,isPendingNameChange] = useActionState(ChangeTownNameServerAction,{error:"",success:false})
    const [preStateMapChange,actionMapChange,isPendingMapChange] = useActionState(ChangeTownMapServerAction,{error:"",success:false})
    const [edit,setEdit] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null)
    const mapHashTable:Partial<{[key:string]:MapTypeDB}> = {}
    mapData.forEach(e=>mapHashTable[e.id] = e);
    console.log("--------------------------",data)
    useEffect(()=>{
        
        if(preStateNameChange.success && preStateNameChange.error.length==0){
            // do something
            toast.success("Town name change sucessfully")
        }
        if(preStateMapChange.success && preStateMapChange.error.length==0){
            // do something
            toast.success("Town map Change sucessfully")
        }
    },[preStateNameChange,preStateMapChange])
    
    function handleEdit(){
        setEdit(true); 
        setTimeout(() => nameRef.current?.focus(), 0);
    }
    function handleEndEdit(newTownName:string,TownId:number,oldTownName:string){
            setEdit(false);
            const data = new FormData();
            data.set("name",newTownName);
            data.set("id",`${TownId}`);
            // save to data base
            if(newTownName.trim() == oldTownName.trim()){
                return toast.success("no change in town name")
            }
            startTransition(()=>{
                actionNameChange(data)
            })
          
    }
    function handleChangeMap(roomId:number,mapId:string,oldMapId:string){
            if(mapId.trim() == oldMapId.trim()){
                return 
            }
            const data = new FormData();
            data.set("roomid",`${roomId}`);
            data.set("mapid",`${mapId}`);
            // save to data base
            console.log("new map is ",mapId,roomId)
            startTransition(()=>{
                actionMapChange(data)
            })
          
    }
  return (
    <>
    {data.map((e,i)=><tr key={i}>
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {e.id}
        </th>
        <th scope="row" className="px-6  py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {/* {e.name} */}
            <span className=''>
                {edit &&  <input ref={nameRef} onBlur={(curr)=>handleEndEdit(curr.currentTarget.value,e.id,e.name)} onKeyDown={(curr)=>{if(curr.key=="Enter")handleEndEdit(curr.currentTarget.value,e.id,e.name)}} defaultValue={e.name} className="mx-3 text-center inline-block max-w-[120px] font-bold tracking-tight text-gray-900 dark:text-white"/>}
                {!edit && <span  className="mx-3 text-center inline-block max-w-[200px] font-bold tracking-tight text-gray-900 dark:text-white">{e.name}</span>}
                {!edit && <Image className={`${isPendingNameChange && 'disabled:cursor-not-allowed'} inline-block rounded-t-lg cursor-pointer hover:brightness-90`} onClick={()=>{if(!isPendingNameChange)handleEdit()}} src="/edit_text.png" alt="player" height={20} width={20}  />}
            </span>
        </th>
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <span className=''>
                <select id="countries" defaultValue={e.mapId} onChange={map=>{handleChangeMap(e.id,map.currentTarget.value,e.mapId)}} disabled={isPendingMapChange} className="w-80 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value={"-1"}  >Lemon Town (default)</option>
                    {mapData.map((maps,i)=>  <option  value={maps.id} key={i} >{maps.name}</option>)}
                    {mapData.length == 0 && <option disabled >No map Available</option>}
                </select>
            </span>
        </th>
        <td className="px-6 py-4">
            <Link href={`/dashboard/manage/${e.id}`}  className="font-medium text-red-600 dark:text-red-500 hover:underline mx-2">Manage</Link>
        </td>
    </tr>)}
    {data.length == 0 &&<tr><td scope="row" colSpan={5} className="px-6 text-center py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            No Room Found
        </td></tr>}
    </>
  )
}
