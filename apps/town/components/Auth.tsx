'use client'
import Link from 'next/link';
import { redirect } from "next/navigation";
import React, { FormEvent, FormEventHandler, ReactEventHandler, useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function AuthForm({}) {
  const [isLogin, setIsLogin] = useState(true);
  function handleSignUp(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form)    
    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passregx =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/
    if(data.get("password") !== data.get("passwordconfirm")){
     
    }
    if(!passregx.test(data.get("password") as string)){
    }
    if(!emailRegx.test(data.get("email") as string)){
    }
  }
  return (
    <>
    <div className="min-h-[93vh]  flex items-center justify-center ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {isLogin ? (
          <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Login
            </h2>
            <form >
            <p id="standard_error_help" className="my-4 text-xs text-start text-red-600 dark:text-red-400"></p>
            <p id="standard_error_help" className="my-4 text-xs text-start text-green-600 dark:text-red-400"></p>
              <div className="relative z-0 w-full mb-8 group">
                  <input type="text" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Email address
                  </label>
              </div>
              <div className="relative z-0 w-full mb-8 group">
                  <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Password
                  </label>
               </div>
      
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
            <span className="mt-5 inline-block text-sm text-gray-500 dark:text-gray-400"> Already have account ? <span onClick={()=>setIsLogin(e=>!e)} className=" cursor-pointer  font-medium text-blue-600 hover:underline dark:text-blue-500">Register</span></span>
          </div>
          <Link href={'/books'} className=" inline-block text-sm text-gray-500 dark:text-gray-400"> Explore <span className=" cursor-pointer  font-medium text-blue-600 hover:underline dark:text-blue-500">Books</span></Link>
          </>
        ) : (
          <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Sign Up
            </h2>
            <form onSubmit={handleSignUp}>
            <div className="relative z-0 w-full mb-8 group">
                  <input type="text" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Email address
                  </label>
              </div>
              <div className="relative z-0 w-full mb-8 group">
                  <input type="passwordconfirm" name="passwordconfirm" id="passwordconfirm" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                  <label htmlFor="passwordconfirm" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Comfirm address
                  </label>
              </div>
              <div className="relative z-0 w-full mb-8 group">
                  <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Password
                  </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                Sign Up
              </button>
            </form>
            <span className="mt-5 inline-block text-sm text-gray-500 dark:text-gray-400"> Don&apos;t have account ? <span onClick={()=>setIsLogin(e=>!e)} className=" cursor-pointer  font-medium text-blue-600 hover:underline dark:text-blue-500">Login</span></span>
          </div>
        </>
        )}
      </div>
    </div>
    </>
  );
};
