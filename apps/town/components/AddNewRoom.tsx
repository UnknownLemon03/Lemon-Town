'use client'
import { GetAllMap } from '@/backend/database'
import { AddRoomServerAction } from '@/backend/serverAction'
import React, { useActionState, useEffect, useState } from 'react'

export default function AddNewRoom() {
  const [maps,setMaps] = useState<{[key:string]:string}>({})
  const [hide,setHide] = useState<Boolean>(false)
  const [preState,formAction , isPending] = useActionState(AddRoomServerAction,{error:"",success:false})
  async function getMaps(){
    const {data,success} = await GetAllMap({})
    if(success){
      let maps:{[key:string]:string} = {}
      data.forEach(e=>{
        maps[e.name] = e.id
      })
      setMaps(maps)
    }
  }
  useEffect(()=>{
    getMaps();
    console.log(maps

    )
  },[])
  useEffect(()=>{
    if(preState && preState.success){
      setHide(false);
    }
  },[preState])
  return (
    <>
      <button type="button" onClick={()=>setHide(e=>!e)} className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Add new Town
      </button>
      {hide && <div className='overflow-hidden mb-8 w-[150px] z-10 h-full'>
      <div onClick={()=>setHide(e=>!e)}   className={`fixed backdrop-blur-md h-full bg-transparent min-w-[100%] min-h-[95vh] top-0 left-[0%] `} />
      <div className={`absolute left-[50%] top-[50%]`}>
        <div className='flex fixed flex-row content-between items-start' >
            <form action={formAction} className=" max-w-sm mx-auto  w-[500px] bg-gray-50 p-[30px] rounded-lg">
              <div  className="relative z-0 w-full mb-5 group">
                <input type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Town Name
                </label>
              </div>
              
              <div className="relative z-0 w-full mb-5 group">
                  <label htmlFor="mapid" className="block mb-2 text-gray-500 text-sm font-medium  dark:text-white">
                    Choose Map
                  </label>
                    <select id="mapid" name="mapid"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option  value={-1}>Lemon Town (default)</option>
                      {Object.keys(maps).map((e,i)=><option key={i} value={maps[e]}>{e}</option>)}
                      {Object.keys(maps).length == 0 && <option disabled={true}>No map added</option>}
                  </select>
              </div>
              <div className='flex justify-evenly'>
                <button disabled={isPending} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
              </div>
              
            </form>
            
        </div>
      </div>
    </div>}
    </>
  )
}
