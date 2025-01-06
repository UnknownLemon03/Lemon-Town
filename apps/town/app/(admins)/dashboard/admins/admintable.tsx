'use client'
import React, {useState } from 'react'
import UserRow from './userrow';
import { UserTypeDB } from '@/backend/datatype';
import AddAdmin from '@/components/AddAdmin';
import { AddSuperAdminServerAction } from '@/backend/serverAction';
export default function AdminTable({Users}:{Users:UserTypeDB[]}) {
    const [name,setName] = useState<string>("")
  return (
    <>
        <h4 className="text-2xl font-bold dark:text-white mb-5">Managet Town</h4>
        
        <form className="flex items-center max-w-sm my-5">   
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
            </svg>
            </div>
            <input type="text" onChange={(e)=>setName(e.currentTarget.value)} id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search User name..." required />
            </div>
        </form>
        <AddAdmin placeholder='Add Admin'  ServerAction={AddSuperAdminServerAction}/>
        <div className="overflow-x-auto shadow-md sm:rounded-lg max-h-[560px] scrollbar-hidden">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                           No.
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Username
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <UserRow data={Users} search={name}/>
                </tbody>
            </table>
        </div>
    </>
  )
}
