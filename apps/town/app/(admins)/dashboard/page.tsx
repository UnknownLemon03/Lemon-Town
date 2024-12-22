import { isLogin } from '@/backend/Auth'
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

export default async  function page() {
    const data = await isLogin();
    if(!data){
      return redirect("/login")
    }
      console.log(data)
  return (
    <>
        <div className='w-full flex justify-center items-center h-[78vh]'>
          <Image src={"/dashboard.png"} height={300} width={300} alt={"dashboard"}/>
        </div>
       
        
    </>
  )
}
