
import React from 'react'
import SubPage from './subpage'
import { isAdmin } from '@/backend/Auth'
import { redirect } from 'next/navigation'

export default async function page() {
    const req = await isAdmin()
    if(!req){
        return redirect('/dashboard')
    }
  return (
    <>
        <SubPage/>
    </>
  )
}
