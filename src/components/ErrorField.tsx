import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
    errorStr: string
    className?: string
}


const ErrorField = ({ errorStr, className }: Props) => {
    return (
        <div className={twMerge(" text-xs text-red-500 font-medium text-right", className)} > {errorStr} </div>
    )
}

export default ErrorField