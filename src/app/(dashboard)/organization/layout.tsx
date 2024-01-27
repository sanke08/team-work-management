import React, { Suspense } from 'react'
import CreateOrgNnzation from './_components/CreateOrgNnzation'
import Sidebar from './_components/Sidebar'
import CreateBoardModal from './[orgId]/_components/CreateBoardModal'
import { ChevronDown } from 'lucide-react'
import { getUser } from '@/action/user.action'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import CardDetail from './_components/CardDetail'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const { user } = await getUser()
    if (!user) return redirect("/")

    const members = await db.member.findMany({
        where: { userId: user.id },
        include: {
            Organization: {
                include: {
                    creator: true,
                },
            },
        }
    })

    return (
        <Suspense fallback={<Skeleton />}>
            <CreateBoardModal />
            <CreateOrgNnzation />
            <div className=''>
                <div className=' flex gap-x-6 w-full'>
                    <div className='w-[250px] fixed left-0 h-full z-20 pl-2 pt-2 pb-48 hidescrollbar bg-slate-200 overflow-y-scroll hidden md:block'>
                        <Sidebar members={members} user={user} />
                    </div>
                    <div className=' overflow-hidden md:pl-[250px] w-full'>
                        {children}
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default layout

const Skeleton = () => {
    return (
        <div className=' w-[250px] bg-slate-200'>
            {
                [...Array(5)].map((i, j) => (

                    <div key={j} className=' w-full flex justify-between items-center h-12 px-2 border border-neutral-500/20 rounded-lg overflow-hidden mt-1'>
                        <div className=' bg-sky-500/30 animate-pulse w-2/3 h-8 rounded-lg' />
                        <ChevronDown className=' h-4 w-4' />
                    </div>
                ))
            }
        </div>
    )
}