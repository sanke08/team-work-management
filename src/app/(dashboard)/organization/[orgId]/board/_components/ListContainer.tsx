"use client"
import React, { useEffect, useState } from 'react'
import CreateList from './CreateList'
import { Card, List } from '@prisma/client'
import ListItem from './ListItem'
import { useSocket } from '@/components/provider/ReduxProvider'

type lists = List & { cards: Card[] }

interface Props {
    boardId: string
    data: lists[]
}


const ListContainer = ({ boardId, data }: Props) => {
    const [lists, setLists] = useState<lists[]>(data || [])

    const { socket } = useSocket()
    useEffect(() => {
        if (!socket) return
        socket.on(`create:$${boardId}`, (list: any) => {
            setLists((pre) => ([...pre, list]))
        })
        return () => {
            socket.on(`create:$${boardId}`)
        }
    }, [boardId, socket])


    useEffect(() => {
        if (!socket) return
        socket.on(`delete:$${boardId}`, (list: any) => {
            setLists(() => {
                return lists.filter((item: any) => item.id !== list.id)
            })
            // setLists(() => {
            //     return lists.map((item: any) => {
            //         if (list.id === item.id) return list
            //         return item
            //     })
            // })
        })
    }, [boardId, lists, socket])




    return (
        <div className=' flex'>
            <ol
                className=' flex w-full overflow-x-scroll hidescrollbar gap-3'>
                {
                    lists.map((list, index) => (
                        <ListItem key={list.id} list={list} />
                    ))
                }
                <CreateList boardId={boardId} />
            </ol>
        </div>
    )
}

export default ListContainer