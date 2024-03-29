import { getUser } from '@/action/user.action'
import { db } from '@/lib/db'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
import Navbar from './_components/Navbar'
import RestoreButton from './_components/RestoreButton'


interface Props {
    params: {
        orgId: string
    }
    searchParams: {
        search: string
    }
}



const page = async ({ params, searchParams }: Props) => {


    const { user, message, success } = await getUser()
    if (!success) return redirect("/auth")
    const member = await db.member.findFirst({
        where: {
            userId: user?.id,
            organizationId: params.orgId
        }
    })
    if (!member) return redirect("/organization" + params.orgId)
    if (member.role === Role.MEMBER) {
        return (
            <div className=' w-full text-center text-2xl lg:text-3xl text-neutral-500 mt-5'>
                Member Not Allowed to view this page
            </div>
        )
    }
    const boards = await db.board.findMany({
        where: {
            organizationId: params.orgId,
            trash: true,
        },
    })
    const lists = await db.list.findMany({
        where: {
            organizationId: params.orgId,
            trash: true,
        }
    })

    return (
        <Suspense fallback={<Skeleton />}>
            {/* <Navbar /> */}
            {
                !lists.length && <p className=' capitalize flex justify-center w-full text-3xl text-neutral-500 mt-20'>No file in trash</p>
            }
            <div className=' p-5 pt-2 grid grid-cols-2 gap-5'>
                {
                    lists && lists.map((list) => {
                        return (
                            <div key={list.id} className=' border px-5 p-2 rounded-lg flex justify-between items-center'>
                                <div>

                                    <p className=' text-xl'> {list.title} </p>
                                    <p className=' text-neutral-500 text-[0.6em]'>created At {new Date(list.createdAt).toLocaleDateString()} </p>
                                </div>
                                <RestoreButton list={list} member={member} orgId={params.orgId} />
                            </div>
                        )
                    })
                }
                {
                    boards && boards.map((board) => (
                        <div key={board.id} className=' border px-5 p-2 rounded-lg flex justify-between items-center'>
                            <div>
                                <p className=' text-xl'> {board.title} </p>
                                <p className=' text-neutral-500 text-[0.6em]'>created At {new Date(board.createdAt).toLocaleDateString()} </p>
                            </div>
                            <RestoreButton board={board} member={member} orgId={params.orgId} />
                        </div>
                    ))
                }

            </div>
        </Suspense>
    )
}

export default page


const Skeleton = () => {
    return (
        <>
            {
                [...Array(5)].map((i, j) => (
                    <div key={j} className=' w-full grid grid-cols-2 gap-5  p-5'>
                        <div className=' py-5 bg-neutral-500 animate-pulse w-full rounded-lg' />
                        <div className=' py-5 bg-neutral-500 animate-pulse w-full rounded-lg' />
                    </div>
                ))
            }
        </>
    )
}