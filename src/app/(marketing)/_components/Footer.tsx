import { Button } from '@/components/ui/button'
import React from 'react'

export const Footer = () => {
    return (
        <div className=' fixed bottom-0 bg-white w-full px-5 h-14 flex justify-between items-center'>
            <div>Taskify</div>
            <div className=' flex gap-2'>
                <Button variant={"ghost"} size={"sm"}>Privacy Policy</Button>
                <Button variant={"ghost"} size={"sm"}>Terms of Services</Button>
            </div>
        </div>
    )
}

