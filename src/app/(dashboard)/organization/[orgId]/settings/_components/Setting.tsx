"use client"
import { updateOrganizaton } from '@/action/organization.action'
import ErrorField from '@/components/ErrorField'
import { useAction } from '@/components/hooks/useAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'

interface Props {
    orgName: string
    orgId: string
}


const Setting = ({ orgName, orgId }: Props) => {

    const router = useRouter()
    const { orgSettings } = useSelector((state: any) => state.toggle)
    const [name, setname] = useState(orgName || "")
    const { error, success, execute, loading } = useAction({
        FN: async () => {
            return updateOrganizaton({ name, id: orgId })
        },
        onSuccess: () => {
            router.refresh()
        },
    })

    return (
        <div className={twMerge(' px-4 border border-neutral-500/40 w-full hidden rounded-lg p-5 mx-auto mt-2', orgSettings.openOrgSetting && "block")}>
            <div className=' text-4xl font-semibold'>
                Settings
            </div>
            <p>Manage organization settings</p>
            <div className=' mt-10 w-full flex flex-col'>
                <Label htmlFor='inp' className=' font-medium'>Organization Profile</Label>
                <div className=' space-y-1'>
                    <div className=' relative flex items-center w-full'>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image className=' absolute mt-3' />
                        <Input value={name} placeholder='Organization name' onChange={(e) => setname(e.target.value)} id='inp' className=' pl-10 w-1/2 mt-3' />
                    </div>
                    <ErrorField errorStr={error} className=' w-max' />
                    <Button onClick={() => execute()} disabled={name.length === 0} isLoading={loading} className=' w-1/3 mt-5'>Update</Button>
                </div>
            </div>
            <div className=' mt-10 border border-neutral-500/20 p-5 rounded-lg'>
                <p className=' font-medium'>Danger</p>
                <div className=' space-x-5 flex mt-10'>
                    <Button variant={"ghost"} className='flex items-center text-red-500 border border-neutral-500/50 hover:text-red-500 hover:bg-slate-200/50'>
                        <X className=' h-4' />
                        Leave Organization
                    </Button>
                    <Button variant={"ghost"} className='flex items-center text-red-500 border border-neutral-500/50 hover:text-red-500 hover:bg-slate-200/50'>
                        <X className=' h-4' />
                        Delete Organization
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Setting