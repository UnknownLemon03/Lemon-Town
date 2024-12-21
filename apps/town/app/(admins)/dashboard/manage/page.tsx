import React from 'react'
import Link from "next/link";
import AddNewRoom from '@/components/AddNewRoom';
import { DeleteRoomDB, GetRoomDB, GetUserControlRooms } from '@/backend/database';
import RoomRow from './roomsrow';
import { isLogin, isRoomAdmin } from '@/backend/Auth';
import { redirect } from 'next/navigation';
export default async function page() {
    const islogin = await isLogin()
    if(!islogin) return redirect("/login")
    const isroomadmin = await isRoomAdmin(islogin.id);
    if(!isroomadmin) redirect("/dashboard");
    const req = await GetUserControlRooms({id:islogin.id});
  return (
    <>
        <h4 className="text-2xl font-bold dark:text-white mb-5">Manage Room </h4>
        <div className="overflow-x-auto shadow-md sm:rounded-lg max-h-[560px] scrollbar-hidden">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Room ID 
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Room Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                   <RoomRow data={req.data} />
                </tbody>
            </table>
        </div>
    </>
  )
}
