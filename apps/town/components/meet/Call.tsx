'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import AskPermission from './Permission';
import { MainPlayer } from '../game/MainPlayer';
import VideoCall from './VideoCall';
import { MeetDataType } from '@/backend/client';
import { Meet } from '../game/SFU';

export default function Call() {
    const [hide,setHide] = useState(true);
    const [hideMeet,setHideMeet] = useState(false);
    const [nearPlayer,setNearPlayer] = useState<{[key:string]:string}>({})
    const [meetData,setMeetData] = useState<MeetDataType>(null);
    let id:any;
    useEffect(()=>{
        MainPlayer.NearPlayerSub = setNearPlayer;
        Meet.MeetSub.push(setMeetData);
        ()=>{
            MainPlayer.NearPlayerSub = ()=>{};
            Meet.MeetSub= Meet.MeetSub.filter(e=>e!=setNearPlayer);
        }
    },[])
    function onHover(){
        clearTimeout(id)
        id = setTimeout(()=>{
            setHide(false);
        },200)
    }
    function onHoverOut(){  
        clearTimeout(id)
        id = setTimeout(()=>{
            clearTimeout(id);
            setHide(true)
        },100)
    }
  return (
    <>
        <div onMouseOver={onHover} onBlur={onHoverOut} onMouseLeave={onHoverOut}>
          <div className='absolute bottom-[10.5%] left-[45%]' >
                <div
                    className={`transition-all duration-300 transform ${
                        !hide ? '-translate-y-0 opacity-100' : 'translate-y-2 opacity-0 hidden'
                    } `}
                >
                    
                        
                        {Object.keys(nearPlayer).map(e=><span
                            onClick={()=>{Meet.sendMeetReq({id:parseInt(e)});setHide(e=>true);onHoverOut()}}
                            className='bg-white block my-1 text-xl py-2 px-14 rounded-lg shadow-lg'
                            key={e}
                            >
                            {nearPlayer[e]}
                        </span>)}
                    
                </div>
            </div>
            <div >
                <Image src={"/call.png"} width={50} height={50} alt="Chat" />
            </div>
            {meetData && <VideoCall MeetingToken={meetData.MeetToken} onDisconnected={()=>{Meet.exitMeet();onHoverOut()}} />}
        </div>
    </>
  )
}
