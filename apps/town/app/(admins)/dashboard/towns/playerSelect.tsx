'use client'
import { getPlayerChar, setPlayerChar } from '@/backend/client';
import { ChangeUserNameServerAction } from '@/backend/serverAction';
import Image from 'next/image';
import React, { act, startTransition, useActionState, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

export default function PlayerSelect({playerName}:{playerName:string}) {
    const [hide,setHide] = useState(false);
    const [player,setPlayer] = useState(1);
    const [edit,setEdit] = useState(false);
    const [name,setName] = useState(playerName)
    const nameRef = useRef<HTMLInputElement>(null)!;
    const charaters:{[key: number]: string} = {1:"Tom",2:"Anaya",3:"Berry",4:"Jerry"}
    const [prevState, action] = useActionState(ChangeUserNameServerAction,{success:false,error:"",data:null});

    useEffect(()=>{
        if(prevState.success){
            toast.success("user name changed successfully")
            return;
        }else if(prevState.error != "" && !prevState.success){
            toast.error(prevState.error)
            return;
        }
    },[prevState])
    useEffect(()=>{
        setPlayer(getPlayerChar())
    },[])
    function handleEdit(){
        setEdit(true); 
        setTimeout(() => nameRef.current?.focus(), 0);
    }
    function handleEndEdit(newPlayerName:string){
        setEdit(false);
        setName(newPlayerName)
        // save to data base
        setTimeout(()=>{
            startTransition(()=>{
                const data = new FormData();
                data.set("name",newPlayerName)
                action(data)
            })
        },0)
    }
  return (  
    <>
    <div className=" max-w-52 flex flex-col justify-center py-5 items-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <span className='relative'>
            <Image className="rounded-t-lg absolute -right-5 cursor-pointer hover:brightness-90" onClick={()=>{setHide(e=>!e)}} src="/edit.png" alt="player" height={32} width={32}  />
            <Image className="rounded-t-lg" src={`/town/player${player}_dp.png`} alt="player" height={128} width={128}  />
        </span>
        <div className="pt-5 ">
            <span className='flex justify-center items-center'>
                {edit &&  <input ref={nameRef} onBlur={(e)=>handleEndEdit(e.currentTarget.value)} onKeyDown={(e)=>{if(e.key=="Enter")handleEndEdit(e.currentTarget.value)}} defaultValue={name} className="mx-3 text-center inline-block max-w-[120px] font-bold tracking-tight text-gray-900 dark:text-white"/>}
                {!edit && <span  className="mx-3 text-center inline-block max-w-[50px] font-bold tracking-tight text-gray-900 dark:text-white">{name}</span>}
                {!edit && <Image className="inline-block rounded-t-lg cursor-pointer hover:brightness-90" onClick={handleEdit} src="/edit_text.png" alt="player" height={20} width={20}  />}
            </span>
        </div>
    </div>
    {hide && <div className='overflow-hidden mb-8  z-20 h-full'>
      <div onClick={()=>{setHide(false)}}  className={`z-10 fixed backdrop-blur-md h-full bg-transparent min-w-[100%] min-h-[95vh] top-0 left-[0%] `} />
      <div className={`absolute left-[40%] top-[40%]`}>
        <div className='z-30 flex fixed gap-5 flex-row content-between items-start' > 
            <div className='grid grid-cols-4 gap-5'>
                {Object.keys(charaters).map((e,i)=><div key={i} onClick={()=>{setHide(false);setPlayer(parseInt(e));setPlayerChar(i+1)}} className="max-h-[260px] h-max cursor-pointer w-full flex flex-col justify-center py-5 px-2 items-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <span className='relative '>
                        <Image className="rounded-t-lg" src={`/town/player${e}_dp.png`} alt="player" height={128} width={128}  />
                    </span>
                    <div className="pt-5 ">
                    <span className='flex justify-center items-center'>
                        <span className="mx-3 text-center inline-block max-w-[50px] font-bold tracking-tight text-gray-900 dark:text-white">
                            {charaters[parseInt(e)] }
                        </span>
                        </span>
                    </div>
                </div>)}
            </div>
        </div>
      </div>
    </div>}
    </>
  )
}
