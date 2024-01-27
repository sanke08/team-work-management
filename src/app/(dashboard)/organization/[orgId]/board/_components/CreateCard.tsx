"use client"
import { createCard } from '@/action/card.action'
import ErrorField from '@/components/ErrorField'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useOnClickOutside } from 'usehooks-ts'

const CreateCard = ({ listId }: { listId: string }) => {
    const router = useRouter()
    const ref = useRef(null)
    const params: { orgId: string, boardId: string } = useParams()
    const [toggle, setToggle] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const handleCreateCard = async () => {
        setLoading(true)
        const { success, message } = await createCard({ title, listId, orgId: params.orgId, boardId: params.boardId })

        if (success) {
            setLoading(false)
            setError("")
            setToggle(false)
            router.refresh()
            return
        }
        if (!success) {
            setError(message)
            setLoading(false)
        }
    }
    const handleClose = () => {
        setToggle(false)
        setTitle("")
        setError("")
    }
    useOnClickOutside(ref, handleClose)
    return (
        <div ref={ref} className=' w-full flex flex-col rounded-lg py-1'>
            <Button onClick={() => setToggle(true)} variant={"ghost"} className={twMerge(' bg-neutral-100 hover:bg-neutral-200/40 lgt space-x-4 flex w-full border-t overflow-hidden transition-all duration-500', toggle ? " h-[0px] py-0" : "py-1 h-[50px]")}>
                <Plus className=' text-neutral-500/80' />
                <p className=' text-neutral-600/70'>Add a Card</p>
            </Button>
            <div className={twMerge(' flex flex-col gap-2 justify-center overflow-hidden transition-all duration-500', toggle ? " h-[175px]" : " h-[0px]")}>
                <Textarea value={title} onChange={(e) => setTitle(e.target.value)} className=' resize-none hidescrollbar' />
                <ErrorField errorStr={error} />
                <div className=' flex items-center space-x-2'>
                    <Button isLoading={loading} disabled={title.length === 0} onClick={handleCreateCard} variant={"primary"}>Add Card</Button>
                    <Button disabled={loading} onClick={handleClose} variant={"ghost"} className=' w-fit h-fit '><X /> </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateCard