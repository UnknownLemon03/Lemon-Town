"use client"
import React from 'react' 
import dynamic from 'next/dynamic'
const PhasorTown = dynamic(
  () => import('@/components/game/PhasorTown'),
  { ssr: false }
);
export default function page() {

  return (
    <div className='h-full w-full flex justify-center align-middle' ><PhasorTown mapurl={"/town/map.json"} /></div>
  )
}
