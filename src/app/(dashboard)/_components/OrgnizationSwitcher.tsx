"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { OPEN_CREATE_ORGANIZATION } from '@/redux/constant'
import { Member, Organization, User } from '@prisma/client'
import { ChevronsUpDown, Folder, Plus, ShieldCheck, TextSelect } from 'lucide-react'
import { useParams, useRouter, } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'

interface Props {
    members: Array<Member & { Organization: Organization }>
    user:User
}


const OrgnizationSwitcher = ({ members, user }: Props) => {
    const params: { orgId: string }|null = useParams()
    const dispatch = useDispatch()
    const router = useRouter()

    return (

        <div className=' w-60'>
            <DropdownMenu>
                <DropdownMenuTrigger className=' w-60'>
                    <Button variant={"ghost"} className=' w-full flex justify-between bg-slate-200 hover:bg-slate-300'>
                        <div className=' flex w-full gap-2'>
                            {members.find(({ Organization }) => Organization.id === params?.orgId)?.Organization.creatorId === user.id && <ShieldCheck className=' h-5 w-5 text-green-500' />}
                            {members.find(({ Organization }) => Organization.id === params?.orgId)?.Organization.name}
                        </div>
                        <ChevronsUpDown className=' h-5 w-5' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=' w-56 p-0'>
                    {
                        members.filter(({ Organization }) => (Organization.id !== params?.orgId)).map(({ Organization }) => (
                            <DropdownMenuItem key={Organization.id}>
                                <Button onClick={() => router.push(`/organization/${Organization.id}`)} className=' w-full flex gap-2 justify-start'>
                                    <div className=' flex gap-x-2 w-full'>
                                        <Folder />
                                        {Organization.name}
                                    </div>
                                    {members.find(({ Organization }) => Organization.id === params?.orgId)?.Organization.creatorId === user.id && <ShieldCheck className=' h-5 w-5 text-green-500' />}
                                </Button>

                            </DropdownMenuItem>
                        ))
                    }
                    <DropdownMenuItem className=' w-full flex justify-between'>
                        <Button onClick={() => dispatch({ type: OPEN_CREATE_ORGANIZATION })} variant={"ghost"} className=' bg-slate-200 w-full hover:bg-slate-300'>
                            <Plus />
                            Create
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default OrgnizationSwitcher