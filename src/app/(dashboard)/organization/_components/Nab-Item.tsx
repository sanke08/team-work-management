"use client"
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CLOSE_MOBILE_TOGGLE } from '@/redux/constant';
import { Organization, User } from '@prisma/client'
import { Activity, CreditCard, Image, Layout, Route, Settings, ShieldCheck, Trash } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { twMerge } from 'tailwind-merge';



type Props = {
    organization: Organization
    user: User
}



const NavItem = ({ organization, user }: Props) => {
    const disabled = organization.creatorId !== user.id
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const params = useParams()
    const [toggle, setToggle] = useState<boolean>(false)
    const routes = [
        {
            label: "Boards",
            icon: <Layout className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}`,
        },
        {
            label: "Activity",
            icon: <Activity className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/activity`,
        },
        {
            label: "Settings",
            icon: <Settings className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/settings`,
        },
        {
            label: "Trash",
            icon: <Trash className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/trash`,
        },
    ];
    return (
        <AccordionItem value={organization.id}>
            <AccordionTrigger onClick={() => setToggle((pre) => !pre)} className={twMerge('  border-[0.1rem] border-neutral-600/30 mt-1 hover:no-underline p-2 rounded-lg', params?.orgId === organization.id && "bg-sky-500/20", toggle && params?.orgId === organization.id && " bg-slate-100")}>
                <div className="flex items-center justify-between gap-x-2 w-full">
                    <div className=' w-full flex gap-2 items-center'>
                        <div className="w-7 h-7 relative">
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image />
                        </div>
                        <span className="font-medium text-sm">
                            {organization.name}
                        </span>
                    </div>
                    {organization.creatorId === user.id && <ShieldCheck className=' h-5 w-5 text-green-500' />}
                </div>

            </AccordionTrigger>
            <AccordionContent className=''>
                {
                    routes.map((route) => (
                        <Button disabled={route.label === "Settings" && disabled} key={route.label} size="sm" variant="ghost" onClick={() => { router.push(route.href); dispatch({ type: CLOSE_MOBILE_TOGGLE }) }} className={twMerge("w-full font-normal justify-start pl-10 hover:bg-sky-500/10", (pathname === route.href || params?.boardId && route.label === "Boards") && "bg-sky-500/10 text-sky-700 my-[2px]")}>
                            {route.icon}
                            {route.label}
                        </Button>
                    ))
                }
                <p className=' h-[1px] w-full bg-neutral-500/30 rounded-full' />
            </AccordionContent>
        </AccordionItem>
    )
}

export default NavItem

