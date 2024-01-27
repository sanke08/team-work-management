import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, {  useRef, } from 'react'
import { LoginRequest } from '@/lib/Validator/auth.validator'
import { LoginAction } from '@/action/user.action'
import { useRouter } from 'next/navigation'
import { useAction } from '@/components/hooks/useAction'


const SignIn = ({ Toggle }: { Toggle: () => void }) => {
    const router = useRouter()
    const userData = useRef({
        email: "",
        password: ""
    })
    const { loading,  execute: handleLogin, error, reset } = useAction({
        FN: async () => {
            const payload: LoginRequest = {
                email: userData.current.email,
                password: userData.current.password
            }
            return LoginAction(payload)
        },
        onSuccess:()=>{
            return router.push("/")

        }
    })

    return (
        <div className=' md:w-1/3 w-full flex flex-col items-center gap-2 border p-5 rounded-lg shadow-lg bg-white border-neutral-500/50'>
            <div className=' w-full text-xl font-semibold'>Welcome back ! </div>
            <Input  disabled={loading} onChange={(e) => userData.current.email= e.target.value} placeholder='Email' type="email" />
            <Input  disabled={loading} onChange={(e) => userData.current.password = e.target.value} placeholder='Password' type="password" />
            <div className=' text-[0.7rem] text-red-500 self-end'>{error} </div>
            <Button onClick={() => handleLogin()} isLoading={loading} className=' w-full mt-5 '>Sign In</Button>
            <div className=' w-full mt-5 text-xs'>
                <p>Create an account</p>
                <Button variant={"ghost"} disabled={loading} onClick={Toggle} className=' w-max p-0 h-fit'>Sign up</Button>
            </div>
        </div>
    )
}

export default SignIn