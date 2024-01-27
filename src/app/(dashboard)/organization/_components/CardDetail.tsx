"use client"
import { deleteCard, updateCard } from '@/action/card.action'
import ErrorField from '@/components/ErrorField'
import { useAction } from '@/components/hooks/useAction'
import ModalWrapper from '@/components/modal/ModalWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CLOSE_CARD_DETAIL, GET_CARD_SUCCESS } from '@/redux/constant'
import { Card } from '@prisma/client'
import { Check, Edit, Loader2, Menu, Trash, Workflow } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const CardDetail = ({ card }: { card: Card }) => {
    // const dispatch = useDispatch()
    const router = useRouter()
    const params: { orgId: string, boardId: string } = useParams()
    const [desc, setDesc] = useState(card.description || "")

    const descRef = useRef("")


    const { execute: handleUpdate, loading: loadingUpdate, error: errorUpdate } = useAction({
        FN: async () => {
            return updateCard({ cardId: card.id, description: desc, orgId: params.orgId, boardId: params.boardId })
        },
        onSuccess: () => {
            router.refresh()
        }
    })
    const { execute: handleDelete, loading: loadingDelete, error: errorDelete } = useAction({
        FN: async () => {
            return deleteCard({ cardId: card.id, orgId: params.orgId, boardId: params.boardId })
        },
        onSuccess: () => {
            router.refresh()
        }
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