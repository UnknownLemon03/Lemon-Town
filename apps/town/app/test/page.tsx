'use server'
import React from 'react'
import Loading from '../loading';

export default async function page() {
  // const mail = ['test','lemon','apple'];
  // for(let i = 0; i < 50 ; i++){
  //   let email = `${mail[Math.floor(Math.random()*3)]}${Math.ceil(Math.random()*10000)}@gamil.com`
  //   const req = await SignUp({email:email,password:'test',name:mail[Math.floor(Math.random()*3)]})
  //   console.log(req)
  // }
  return <>
  {/* <div className='h-full w-full flex justify-center items-center'> */}
   <Loading/>
  {/* </div> */}
  </>
} 