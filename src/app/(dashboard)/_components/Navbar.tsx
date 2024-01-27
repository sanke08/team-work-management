"use client"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'
import OrgnizationSwitcher from './OrgnizationSwitcher'
import { Member, Organization, User } from '@prisma/client'
import MobileSidebar from './MobileSidebar'



interface Props {
    members: Array<Member & { Organization: Organization & { creator: User } }> 
    user: User
}


export const Navbar = ({ members, user }: Props) => {

    return (
        <div className=' fixed top-0 border-b h-14 bg-white shadow-md w-full flex items-center px-5 justify-between'>
            <div className=' gap-3 items-center hidden md:flex'>
                <div>Taskify</div>
                <Button>Create</Button>
            </div> 
            <div className=' flex gap-2 items-center md:hidden z-50'>
                <MobileSidebar members={members} user={user} />
                <Button className=' w-fit h-fit p-1 px-2' size={"sm"}><Plus /> </Button>
            </div>
            <OrgnizationSwitcher members={members} user={user} />
        </div>
    )
}

