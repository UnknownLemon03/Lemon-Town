'use server'
import React from 'react'
import AdminTable from './admintable'
import { GetAdmins } from '@/backend/database'

export default async function page() {
    const {data:Users,error,success} = await GetAdmins({})
  return (
    <>
        <AdminTable Users={Users}/>
    </>
  )
}
