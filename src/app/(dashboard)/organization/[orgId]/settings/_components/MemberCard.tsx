import { changeRole, removeMember } from '@/action/user.action'
import ErrorField from '@/components/ErrorField'
import { useAction } from '@/components/hooks/useAction'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Member, Organization, Role, User } from '@prisma/client'
import { LogOut, MoreVertical, ShieldCheck, User2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'


interface Props {
    member: Member & {
        user: User
    },
    user: Member,
    organization: Organization
}


const MemberCard = ({ member, user, organization }: Props) => {

    const router = useRouter()

    const { execute: removeMemb, loading: removeLoading, error: removeError, reset, success: removeSuccess } = useAction({
        FN: async () => {
            return removeMember({ memberId: member.id, userId: user.id, orgId: organization.id })
        }
    })
    const { execute: executrChangeRole, success: successRoleChange, error: errorRoleChange, loading: loadingChangeRole } = useAction({
        FN: async () => {
            return changeRole({ memberId: member.id, userId: user.id, orgId: organization.id })
        }
    })

    useEffect(() => {
        if (successRoleChange || removeSuccess) {
            router.refresh()
        }
    }, [removeSuccess, router, successRoleChange])

    return (
        <div className=' w-full flex items-center border-b h-12'>
            <div className=' flex flex-col w-[55%] md:w-[50%] overflow-hidden'>
                <p>{member.user.name} </p>
                <p className=' text-xs text-neutral-500'>{member.user.email} </p>
            </div>
            <div className=' w-[30%] md:w-[20%] flex gap-2'>
                {
                    member.role === "ADMIN" ? <ShieldCheck className=' text-green-600 h-5' /> : <User2 />
                }
                <p className={twMerge(member.role === "ADMIN" ? " text-green-600" : " ")}>
                    {member.role}
                </p>
            </div>
            <div className='w-[15%] hidden md:block'>
                {new Date(member.createdAt).toLocaleDateString()}
            </div>
            <div className='w-[10%]'>
                {
                    (member.role === "MEMBER" || organization.creatorId !== member.userId) &&
                    <Popover>
                        <PopoverTrigger>
                            <Button onClick={() => reset()} variant={"outline"} className=' space-x-3 text-rose-500 p-2'><MoreVertical /> </Button>
                        </PopoverTrigger>
                        <PopoverContent className=' flex flex-col space-y-2 w-full'>
                            <Button onClick={() => removeMemb()} isLoading={removeLoading} variant={"outline"} className=' space-x-3 text-rose-500 p-2'><p>Remove</p> <LogOut className=' h-5' /> </Button>
                            {!removeError && <ErrorField errorStr={removeError} />}
                            <Button onClick={executrChangeRole} isLoading={loadingChangeRole} disabled={removeLoading}>
                                {/* @ts-ignore */}
                                change role to {member.role == Role.ADMIN ? Role.MEMBER : Role.ADMIN}
                            </Button>
                            {!errorRoleChange && <ErrorField errorStr={errorRoleChange} />}
                        </PopoverContent>
                    </Popover>
                }
            </div>
        </div>
    )
}

export default MemberCard