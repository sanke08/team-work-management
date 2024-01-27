import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
    return (
        <div className=' fixed top-0 w-full h-14 px-4 border-b shadow-sm flex justify-between items-center bg-white'>
            <div>Taskify</div>
            <div className=' flex gap-5 items-center'>
                <Link href={"/auth"} className=' p-2'>Login</Link>
                <Button>Get for Free</Button>
            </div>
        </div>
    )
}
