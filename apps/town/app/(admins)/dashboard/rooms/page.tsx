import React from 'react'
import Link from "next/link";
import AddNewRoom from '@/components/AddNewRoom';
import { DeleteRoomDB, GetRoomDB } from '@/backend/database';
import RoomRow from './roomsrow';
export default async function page() {
    const req = await GetRoomDB();
  return (
    <>
        <h4 className="text-2xl font-bold dark:text-white mb-5">Create Room</h4>
        <AddNewRoom/>
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
                   <RoomRow data={req.data}/>
                </tbody>
            </table>
        </div>
    </>
  )
}
