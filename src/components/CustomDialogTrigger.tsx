import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { twMerge } from 'tailwind-merge'
import { Edit } from 'lucide-react';

interface Props {
    header?: string;
    content?: React.ReactNode;
    children: React.ReactNode;
    description?: string;
    className?: string;
    height?: string
    width?: string
}


const CustomDialogTrigger = ({ header, content, children, description, className, height, width }: Props) => {
    return (
        <Dialog >
            <DialogTrigger className={twMerge(" w-full rounded-lg")}>{children} </DialogTrigger>
            <DialogContent className={twMerge(' min-h-[350px] overflow-scroll block w-[50%] hidescrollbar rounded-lg', className)}>
                <DialogHeader>
                    <DialogTitle>{header}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    )
}

export default CustomDialogTrigger