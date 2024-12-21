"use client"
import React from 'react' 
import dynamic from 'next/dynamic'
import { disconnect } from 'process';
import { disconnectSocket, getSocket } from '@/components/game/Socket';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
const PhasorTown = dynamic(
  () => import('@/components/game/PhasorTown'),
  { ssr: false }
);
export default function Town({roomid,name}:{roomid:number,name:string}) {
  function handleExit(){
    disconnectSocket();
    return redirect("/dashboard/towns")
  }
  return (
    <div className='relative h-full w-full flex justify-center align-middle' >
      <button onClick={handleExit} type="button" className="absolute top-14 left-14 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
        Exit
      </button>
      <PhasorTown mapurl={"/town/map.json"} name={name} roomid={roomid} />
    </div>
  )
}
