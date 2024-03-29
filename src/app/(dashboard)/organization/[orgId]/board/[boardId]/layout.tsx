import { db } from '@/lib/db'
import React, { Suspense } from 'react'
import Navbar from '../_components/Navbar'
import img from "/public/2.jpg"
import Image from 'next/image'
import { Skeleton } from './page'
import { getUser } from '@/action/user.action'
import { redirect } from 'next/navigation'

interface Props {
    params: {
        boardId: string
        orgId: string
    }
    children: React.ReactNode
}


const layout = async ({ children, params }: Props) => {
    const { user } = await getUser()
    if (!user) return redirect("/auth")
    const member = await db.member.findFirst({
        where: {
            userId: user.id,
            organizationId: params.orgId
        }
    })
    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            trash: false
        }
    })
    if (!board) {
        return (
            <div className=' w-full mx-auto capitalize text-neutral-500 text-3xl mt-10 text-center'>
                no board found
            </div>
        )
    }
    
    return (
        <Suspense fallback={<Skeleton />}>
            <div className='h-full w-full'>
                <div className=' fixed -z-10 md:w-[calc(100vw-250px)] w-full h-full flex justify-center overflow-hidden hidescrollbar'>
                    <Image src={board.imageFullUrl} alt='' fill className='  w-full object-cover rounded-lg' />
                </div>
                <Navbar board={board} member={member} orgId={params.orgId} />
                <div className='w-full overflow-x-scroll min-h-[calc(100vh-6.5rem)] hidescrollbar'>
                    {children}
                </div>
            </div>
        </Suspense>

    )
}

export default layout