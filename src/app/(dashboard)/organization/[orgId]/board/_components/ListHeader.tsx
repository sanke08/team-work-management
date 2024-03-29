"use client"
import ErrorField from '@/components/ErrorField'
import { useOldAction } from '@/components/hooks/useOldAction'
import { Input } from '@/components/ui/input'
import { List } from '@prisma/client'

import { X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import ListOption from './ListOption'
import { useParams,  } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'



interface Props {
    list: List
}


const ListHeader = ({ list }: Props) => {
    const params: { orgId: string, boardId: string } | null = useParams()
    const ref = useRef(null)
    const [isediting, setIsediting] = useState<boolean>(false)
    const [title, setTitle] = useState(list.title || "")


    const { loading, error, execute } = useOldAction({
        FN: async () => {
            return await axios.put(`/api/socket/list/${list.id}?boardId=${params?.boardId}&orgId=${params?.orgId}`, { title })
        },
        onSuccess: () => {
            setIsediting(false)
        }
    })



    useEventListener("keydown", async (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            await execute()
        }
    })
    useOnClickOutside(ref, () => setIsediting(false));

    return (
        <div className=' flex justify-between w-full items-center'>
            {
                isediting ?
                    <>
                        <div ref={ref} className=' flex items-center gap-2 w-full'>
                            <Input disabled={loading} value={title} onChange={(e) => setTitle(e.target.value)} className={twMerge(isediting && ' border border-neutral-900/50')} />
                            <button disabled={loading} onClick={() => setIsediting(false)} type="button" title="button"><X className=' h-5' /> </button>
                        </div>
                        <ErrorField errorStr={error} />
                    </>
                    :
                    <div>
                        <p onClick={() => setIsediting(true)}>{title} </p>
                        <p className=' text-[0.5em]'>{new Date(list.createdAt).toLocaleDateString()} </p>
                    </div>
            }
            <ListOption listId={list.id} />
        </div>
    )
}

export default ListHeader