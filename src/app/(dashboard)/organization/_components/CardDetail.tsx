"use client"
import ErrorField from '@/components/ErrorField'
import SuccessField from '@/components/SuccessField'
import { useOldAction } from '@/components/hooks/useOldAction'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@prisma/client'
import axios from 'axios'
import { Check, Loader2, Menu, Trash, Workflow } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const CardDetail = ({ card }: { card: Card }) => {
    const params: { orgId: string, boardId: string } | null = useParams()
    const [desc, setDesc] = useState(card.description || "")


    const { execute: handleUpdate, loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useOldAction({
        FN: async () => {
            return await axios.put(`/api/socket/card/${card.id}?boardId=${params?.boardId}&orgId=${params?.orgId}&cardId=${card.id}`, { description: desc })
        }
    })



    const { execute: handleDelete, loading: loadingDelete, error: errorDelete } = useOldAction({
        FN: async () => {
            return await axios.delete(`/api/socket/card/${card.id}?boardId=${params?.boardId}&orgId=${params?.orgId}&cardId=${card.id}`)
        },
        
    })

    return (
        <div >
            <div className=' flex items-center gap-x-2'>
                <Workflow />
                {/* @ts-ignore */}
                <p className=' text-2xl'>{card?.title}</p>
            </div>
            <div className=' mt-5 flex gap-3 items-center'>
                <Menu />
                <p className=' text-lg'>Description</p>
            </div>
            <div className=' sm:flex w-full mt-2'>
                <div className=' px-9 w-full'>
                    <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='Add detail About card' className='bg-neutral-100 h-fit max-h-[20rem] w-full' />
                    {errorUpdate && <ErrorField errorStr={errorUpdate} />}
                    {successUpdate && <SuccessField successStr={successUpdate} />}
                </div>
                <div className=' w-full md:w-max flex md:block justify-end md:justify-start'>
                    <Button onClick={() => handleDelete()} disabled={card.description?.length === 0} variant={"ghost"} className='  rounded-full w-fit h-fit p-1'>
                        {
                            loadingDelete ?
                                <Loader2 className=' animate-spin' />
                                :
                                <Trash className="" />
                        }
                    </Button>
                    <Button onClick={() => handleUpdate()} disabled={card.description?.length === 0} variant={"ghost"} className=' bg-green-500 rounded-full w-fit h-fit p-1'>
                        {
                            loadingUpdate ?
                                <Loader2 className=' animate-spin' />
                                :
                                <Check className="" />
                        }
                    </Button>
                </div>
            </div>
            <p className=' absolute bottom-4 right-4 mt-2'>
                {errorDelete && <ErrorField errorStr={errorDelete} />}
            </p>
        </div>
    )
}

export default CardDetail