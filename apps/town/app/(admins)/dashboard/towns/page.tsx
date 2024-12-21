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
        <div className='w-full'>        
                {data.length == 0 && <p className="text-center text-xl font-thin text-gray-900 dark:text-white">No Town Available</p>}
                {data.map((e,i)=> <div key={i} className="block my-3 flex-col w-full bg-white border shadow-sm rounded-xl p-4 md:p-5">
                    <h3 className="text-lg font-bold text-gray-800">
                        {e.name}
                    </h3>
                    <Link href={`/town?roomid=${e.roomid}`} className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none" >
                        Join Town
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </Link>
                    </div>)}
                    
        </div>
        <div className='min-w-44 mx-5'>
            <PlayerSelect playerName={loginData.name}/>
        </div>
    </div>
  )
}
