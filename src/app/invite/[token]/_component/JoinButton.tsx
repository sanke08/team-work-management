"use client"
import { createMember } from '@/action/user.action'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { Suspense, useState } from 'react'


interface Props {
    userId: string
    orgId: string
}



const JoinButton = ({ userId, orgId }: Props) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const handleClick = async () => {
        setLoading(true)
        const { success, message } = await createMember({ userId, orgId })
        if (success) {
            return router.replace("/organization/" + orgId)
        }
        setLoading(false)
    }


    return (
        <div className=' mx-auto w-fit mt-5'>
            <Button isLoading={loading} onClick={handleClick}>
                Join
            </Button>
        </div>
    )
}

export default JoinButton