import { isLogin } from '@/backend/Auth';
import { GetRoomOfUser } from '@/backend/database';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import PlayerSelect from './playerSelect';

export default async function page() {
    const loginData = await isLogin();
    if(!loginData) return redirect("/login")
    const {data} = await GetRoomOfUser({id:loginData.id});
  return (
    <div className='flex justify-between w-full'>
        <div className='    '>        
                {data.length == 0 && <p className="text-center text-xl font-thin text-gray-900 dark:text-white">No Town Available</p>}
                {data.length > 0 && <div className='flex flex-wrap '>
                {data.map((e,i)=> <div key={i} className="w-full h-32 flex-1 max-w-2xl px-6 py-5 m-3 bg-gray-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{e.name}</h5>
                            </a>
                            <div className='relative'>
                            <Link href={`/town?roomid=${e.roomid}`} className=" relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-blue-600 ">
                                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    Default
                                </button>
                            </Link>
                            </div>
                        </div>)}
                    </div>}
        </div>
        <div className='min-w-44 mx-5'>
            <PlayerSelect playerName={loginData.name}/>
        </div>
    </div>
  )
}
