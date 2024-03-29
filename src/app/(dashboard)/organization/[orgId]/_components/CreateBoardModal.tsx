"use client"
import { createBoard, getBoard } from '@/action/board.action'
import ErrorField from '@/components/ErrorField'
import ModalWrapper from '@/components/modal/ModalWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CLOSE_CREATE_BOARD } from '@/redux/constant'
import { Board } from '@prisma/client'
import { Loader, ShieldAlert } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const CreateBoardModal = () => {
    const { boardToggle } = useSelector((state: any) => state.toggle)
    const dispatch = useDispatch()
    const router = useRouter()
    const params = useParams()

    const [title, setTitle] = useState<string>("")
    const [boards, setBoards] = useState<Board[] | null>([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState<boolean>(false)
    const [listLoading, setListLoading] = useState<boolean>(false)

    const handleCreate = async () => {
        setLoading(true)
        const { success, message } = await createBoard({ title, organizationId: `${params?.orgId}` })
        if (success) {
            setError("")
            setLoading(false)
            handleClose()
            return router.refresh()
        }
        if (!success) {
            setLoading(false)
            setError(message)
        }
    }

    const handleClose = () => {
        dispatch({ type: CLOSE_CREATE_BOARD })
    }


    useEffect(() => {
        if (title.length > 0) {
            const time = setTimeout(() => {
                const handle = async () => {
                    setListLoading(true) 
                    const boards = await getBoard(title)
                    setBoards(boards)
                    setListLoading(false)
                }
                handle()
            }, 500);
            return () => clearTimeout(time)
        } else {
            setBoards(null)
            setError("")
        }
    }, [title])



    return (
        <ModalWrapper isOpen={boardToggle.openCreateBoard} close={handleClose} headertext='Create Board'>
            <div className=' min-h-[10rem] h-full'>
                <div className=' flex gap-5'>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className='border border-neutral-900/30 rounded-lg' />
                    <Button onClick={handleCreate} disabled={title.length === 0} isLoading={loading}  >Create</Button>
                </div>
                <div className=' w-full'>
                    <ErrorField errorStr={error} className=' text-left' />
                </div>
                <div className='bg-slate-300 mt-3 top-full w-full'>
                    {
                        listLoading ?
                            <div className=' py-2'>
                                <Loader className=' w-max mx-auto animate-spin ' />
                            </div>
                            :
                            <div className=''>
                                {
                                    boards && boards.map((board) => (
                                        <div key={board.id} className=' py-3  hover:bg-gray-500/10 font-medium rounded-lg px-4 transition-all duration-200'>
                                                {board.title}
                                        </div>
                                    ))
                                }

                            </div>
                    }
                </div>
            </div>
        </ModalWrapper>
    )
}

export default CreateBoardModal