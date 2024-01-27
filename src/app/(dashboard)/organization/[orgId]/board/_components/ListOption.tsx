import { copyList, deleteList, trashList } from '@/action/list.action'
import { useAction } from '@/components/hooks/useAction'
import { Button } from '@/components/ui/button'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MoreHorizontal, X } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useOnClickOutside } from 'usehooks-ts'

const ListOption = ({ listId }: { listId: string }) => {
    const router = useRouter()
    const params: { boardId: string, orgId: string } = useParams()
    const pathname = usePathname()
    const { execute: handleCopy, success: successCopy, error: errorCopy, loading: loadingCopy } = useAction({
        FN: async () => {
            return copyList({ listId, boardId: params.boardId, orgId: params.orgId, path: pathname })
        },
        onSuccess: () => {
            router.refresh()
        }
    })
    const { execute: handleTrash, success: successTrash, error: errorTrash, loading: loadingTrash } = useAction({
        FN: async () => {
            return trashList({ listId ,orgId:params.orgId})
        },
        onSuccess: () => {
            router.refresh()
        }
    }) 

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant={"ghost"} className=' p-1 h-fit w-fit'>
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className=' flex flex-col space-y-1'>
                <div className=' text-center w-full'>
                    List Action
                </div>
                <PopoverClose className=' absolute right-2 top-2'>
                    <Button variant={"ghost"} className='absolute right-0 p-1 h-fit'><X className=' h-5' /> </Button>
                </PopoverClose>
                <Button onClick={() => handleCopy()} isLoading={loadingCopy} variant={"secondary"} className=' w-full h-fit p-2'>copy this list...</Button>
                <Button onClick={() => handleTrash()} isLoading={loadingTrash} variant={"secondary"} className=' w-full h-fit p-2 text-red-500'>move to trash this list...</Button>
            </PopoverContent>
        </Popover>
    )
}

export default ListOption