import { getUser } from '@/action/user.action';
import { db } from '@/lib/db';
import { Workflow } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import JoinButton from './_component/JoinButton';

interface Props {
    params: {
        token: string;
    }
}


const page = async ({ params }: Props) => {

    const { user, success } = await getUser()
    if (!user || !success) return redirect("/auth")
    const org = await db.organization.findFirst({
        where: { link: params.token },
        include: { creator: true }
    })
    if (!org) {
        return (
            <div>
                <p>Likn expired</p>
            </div>
        )
    }
    const member = await db.member.findFirst({
        where: {
            userId: user.id,
            organizationId: org.id
        }
    })
    const memberCnt = await db.member.count({
        where: { organizationId: org.id }
    })
    if (member) return redirect("/organization/" + org.id)

    return (
        <div className=' w-full h-screen bg-slate-200 flex justify-center items-center'>
            <div className='bg-white rounded-lg w-96 p-5'>
                <div className=' flex items-center justify-between'>
                    <div>
                        <div className=' flex space-x-2 items-center'>
                            <Workflow />
                            <p className=' text-4xl'>{org.name}</p>
                        </div>
                        <div className=' pl-10 text-sm text-neutral-500'>
                            <p>by {org.creator.name} </p>
                        </div>
                    </div>
                    <div>
                        {memberCnt} Members
                    </div>
                </div>
                <JoinButton userId={user.id} orgId={org.id} />
            </div>
        </div>
    )
}

export default page