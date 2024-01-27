"use client"
import { createList } from '@/action/list.action'
import ErrorField from '@/components/ErrorField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useOnClickOutside } from 'usehooks-ts'

const CreateList = ({ boardId }: { boardId: string }) => {
    const router = useRouter()
    const ref = useRef(null)
    const params: { orgId: string } = useParams()
    const [toggle, setToggle] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const handleCreate = async () => {
        const { message, success } = await createList({ title, boardId, orgId: params.orgId })
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
    useOnClickOutside(ref, () => {
        setToggle(false)
    })
    return (
        <div ref={ref} className=' flex flex-col m-1 bg-white rounded-lg overflow-hidden h-fit'>
            <Button onClick={() => setToggle(true)} variant={"gray"} className={twMerge(' flex gap-3 min-w-[250px] overflow-hidden transition-all duration-500', toggle ? "h-[0px] py-[0px] px-[0px]" : "h-[40px] px-[5px] py-[2px]")}>
                <Plus />
                <p>Add New List</p>
            </Button>
            <div className={twMerge(' min-w-[250px] overflow-hidden transition-all duration-500', toggle ? " h-max py-2 px-3 border" : " h-0 px-0 py-0")}>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter List Title' className=' outline-1 outline' />
                <ErrorField errorStr={error} />
                <div className=' flex items-center mt-2 gap-3 justify-end'>
                    <Button isLoading={loading} onClick={handleCreate} variant={"primary"} className=' px-5'>Add list</Button>
                    <Button disabled={loading} onClick={() => { setToggle(false); setError(""); setTitle("") }} variant={"ghost"} className=' hover:bg-white w-fit h-fit p-2'><X /> </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateList