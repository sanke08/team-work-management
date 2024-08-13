import { Board } from '@prisma/client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
    boards: Board[]
    orgId: string
}


const BoardList = ({ boards, orgId }: Props) => {
    return (
        <>
            {
                boards && boards.map((board,i) => (
                    <Link href={`/organization/${orgId}/board/${board.id}`} key={board.id} className=' w-full h-20 relative overflow-hidden group rounded-lg'>
                        <Image src={board.imageFullUrl}  alt='' fill className=' object-cover  transition-all' />
                        <p className='text-white absolute top-0 left-0 pl-2  group-hover:bg-neutral-200/30 text-left w-full h-full'>{board.title} </p>
                    </Link >
                ))
            }
        </>
    )
}

export default BoardList