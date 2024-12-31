'use client'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { UserChat } from '../game/SFU';
import { MainPlayer } from '../game/MainPlayer';

export default function Chat() {
    const [hide,setHide] = useState<boolean>(false);
    const [users,setUsers] = useState<{[id:string]:{name:string,count:0,messages:{other:boolean,meassage:string}[]}}>({})
    const [active,setActive] = useState<string>("");
    const ref = useRef<HTMLInputElement>(null);
    MainPlayer.Active = !hide;
    useEffect(()=>{
        UserChat.clear();
        UserChat.sub((newUsers) => setUsers({ ...newUsers }));
        UserChat.update()
    },[])
    function handleSend(){
        const message = ref.current?.value ?? ""
        console.log("wokring")
        if(message?.length > 0){
            console.log("message ",message)
            UserChat.SendMessage({socketId:active,message:message})
        }
        if (ref.current) {
            ref.current.value = ''; 
        }
        
    }
    if(active!=""){
        UserChat.Users[active].count = 0;
    }
  return (
    <>
        <Image src={"/chat.png"} onClick={()=>setHide(e=>!e)}  width={50} height={50} alt="Chat" />
       {hide && <>
        <div onClick={()=>{setHide(e=>!e);setActive("");}}  className={` fixed backdrop-blur-md h-screen bg-transparent min-w-[100%] min-h-[95vh] top-0 left-[0%] `} />
        <div className="flex absolute h-[92vh] top-[3%] left-96  antialiased text-gray-800">
            <div className="flex flex-row h-full w-full overflow-x-hidden">
            <div className="flex flex-col py-8 p-6 w-64 bg-white flex-shrink-0 rounded-md">
                <div className="flex flex-row items-center justify-center h-12 w-full">
                <div
                    className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
                >
                    <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    ></path>
                    </svg>
                </div>
                <div className="ml-2 font-bold text-2xl">QuickChat</div>
                </div>
                <div className="flex flex-col mt-8">
                <div className="flex flex-row items-center justify-between text-xs">
                    <span className="font-bold">Users</span>
                </div>
                <div className="flex flex-col space-y-1 mt-4 -mx-2  overflow-y-auto">
                    {Object.keys(users).map((e,i)=><button key={i} onClick={()=>{setActive(e);UserChat.ChatVisit(e);}} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                        {users[e].name[0].toUpperCase()}
                    </div>
                    <div className="ml-2 text-sm font-semibold">{users[e].name}</div>
                    {UserChat.Users[e].count > 0 &&  <span className="inline-flex items-center justify-center w-5 h-5 ml-[50%]  ms-2 text-xs font-semibold text-white bg-indigo-300 rounded-full">
                        {UserChat.Users[e].count}
                    </span>}
                    </button>)}
                    {Object.keys(users).length == 0 && <span className='flex justify-center items-center'>No user found</span>}
                </div>
                </div>
                </div>
            {active != ""  && <div className="flex flex-col  w-[640px] flex-auto h-full p-6">
                
                <div
                className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
                >
                <div className="flex flex-col h-full overflow-x-auto mb-4  scrollbar-hidden">
                    <div className="flex flex-col h-full">
                    <div className="grid grid-cols-12 gap-y-2">
                        {/* ------------------------------------------------------------------------------ */}
                        {/* other chat */}
                        {users[active] && users[active].messages.map((e,i)=><Chats User='A' data={e} key={i} />)}
                       
                        {/* ME */}

                        {/* ------------------------------------------------------------------------------ */}
                       </div>
                    </div>
                </div>
                <div
                    className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                >
                    <div>
                    <button
                        className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                    >
                        <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        ></path>
                        </svg>
                    </button>
                    </div>
                    <div className="flex-grow ml-4">
                    <div className="relative w-full"> 
                        <input type="text"   ref={ref}
                        onKeyDown={(e) =>{{ 
                            if(e.code == "Space")
                                e.currentTarget.value += ' '
                            if(e.code == "Enter"){
                                handleSend()
                                e.currentTarget.value = ""
                            }
                        }}}
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-6 h-12" />
                        <button
                        className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                        >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        </button>
                    </div>
                    </div>
                    <div className="ml-4">
                    <button
                        onClick={handleSend}
                        className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                    >
                        <span >Send</span>
                        <span className="ml-2">
                        <svg
                            className="w-4 h-4 transform rotate-45 -mt-px"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            ></path>
                        </svg>
                        </span>
                    </button>
                    </div>
                </div>
                </div>
               
            </div>}
            {active == ""  && <div className="flex flex-col  w-[640px] flex-auto h-full p-6">
                
                <div
                className="flex justify-center items-center flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
                >
                    <Image src={"/message.png"} height={200} width={200} alt={"Message"} />
                
                </div>
               
            </div>}
            </div>
        </div></>}
    </>
  )
}


function  Chats({User,data}:{User:string,data:{other:boolean,meassage:string}}){
    return <>
    
       {data.other ? <div className="col-start-1 col-end-8 p-3 rounded-lg"> 
            <div className="flex flex-row items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                    {User}
                </div>
                <div
                className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                >
               
                <div>{data.meassage}</div>
                </div>
            </div>
        </div>:<>
                <div className="col-start-6 col-end-13 p-3 rounded-lg">
                <div className="flex items-center justify-start flex-row-reverse">
                <div
                className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                >
                {User}
                </div>
                <div
                className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                >
                <div>
                {data.meassage}
                </div>
                </div>
                </div>
                </div>
        </>}
    </>
}
