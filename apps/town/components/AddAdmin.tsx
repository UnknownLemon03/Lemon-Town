'use client'
import { GetAdmins, SearchUser } from '@/backend/database';
import { UserTypeDB } from '@/backend/datatype';
import { PreviewData } from 'next';
import React, { ChangeEvent, startTransition, useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
type ServerAction = (
    formState: PreviewData, 
    formData: FormData
  ) => Promise<{
    error: string;
    success: boolean;
    data: string;
}>;
export default function AddAdmin({ServerAction , placeholder}:{ServerAction:ServerAction,placeholder:string}) {
    const [hide,setHide] = useState(false)
    const [suggestion,setSuggestion] = useState<UserTypeDB[]>([]);
    const [preStat,action] = useActionState(ServerAction,{error:"",success:false,data:""});
    let serachBounceId:any;
    useEffect(()=>{
        console.log(preStat)
        if(preStat.success == true && preStat.error == "" && preStat.data!=""){
            toast.success(preStat.data)
        }
    },[preStat])
    function ToggleUserFromRoom(userid:number){
        const data = new FormData();
        data.set("id",`${userid}`);
        startTransition(()=>{
            action(data)
        })
    }

    function handleSerach(e: ChangeEvent<HTMLInputElement>){
        clearTimeout(serachBounceId)
        if(e.target.value == ""){
            setSuggestion([]);
            return;
        }
        serachBounceId = setTimeout(async ()=>{
            const req = await SearchUser({email:e.target.value})
            if(req.data.length == 0){
                setSuggestion([{
                    id: -1,
                    name: "",
                    email: 'No user found',
                    password: "non",
                } as UserTypeDB]);
            }else{
                setSuggestion(req.data);
            }
            console.log(req)
        },400)
    }
  return (
    <>
      <button type="button" onClick={()=>{setHide(e=>!e);setSuggestion([])}} className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        {placeholder}
      </button>
      {hide && <div className='overflow-hidden mb-8 w-[150px] z-10 h-full'>
      <div onClick={()=>{setHide(false)}}  className={`fixed backdrop-blur-md h-full bg-transparent min-w-[100%] min-h-[95vh] top-0 left-[0%] `} />
      <div className={`absolute left-[50%] top-[50%]`}>
        <div className='flex fixed flex-row content-between items-start' >
            <div className=" max-w-sm mx-auto  w-[500px] bg-gray-50  p-[30px] rounded-lg border-2 border-gray-50 ">
                    <form className="flex items-center max-w-sm mx-auto">   
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
                                </svg>
                            </div>
                            <input type="text" onChange={handleSerach} id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search u  ser email..." required />
                        </div>
                        <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
                    <div className='max-h-[300px] scrollbar-hidden overflow-y-scroll'>
                        {suggestion.length > 0 && suggestion.map((e,i)=><p key={i} onClick={()=>{ToggleUserFromRoom(e.id);setHide(false)}} className='w-full p-3 bg-gray-50 my-1 rounded-lg cursor-pointer text-center'>{e.email} {e.name!="" ?`(${e.name})`:""}</p>)}
                    </div>
                    
            </div>
            
        </div>
      </div>
    </div>}
    </>
  )
}
