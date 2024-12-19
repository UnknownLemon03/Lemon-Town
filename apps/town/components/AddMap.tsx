'use client'
import { SearchUser } from '@/backend/database';
import { UserTypeDB } from '@/backend/datatype';
import { AddMapServerAction } from '@/backend/serverAction';
import { error } from 'console';
import { PreviewData } from 'next';
import React, { ChangeEvent, startTransition, useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
type ServerAction = (
    formState: PreviewData, 
    formData: FormData
  ) => Promise<{
    error: string;
    success: boolean;
    data: string;
}>;
export default function AddMap() {
    const [hide,setHide] = useState(false)
    const [preStat,action,isPending] = useActionState(AddMapServerAction,{success:false,error:""})
    useEffect(()=>{
        if(preStat.success && preStat.error == ""){
            toast.success("Map added")
            setHide(false)
        }
    },[preStat])
  return (
    <>
      <button type="button" onClick={()=>{setHide(e=>!e)}} className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Add Map
      </button>
      {hide && <div className='overflow-hidden mb-8 w-[150px] z-10 h-full'>
      <div onClick={()=>{setHide(false)}}  className={`fixed backdrop-blur-md h-full bg-transparent min-w-[100%] min-h-[95vh] top-0 left-[0%] `} />
      <div className={`absolute left-[45%] top-[50%]`}>
        <div className='flex fixed flex-row content-between items-start' >
            <div className=" max-w-sm mx-auto align-middle w-[500px] bg-white p-[30px] rounded-lg border-2 border-gray-50 ">
                <form action={action} className=" max-w-sm mx-auto  w-[500px] bg-white p-[30px] rounded-lg">
                <div  className="relative z-0 w-full mb-5 group">
                    <input type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Map Name
                    </label>
                </div>
                <div  className="relative z-0 w-full mb-5 group">
                    <input defaultValue={-1} type="number" name="start" id="start" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="start" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Start Tile
                    </label>
                </div>
                <div  className="relative z-0 w-full mb-5 group">
                    <input defaultValue={-1} type="number" name="end" id="end" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="end" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        End Tile
                    </label>
                </div>
                <div className="flex items-center justify-center w-full my-4">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" name='map' type="file" className="hidden" />
                    </label>
                </div> 

                <div className='flex justify-evenly'>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </div>
                
                </form>  
            </div>
            
        </div>
      </div>
    </div>}
    </>
  )
}
