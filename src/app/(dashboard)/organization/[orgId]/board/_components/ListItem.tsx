import { Card, List } from '@prisma/client'
import React, { useEffect } from 'react'
import ListHeader from './ListHeader'
import CreateCard from './CreateCard'
import CardComponent from './CardComponent'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

interface Props {
    list: List & {
        cards: Card[]
    }
    index: number
}

const ListItem = ({ list, index }: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    useEffect(() => {
        const time = setTimeout(() => {
            router.replace(pathname)
        }, 4000);
        return () => {
            clearTimeout(time)
        }
    }, [pathname, router])
    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided) => {
                return (
                    <li
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className={twMerge(' bg-neutral-100 p-2 min-w-[250px] rounded-md  h-fit border', searchParams.has("hover") ? searchParams.get("hover") === list.id && "bg-sky-200/80" : "")}>
                        <div {...provided.dragHandleProps}>
                            <ListHeader list={list} />
                            <Droppable droppableId={list.id} type='card' >
                                {(provided) => {
                                    return (
                                        <ol
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className=' flex flex-col space-y-2'>
                                            {
                                                list.cards && list.cards.map((card, index) => (
                                                    <CardComponent key={card.id} card={card} index={index} />
                                                ))
                                            }
                                            {provided.placeholder}
                                        </ol>
                                    )
                                }}
                            </Droppable>
                            <CreateCard listId={list.id} />
                        </div>
                    </li>
                )
            }}

        </Draggable>
    )
}

export default ListItem