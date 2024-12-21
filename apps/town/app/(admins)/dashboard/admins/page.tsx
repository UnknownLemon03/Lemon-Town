'use server'
import React from 'react'
import AdminTable from './admintable'
import { GetAdmins } from '@/backend/database'
import { isAdmin, isLogin } from '@/backend/Auth'
import { redirect } from 'next/navigation'

export default async function page() {
    const islogin = await isLogin();
    if(!islogin) return redirect("/login")
    const isadmin = await isAdmin();
    if(!isadmin) return redirect("/dashboard");
    const {data:Users,error,success} = await GetAdmins({})
  return (
    <>
        <AdminTable Users={Users}/>
    </>
  )
}
