'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import VideoCall from './VideoCall'
import { MainPlayer } from '../game/MainPlayer';

export default function GroupCall() {
  const [hide,setHide] = useState<boolean>(true);
  function generateRandomString(length:number) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, (byte) => String.fromCharCode(65 + (byte % 26))).join(''); // A-Z letters
    }
  return (
    <>
        <div onClick={()=>setHide(false)}>
            <Image src={"/groupcall.png"}  width={50} height={50} alt="Chat" />
        </div>
        {/* {!hide && <VideoCall playerName={"lemon"} onDisconnected={()=>{setHide(true)}}/>} */}

    </>
  )
}
