import React, { Suspense } from 'react'
import { db } from '@/lib/db'
import ListContainer from '../_components/ListContainer'
import { Dice1, MoreHorizontal } from 'lucide-react'


interface Props {
    params: {
        boardId: string
    }
}

const page = async ({ params }: Props) => {
    const lists = await db.list.findMany({
        where: { boardId: params.boardId,trash:false },
        include: { cards: true },
        
    })
    return (
        <Suspense fallback={<Skeleton />} >
            <div className="w-full flex p-2 h-full">
                <ListContainer boardId={params.boardId} data={lists} />
            </div>
        </Suspense>
    )
}

export default page

export const Skeleton = () => {

    return (
        <>
            <div className=' py-5 w-full bg-neutral-500/50 rounded-lg' />
            <div aria-disabled className=' w-full hidescrollbar overflow-hidden space-x-3 flex px-8 mt-2 bg-white'>
                {
                    [...Array(5)].map((i, j) => (
                        <div key={j} className=' bg-neutral-100 p-2 min-w-[250px] rounded-md border'>
                            <div className=' flex justify-between pr-1'>
                                <p className=' bg-neutral-400 animate-pulse py-4 rounded-lg w-32' />
                                <MoreHorizontal />
                            </div>
                            <div className=' space-y-3 w-full mt-2'>
                                {[...Array(5)].map((i, j) => (
                                    <div key={j} className='w-full p-2 px-4 rounded-lg shadow shadow-neutral-500/10 hover:border-black border bg-white'>
                                        <p className=' bg-neutral-300 animate-pulse py-3 w-36 rounded-lg' />
                                    </div>
                                ))}
                            </div>
                        </div>

                    ))
                }
            </div>
        </>
    )
}