"use client"
import { deleteBoard, restoreBoard } from '@/action/board.action'
import { deleteList, restoreList } from '@/action/list.action'
import CustomDialogTrigger from '@/components/CustomDialogTrigger'
import { useAction } from '@/components/hooks/useAction'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Board, List, Member } from '@prisma/client'
import { RefreshCcw, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'

interface Props {
    list?: List
    board?: Board
    member: Member
    orgId: string
}



const RestoreButton = ({ list, board, member, orgId }: Props) => {
    const router = useRouter()
    const { loading: loadingRestore, execute: restore, error: errorRestore } = useAction({
        FN: async () => {
            return board && restoreBoard({ boardId: board.id, memberId: member.id, orgId }) || list && restoreList({ listId: list.id, orgId })

        },
        onSuccess: () => {
            router.refresh()
        }
    })
    return (
        <div className=' flex '>
            <CustomDialogTrigger header={`delete ${list ? "List" : "Board"}`} className=' min-h-[200px] xl:w-[35em]' content={list ? <FieldDelete list={list} orgId={orgId} member={member} /> : <FieldDelete board={board} orgId={orgId} member={member} />}>
                <Button variant={"outline"} className=' text-red-500'> <Trash2 className=' w-5 h-5' /> Delete</Button>
            </CustomDialogTrigger>
            <Button onClick={() => restore()} variant={"ghost"} isLoading={loadingRestore} className=''> <RefreshCcw className=' w-5 h-5' /> Restore </Button>
        </div>
    )
}

export default RestoreButton


const FieldDelete = ({ list, board, member, orgId }: { list?: List, board?: Board, member: Member, orgId: string }) => {
    const router = useRouter()

    const { loading, execute, error } = useAction({
        FN: async () => {
            if (!member) return
            if (board) {
                return deleteBoard({ boardId: board.id, memberId: member.id, orgId })
            }
            if (list) {
                return deleteList({ listId: list.id, orgId })
            }

        },
        onSuccess: () => {
            router.refresh()
        }
    })
    return (
        <div className=' w-full'>
            <p className=' text-3xl'>{list && list.title} {board && board.title} </p>
            <p className=' text-[0.6em] text-neutral-500'>{list && new Date(list.createdAt).toLocaleDateString()}{board && new Date(board.createdAt).toLocaleDateString()} </p>
            <div className=' mt-5 w-full text-center '>
                <p>The List will be Deleted Permenant</p>
                <div className=' flex gap-x-20 w-max mx-auto mt-5'>
                    <DialogClose className=' w-[10em]'>
                        <Button variant={"outline"} disabled={loading} className=' w-full'>Cancle</Button>
                    </DialogClose>
                    <Button onClick={() => execute()} isLoading={loading} className=' w-[10em]'>Delete</Button>
                </div>
            </div>
        </div>
    )
}
