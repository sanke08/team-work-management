"use client"
import { trashBoard, updateBoard } from '@/action/board.action'
import ErrorField from '@/components/ErrorField'
import { useAction } from '@/components/hooks/useAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Board, Member, Role } from '@prisma/client'
import { Loader, MoreHorizontal, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'


interface Props {
    board: Board
    member: Member | null
    orgId: string
}

const imgUrls = [
    "https://images.unsplash.com/photo-1709098951208-f758e4718d97?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    " https://images.unsplash.com/photo-1520052205864-92d242b3a76b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    " https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    " https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    " https://images.unsplash.com/photo-1705574879567-cc30fc2f23ea?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

const Navbar = ({ board, member, orgId }: Props) => {
    const [loading, setLoading] = useState(false)
    const [imgUrl, setImgurl] = useState("")
    const router = useRouter()
    const titleref = useRef(board.title || "")
    const imgRef = useRef("")
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
            return member ? trashBoard({ boardId: board.id, memberId: member?.id, orgId }) : null
        },
        onSuccess: () => {
            router.refresh()
        }
    })
    const handleImg = async (val: string) => {
        setImgurl(val)
        setLoading(true)
        console.log(imgUrl)
        await updateBoard({ id: board.id, title: titleref.current, imgurl: val })
        router.refresh()
        setLoading(false)
        setImgurl("")
    }

    return (
        <div className=' w-full'>
            <div className=' bg-neutral-500/50 w-full p-2 px-4 flex justify-between rounded-lg'>
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
                            <div className=' w-full grid grid-cols-2 gap-1 items-center'>

                                {
                                    imgUrls.map((img) => (
                                        <div onClick={() => handleImg(img)} key={img} className=' w-full h-20 relative'>
                                            {
                                                (loading && img===imgUrl) && <p className=' w-full h-full flex justify-center items-center bg-neutral-500/50 absolute rounded-lg'><Loader /> </p>
                                            }
                                            <Image key={img} src={img} alt='' objectFit="cover" height={65}  width={125} className=' object-cover rounded-lg hover:border-2 cursor-pointer border-black p-[1px]' />
                                        </div>
                                    ))
                                }
                            </div>
                        </PopoverContent>
                    </Popover>
                }
            </div>
        </div>
    )
}

export default Navbar