"use client"
import { trashBoard, updateBoard } from '@/action/board.action'
import ErrorField from '@/components/ErrorField'
import { useAction } from '@/components/hooks/useAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Board, Member, Role } from '@prisma/client'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'


interface Props {
    board: Board
    member: Member | null
    orgId:string
}


const Navbar = ({ board, member ,orgId}: Props) => {
    const router = useRouter()
    const titleref = useRef(board.title || "")
    const { loading: loadingUpdate, error: errorUpdate, execute: handleUpdate, success } = useAction({
        FN: async () => {
            return updateBoard({ id: board.id, title: titleref.current })
        },
        onSuccess: () => {
            router.refresh()
        }
    })

    const { execute: handleTrash, loading: loadingTrash, error: errorTrash } = useAction({
        FN: async () => {
            return member ? trashBoard({ boardId: board.id, memberId: member?.id,orgId }) : null
        },
        onSuccess: () => {
            router.refresh()
        }
    })

    return (
        <div className=' w-full'>
            <div className=' bg-neutral-500/30 w-full p-2 px-4 flex justify-between rounded-lg'>
                <div className=" text-white">
                    {board.title}
                </div>
                {
                    member?.role === Role.ADMIN &&
                    <Popover>
                        <PopoverTrigger>
                            <Button variant={"ghost"} className=' p-0 w-max h-max hover:bg-neutral-500/5 hover:text-white'>
                                <MoreHorizontal className=' text-white' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className=' flex items-center gap-2'>
                                <Input onChange={(e) => titleref.current = e.target.value} placeholder={titleref.current} className=' outline outline-1' />
                                <Button onClick={() => handleUpdate()} disabled={titleref.current.length === 0} isLoading={loadingUpdate} className=' w-max h-max px-2'>Update</Button>
                            </div>
                            {errorUpdate && <ErrorField errorStr={errorUpdate} className=' pr-2 pb-1' />}
                            <Button onClick={() => handleTrash()} isLoading={loadingTrash} className=' w-full space-x-5 text-red-500 my-1'><Trash className=' h-5' /> <p>Delete</p>  </Button>
                            {errorTrash && <ErrorField errorStr={errorTrash} className=' pr-2 pb-1' />}
                        </PopoverContent>
                    </Popover>
                }
            </div>
        </div>
    )
}

export default Navbar