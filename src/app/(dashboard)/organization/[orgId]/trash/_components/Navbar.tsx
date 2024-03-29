"use client"
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchPrams = useSearchParams()
    const [search, setSearch] = useState(searchPrams?.get("search") || "")
    useEffect(() => {
        if (!search && pathname) return router.push(pathname)
        const imr = setTimeout(() => {
            router.push(pathname + "/?search=" + search)
        }, 500);
        return () => {
            clearTimeout(imr)
        }
    }, [pathname, router, search])

    return (
        <div className=' w-max mx-auto mt-2'>
            <Input value={search} onChange={(e) => { setSearch(e.target.value) }} placeholder='Search your field' className=' rounded-lg w-96 border-2' />
        </div>
    )
}

export default Navbar