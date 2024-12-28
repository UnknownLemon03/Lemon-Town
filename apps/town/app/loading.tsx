import Image from 'next/image'
import React from 'react'

export default function Loading() {
  return (
    <>
          <div className={`background-main  fixed backdrop-blur-md h-full bg-transparent min-w-[100%] min-h-[95vh] top-0 left-[0%] `}></div>
          <div className=' absolute left-[45%] top-1/3'>
              <div className='pacman'></div>
          </div>
    </>
  )
}
