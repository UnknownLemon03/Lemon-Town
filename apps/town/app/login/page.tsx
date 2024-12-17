import AuthForm from '@/components/Auth'
import { equal } from 'assert';
import { log } from 'console';
import React from 'react'

export default async function page({searchParams}:{searchParams:{mode:string}}) {
  const {mode} = await searchParams;
  let login = true;
  if (mode) {
      login = false
  }
  return (
    <>
        <AuthForm mode={login} />
    </>
  )
}
