"use client"
import { Member, Organization, User } from '@prisma/client'
import React from 'react'
import { useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import MemberCard from './MemberCard'

interface Props {
    organization: Organization,
    members: Array<Member & { user: User }>
    user: Member
}


const Members = ({ members, organization, user }: Props) => {

    const { orgSettings } = useSelector((state: any) => state.toggle)
    return (
        <div className={twMerge("hidden p-5 border border-neutral-900/20 rounded-lg h-full w-full mx-auto lg:w-full mt-2", orgSettings.openMemberSetting && "block")}>
            <div className=' text-4xl font-semibold'>
                Members
            </div>
            <p className=' text-neutral-900/50'>View and manage organization members</p>
            <div className=' mt-5 font-semibold'>{members.length} members </div>
            <div className=' mt-5 w-full flex flex-col'>
                <div className=' flex w-full border-b pb-1'>
                    <div className=' w-[55%] md:w-[50%]'>User</div>
                    <div className='  w-[30%] md:w-[20%]'>Role</div>
                    <div className=' w-[15%] hidden md:block'>Joined</div>
                    <div className='w-[10%]'>Action</div>
                </div>
                <div className=' space-y-2'>
                    {members && members.map((member) => (
                        <MemberCard key={member.id} member={member} user={user} organization={organization} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Members