import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
    successStr: string
    className?: string
}


const SuccessField = ({ successStr, className }: Props) => {
    return (
        <div className={twMerge(" text-xs text-emerald-500 font-medium text-right", className)} > {successStr} </div>
    )
}

export default SuccessField