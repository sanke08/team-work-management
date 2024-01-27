"use client"
import React, { useEffect, useState } from 'react'
import SignIn from './_components/SignIn'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import SignUp from './_components/SignUp'
import { getUser } from '@/action/user.action'
import useUser from '@/components/hooks/useUser'

const Page = () => {

    const user = useUser()
    const router = useRouter()

    const [toggle, setToggle] = useState<boolean>(false)
    const Toggle = () => {
        setToggle((pre) => !pre)
    }
    useEffect(() => {
        if (user) {
            router.push("/")
        }
    }, [user, router])

    return (
        <div className=' bg-slate-200 fixed h-full w-full'>
            <div className=' w-full border-b border-neutral-500/20 p-3 px-5'>
                <Link href={"/"} className=' text-xl font-bold'>Taskify</Link>
            </div>
            <div className=' min-h-[90%] px-10 fixed w-full flex justify-center items-center'>
                <div className={twMerge(' w-full  items-center justify-center transition-all duration-300', toggle ? "hidden" : "flex")}>
                    <SignIn Toggle={Toggle} />
                </div>
                <div className={twMerge(' w-full  items-center justify-center transition-all duration-300', toggle ? "flex" : "hidden")}>
                    <SignUp Toggle={Toggle} />
                </div>
            </div>
        </div>
    )
}

export default Page