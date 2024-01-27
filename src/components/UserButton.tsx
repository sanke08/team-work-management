"use client"
import { User } from '@prisma/client'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Edit, LogOut, UserCircle } from 'lucide-react'
import { Button } from './ui/button'
import CustomDialogTrigger from './CustomDialogTrigger'
import UserDetail from './UserDetail'
import { logout } from '@/action/user.action'
import { useRouter } from 'next/navigation'
import { useAction } from './hooks/useAction'


interface Props {
    user: User
}



const UserButton = ({ user }: Props) => {
    const router = useRouter()
    const { execute, loading,error } = useAction({
        FN: async () => {
            return logout()
        },
        onSuccess: () => {
            router.push("/auth")
        }
    })

    return (
        <Popover >
            <PopoverTrigger className=' w-full'>
                <Button className=' w-full p-1.5 space-x-2'>
                    <UserCircle /> <span>{user.name} </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className=' space-y-2 '>
                <Button onClick={()=>execute()} isLoading={loading} variant={"outline"} className=' w-full space-x-2'>
                    <LogOut /> <span>Logout </span>
                </Button>
                <CustomDialogTrigger header="Update User Profile" width='lg:w-[30%] md:w-[50%] md:w-[80%] w-[90%] min-h-[15em]' content={<UserDetail user={user} />}>
                    <Button className=' w-full space-x-2'>
                        <Edit /> <span>Edit</span>
                    </Button>
                </CustomDialogTrigger>
            </PopoverContent>
        </Popover>
    )
}

export default UserButton