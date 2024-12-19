import React from 'react'
import { redirect } from 'next/navigation';
import UserRow from './userrow';
import AddUser from '@/components/AddUser';
import { CheckRoom, GetRoomUsers } from '@/backend/database';
import { date } from 'zod';
import { AddUserToRoomServerAction } from '@/backend/serverAction';
export default async function page({params}:{params:{id:string}}) {
    const {id} = await params;
    const roomid = isNaN(parseInt(id)) ? -1 : parseInt(id);
    const {error:errorCheckRoom,success:successChcekroom} = await CheckRoom({roomid});
    if(!successChcekroom) return redirect("/dashboard/manage")
    if(roomid == -1)
        return redirect("/dashboard/")
    const {data:RoomsUsers,error,success} = await GetRoomUsers({roomid})
  return (
    <>
        <h4 className="text-2xl font-bold dark:text-white mb-5">Manage Room Users</h4>
        <AddUser roomid={roomid} placeholder='Add User To Room' ServerAction={AddUserToRoomServerAction}/>
        <div className="overflow-x-auto shadow-md sm:rounded-lg ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                           No.
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Username
                        </th>
                        <th scope="col" className="p    x-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <UserRow data={RoomsUsers} roomid={roomid}/>
                </tbody>
            </table>
        </div>
    </>
  )
}
