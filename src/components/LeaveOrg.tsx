import { Member, Organization, User } from '@prisma/client'
import React from 'react'
import { DialogClose } from './ui/dialog'
import { Button } from './ui/button'
import { useAction } from './hooks/useAction'
import { leaveOrganization } from '@/action/organization.action'
import { useRouter } from 'next/navigation'
import ErrorField from './ErrorField'


interface Props {
    currOrg: Organization & { creator: User } | undefined
    member: Member & { Organization: Organization & { creator: User } } | undefined
}


const LeaveOrg = ({ currOrg: org, member }: Props) => {
    const router = useRouter()
    const { error, success, execute, loading } = useAction({
        FN: async () => {
            return org && member ? leaveOrganization({ orgId: org?.id, memberId: member?.id }) : null
        },
        onSuccess: () => {
            router.refresh()
        }
    })

    return (
        <div className=' mt-5'>
            <p className=' text-3xl'>{org?.name} </p>
            <p className=' text-sm text-neutral-500'>  created By <span className=' font-semibold '> {org?.creator.name}</span> </p>
            <p className=' text-xs'>{org && new Date(org.createdAt).toLocaleDateString()} </p>
            <div className=' w-full h-full mt-5'>
                <p className=' mx-auto w-max'>Are Really want to leave this Organization </p>
                <div className=' flex justify-evenly  items-center mt-5'>
                    <DialogClose>
                        <Button variant={"outline"}>
                            Cancle
                        </Button>
                    </DialogClose>
                    <Button onClick={() => execute()} isLoading={loading}>Leave</Button>
                </div>
            </div>
            <ErrorField errorStr={error} className='fixed bottom-4 right-4'/>
        </div>
    )
}

export default LeaveOrg