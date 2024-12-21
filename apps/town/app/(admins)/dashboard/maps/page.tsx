import React from 'react'
import Link from "next/link";
import AddNewRoom from '@/components/AddNewRoom';
import { GetAllMap } from '@/backend/database';
import MapRow from './maprow';
import AddMap from '@/components/AddMap';
import { isAdmin } from '@/backend/Auth';
import { redirect } from 'next/navigation';

export default async function page() {
    const admin = await isAdmin();
    if(!admin) return redirect("/dashboard");
    const req = await GetAllMap({});
  return (
    <>
        <h4 className="text-2xl font-bold dark:text-white mb-5">Managet Maps</h4>
        <AddMap/>
        <div className="overflow-x-auto shadow-md sm:rounded-lg max-h-[560px] scrollbar-hidden">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Map ID 
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Map Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Start tile
                        </th>
                        <th scope="col" className="px-6 py-3">
                            End tile
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                   <MapRow data={req.data} />
                </tbody>
            </table>
        </div>
    </>
  )
}
