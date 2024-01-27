"use client"
import React, { Ref, RefAttributes, RefObject, useEffect, useRef, useState } from 'react'
import { X } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { useOnClickOutside } from 'usehooks-ts'



interface Props {
    children: React.ReactNode
    headertext: string
    hilighttext?: string
    subtext?: string
    close: () => void
    isOpen: boolean
    classname?: string
    disable?: boolean
}



const ModalWrapper: React.FC<Props> = ({ children, headertext, hilighttext, subtext, close, isOpen, classname, disable }) => {
    const [show, setShow] = useState(false)
    const handleclose = () => {
        setShow(false)
        setTimeout(() => {
            close()
        }, 300);
    }
    useEffect(() => {
        setTimeout(() => {
            setShow(isOpen)
        }, 30);
    }, [isOpen])
    return (
        <div className={twMerge(' w-full h-screen fixed left-0  hidden justify-center items-center top-0 bg-neutral-900/50 z-50 px-5 md:px-0', isOpen && "flex", classname)}>
            <div className={twMerge('  min-h-[10rem] mb-28 md:min-w-[40rem] w-full max-w-[40rem] bg-white rounded-xl p-5  translate transition-all duration-300', show ? "translate-y-0 opacity-100" : "opacity-0 translate-y-40")}>
                <div className=' w-full flex justify-end'>
                    <button title='close' disabled={disable} onClick={handleclose}><X color='black' /> </button>
                </div>
                <div className=' md:px-10 flex flex-col items-center justify-center w-full'>
                    <div className=' text-black font-semibold text-3xl w-full'>{headertext}</div>
                    <p className=' text-neutral-400 text-xs sm:text-base md:w-5/6 w-full text-center mt-1'>{subtext} <span className=' text-indigo-500'>{hilighttext}</span> </p>
                </div>
                <div className=' w-full h-full md:px-10 mt-5'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalWrapper