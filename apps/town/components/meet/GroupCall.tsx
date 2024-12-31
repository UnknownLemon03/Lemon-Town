'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import VideoCall from './VideoCall'
import { MainPlayer } from '../game/MainPlayer';

export default function GroupCall() {
  const [hide,setHide] = useState<boolean>(true);
  return (
    <>
        <div onClick={()=>setHide(false)}>
            <Image src={"/groupcall.png"}  width={50} height={50} alt="Chat" />
        </div>
        {/* {!hide && <VideoCall playerName={"lemon"} onDisconnected={()=>{setHide(true)}}/>} */}

    </>
  )
}
