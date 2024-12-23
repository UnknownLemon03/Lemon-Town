'use client'
import Image from 'next/image'
import React, { useState } from 'react'

export default function Call() {
    const [hide,setHide] = useState(false);
    const near = ["Lemon","Orppasdf","dsf","sdf","sdf"];
    const all = ["Lemon","Orppasdf","dsf","sdf","sdf"];
  return (
    <>
          <div className='absolute bottom-[10%] left-[45%]'>
                <div
                    className={`transition-all duration-300 transform ${
                        hide ? '-translate-y-0 opacity-100' : 'translate-y-2 opacity-0 hidden'
                    } `}
                >
                    {near.map((e, i) => (
                        <span
                            onClick={()=>setHide(e=>false)}
                            className='bg-white block my-1 text-xl py-2 px-14 rounded-lg shadow-lg'
                            key={i}
                        >
                            {e}
                        </span>
                    ))}
                </div>
            </div>
            <div onClick={() => setHide(e => !e)}>
                <Image src={"/call.png"} width={50} height={50} alt="Chat" />
            </div>
    </>
  )
}
