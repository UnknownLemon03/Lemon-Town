import { isLogin } from '@/backend/Auth'
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
        <h3>Hello world</h3>
       
        
    </>
  )
}
