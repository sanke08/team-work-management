import { RegisterAction } from '@/action/user.action'
import { useAction } from '@/components/hooks/useAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RegisterRequest } from '@/lib/Validator/auth.validator'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'

const SignUp = ({ Toggle }: { Toggle: () => void }) => {
  const router = useRouter()
  const userData = useRef({
    email: "",
    password: "",
    name: ""
  })
  const { loading, execute, error,  } = useAction({
    FN: async () => {
      const payload: RegisterRequest = {
        email: userData.current.email,
        password: userData.current.password,
        name: userData.current.name
      }
      return RegisterAction({ ...payload })
    },
    onSuccess: () => {
      return router.push("/")
    }
  })


  return (
    <div className=' md:w-1/3 w-full flex flex-col items-center gap-2 border p-5 rounded-lg shadow-lg bg-white border-neutral-500/50'>
      <div className=' w-full text-xl font-semibold'>Welcome back ! </div>
      <Input placeholder='Name' disabled={loading} onChange={(e) => userData.current.name = e.target.value} type="text" />
      <Input placeholder='Email' disabled={loading} onChange={(e) => userData.current.email = e.target.value} type="email" />
      <Input placeholder='Password' disabled={loading} onChange={(e) => userData.current.password = e.target.value} type="password" />
      <div className=' text-[0.7rem] text-red-500 self-end'>{error} </div>
      <Button onClick={() => execute()} isLoading={loading} className=' w-full mt-5 '>Sign up</Button>
      <div className=' w-full mt-5 text-xs'>
        <p>already have account</p>
        <Button variant={"ghost"} disabled={loading} onClick={Toggle} className=' w-max p-0 h-fit'>Sign in</Button>
      </div>
    </div>
  )
}

export default SignUp