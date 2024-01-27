"use client"
import { createOrgAction } from '@/action/organization.action'
import ErrorField from '@/components/ErrorField'
import ModalWrapper from '@/components/modal/ModalWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CLOSE_CREATE_ORGANIZATION } from '@/redux/constant'
import { Image } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const CreateOrgNnzation = () => {

    const dispatch = useDispatch()
    const { orgToggle } = useSelector((state: any) => state.toggle)
    
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [text, setText] = useState<string>("")
    const [error, setError] = useState<string>("")

    const handleCreate = async () => {
        setIsLoading(true)
        const { success, message } = await createOrgAction({ name: text })
        if (success) {
            router.refresh()
            handleClose()
            return
        }
        if (!success) {
            setError(message)
            setIsLoading(false)
        }
    }


    const handleClose = () => {
        setIsLoading(false)
        setError("")
        setText("")
        dispatch({ type: CLOSE_CREATE_ORGANIZATION })
    }

    return (
        <ModalWrapper isOpen={orgToggle.openOrgFild} close={handleClose} headertext='Create Organization'>
            <div className=' w-full'>
                <div>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image />
                </div>
                <div className=' mt-5'>
                    <Label className=' font-bold'>Organization Name</Label>
                    <Input value={text} onChange={(e) => setText(e.target.value)} placeholder='Org Name' />
                    <ErrorField errorStr={error} />
                </div>
                <div className=' w-full flex justify-end mt-3'>
                    <Button onClick={handleCreate} disabled={text.length == 0} isLoading={isLoading} className='self-end'>Create</Button>
                </div>
            </div>
        </ModalWrapper>
    )
}

export default CreateOrgNnzation