"use client"
import React from 'react' 
import dynamic from 'next/dynamic'
import { disconnect } from 'process';
import { disconnectSocket, getSocket } from '@/components/game/Socket';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import TownBar from '@/components/meet/TownBar';
import { disconnectSocketSFU, UserChat } from '@/components/game/SFU';
import { GetMapUrlRoom } from '@/backend/cloude';
const PhasorTown = dynamic(
  () => import('@/components/game/PhasorTown'),
  { ssr: false }
);
export default function Town({roomid,name,mapurl}:{roomid:number,name:string,mapurl:string}) {
  function handleExit(){
    UserChat.clear();
    disconnectSocketSFU();
    disconnectSocket();
    return redirect("/dashboard/towns")
  }
  return (<>
    <div className=' h-full w-full flex justify-center align-middle' >
      <button onClick={handleExit} type="button" className="absolute top-14 left-14 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
        Exit
      </button>
      <PhasorTown mapurl={mapurl} name={name} roomid={roomid} />
    </div>
  </>
  )
}
