"use client"
import React, { Suspense, useEffect, useState } from 'react'
import CreateList from './CreateList'
import { Card, List } from '@prisma/client'
import ListItem from './ListItem'
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useRouter, useSearchParams } from 'next/navigation'
import { MoveRight } from 'lucide-react'
import { updateListOrder } from '@/action/list.action'

type lists = List & { cards: Card[] }

interface Props {
    boardId: string
    data: lists[]
}

const reorder = (list: any[], sourceIndex: number, destinationIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(sourceIndex, 1)
    result.splice(destinationIndex, 0, removed)
    return result
}

const ListContainer = ({ boardId, data }: Props) => {
    const searchParams = useSearchParams()
    const router=useRouter()
    const [orderedData, setOredersData] = useState(data)
    useEffect(() => {
        setOredersData(data)
    }, [data])

    const onDrag = async(result: any) => {
        const { destination, source, type } = result
        if (!destination) return
        // dropped insame position
        if (destination.droppableId === source.droppableId && destination.index === source.index) return
        // user move list
        if (type === "list") {
            const items = reorder(orderedData, source.index, destination.index).map((item, index) => ({ ...item, order: index }))
            setOredersData(items)
            await updateListOrder({ items, boardId })
            router.refresh()
        }
        if (type === "card") {
            let newOrderData = [...orderedData]
            const sourceList = newOrderData.find(list => list.id === source.droppableId)
            const destList = newOrderData.find(list => list.id === destination.droppableId)
            if (!sourceList || !destList) {
                return
            }
            // check if the card is exist on source list
            if (!sourceList.cards) {
                sourceList.cards = []
            }
            // check if cards exist on the destList
            if (!destList.cards) {
                destList.cards = []
            }
            // source.droppableId =>list id
            // moving the card in the same list
            if (source.droppableId === destination.droppableId) {
                const reorderCards = reorder(sourceList.cards, source.index, destination.index)
                reorderCards.forEach((card, index) => {
                    card.order = index
                })
                sourceList.cards = reorderCards
                setOredersData(newOrderData)
                // todo server action
                // user move to another list
            } else {
                // remover card from list
                const [moveCard] = sourceList.cards.splice(source.index, 1)
                // Assining new list id to card 
                moveCard.listId = destination.droppableId
                // Add to destination list
                destList.cards.splice(destination.index, 0, moveCard)
                sourceList.cards.forEach((card, index) => {
                    card.order = index
                })
                // update the order for each card in destination list
                destList.cards.forEach((card, index) => {
                    card.order = index
                })
                setOredersData(newOrderData)
            }

        }


    }


    return (
        <DragDropContext onDragEnd={onDrag}>
            <Droppable droppableId='lists' type='list' direction="horizontal">
                {(provided) => {
                    return (
                        <div className=' flex'>
                            {/* <MoveRight className=' bg-white rounded-full' /> */}
                            <ol
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className=' flex w-full overflow-x-scroll hidescrollbar gap-3'>
                                {
                                    orderedData.map((list, index) => (
                                        // @ts-ignore
                                        <ListItem key={list.id} list={list} index={index} />
                                    ))
                                }
                                {provided.placeholder}
                                <CreateList boardId={boardId} />
                            </ol>
                        </div>
                    )
                }}
            </Droppable>
        </DragDropContext>
    )
}

export default ListContainer