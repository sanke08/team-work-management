"use client"
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Menu, X } from 'lucide-react'
import React from 'react'
import Sidebar from '../organization/_components/Sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { CLOSE_MOBILE_TOGGLE, OPEN_MOBILE_TOGGLE } from '@/redux/constant'
import { Member, Organization, User } from '@prisma/client'
import { twMerge } from 'tailwind-merge'



interface Props {
    members: Array<Member & { Organization: Organization & { creator: User } }> 
    user: User
}

const MobileSidebar = ({ members, user }: Props) => {

    const dispatch = useDispatch()
    const { mobileToggle } = useSelector((state: any) => state.toggle)

    const handleClose = () => {
        dispatch({ type: CLOSE_MOBILE_TOGGLE })
    }


    return (
        <>
            <Button onClick={() => dispatch({ type: OPEN_MOBILE_TOGGLE })} variant={"ghost"} size={"sm"} className=' w-fit h-fit p-1 px-2'>
                <Menu />
            </Button>
            <Sheet open={mobileToggle.openMobileView} onOpenChange={handleClose}>
                <SheetContent side="left" className="p-2 pt-10"        >
                    <Sidebar members={members} user={user} />
                </SheetContent>
            </Sheet>
        </>
    )
}

export default MobileSidebar