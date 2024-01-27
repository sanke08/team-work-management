"use client"
import { Button } from '@/components/ui/button'
import { OPEN_MEMBER_SETTING, OPEN_ORG_SETTING } from '@/redux/constant'
import { Check, Copy, RefreshCcw, Settings, Share, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import OrgInfo from '../../_components/OrgInfo'
import { Organization } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { generateInviteLink } from '@/action/organization.action'
import { useAction } from '@/components/hooks/useAction'
import ErrorField from '@/components/ErrorField'


interface Props {
    org: Organization
}


const Toggle = ({ org }: Props) => {
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ""
    const url = `${origin}/invite/${org.link}`
    const dispatch = useDispatch()
    const pathname = usePathname()
    const router = useRouter()
    const [copy, setCopy] = useState(false)
    const { orgSettings } = useSelector((state: any) => state.toggle)

    const { loading: generateLoading, execute: generate, error: generateError, success: generateSuccess, reset } = useAction({
        FN: async () => {
            return await generateInviteLink({ orgId: org.id })
        }
    })


    useEffect(() => {
        router.push(pathname + "?memberPage=1")
        dispatch({ type: OPEN_ORG_SETTING })
    }, [dispatch, router, pathname])

    useEffect(() => {
        if (generateSuccess) {
            router.refresh()
        }
    }, [generateSuccess, router])
    const handleCopy = async () => {
        setCopy(true)
        await window.navigator.clipboard.writeText(url)
        setTimeout(() => {
            setCopy(false)
        }, 3000)
    }

    return (
        <div className=' w-full mx-auto border border-neutral-400/50 rounded-lg p-5 py-10 h-full'>
            <OrgInfo organization={org} />
            <div className=' flex flex-col gap-3 mt-10'>
                <Button onClick={() => dispatch({ type: OPEN_MEMBER_SETTING })} variant={"ghost"} className={twMerge(' bg-slate-200 hover:bg-slate-200/50 space-x-3', orgSettings.openMemberSetting && "bg-sky-500/20 hover:bg-sky-500/20")}>
                    <User />
                    <p>
                        Members
                    </p>
                </Button>
                <Button onClick={() => dispatch({ type: OPEN_ORG_SETTING })} variant={"ghost"} className={twMerge(' bg-slate-200 hover:bg-slate-200/50 space-x-3', orgSettings.openOrgSetting && "bg-sky-500/20 hover:bg-sky-500/20")}>
                    <Settings />
                    <p>
                        Settings
                    </p>
                </Button>
                <div className=' bg-slate-200 p-1 h-[100%] transition-all duration-500'>
                    <div className='flex items-center gap-2'>
                        <Share />
                        <Input readOnly value={url} />
                        <Button disabled={generateLoading} onClick={handleCopy} variant={"ghost"} className={twMerge(' rounded-full h-fit w-fit p-1 relative')}>
                            <Copy className={twMerge(' h-5 w-5 transition-all duration-300 absolute', copy && "scale-0")} />
                            <Check className={twMerge(' h-5 w-5 transition-all duration-300 bg-green-500 rounded-full', !copy && "scale-0")} />
                        </Button>
                        <Button onClick={() => generate()} disabled={generateLoading} variant={"ghost"} className='rounded-full h-fit w-fit p-1'>
                            <RefreshCcw className={twMerge(generateLoading && "animate-spin")} />
                        </Button>
                    </div>
                    {generateLoading && <p className=' text-end text-xs animate-pulse'>generating link</p>}
                    {generateError && <ErrorField errorStr={generateError} />}
                    {copy && <p className=' text-green-500 text-xs text-end'>copied</p>}
                </div>
            </div>
        </div>
    )
}

export default Toggle