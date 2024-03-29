import { Card, List } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import ListHeader from './ListHeader'
import CreateCard from './CreateCard'
import CardComponent from './CardComponent'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { useSocket } from '@/components/provider/ReduxProvider'

interface Props {
    list: List & {
        cards: Card[]
    }
}

const ListItem = ({ list }: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [cards, setCards] = useState<Card[]>(list.cards || [])
    const { socket } = useSocket()


    useEffect(() => {
        const time = setTimeout(() => {
            pathname && router.replace(pathname)
        }, 4000);
        return () => {
            clearTimeout(time)
        }
    }, [pathname, router])
    useEffect(() => {
        if (!socket) return
        socket.on(`create:${list.id}`, (card: Card) => {
            setCards((pre) => ([...pre, card]))
        })
        return () => {
            socket.off(`create:${list.id}`)
        }
    }, [list.id, socket])

    useEffect(() => {
        if (!socket) return
        socket.on(`update:${list.id}`, (card: Card) => {
            console.log(card)
            setCards(() => {
                return cards.map((c) => {

                    if (card.id === c.id) return card
                    return c
                })
            })
        })
        return () => {
            socket.off(`update:${list.id}`)
        }
    }, [cards, list.id, socket])

    useEffect(() => {
        if (!socket) return
        socket.on(`delete:${list.id}`, (card: Card) => {
            setCards(() => {
                return cards.filter((c) => c.id !== card.id)
            })
        })
        return () => {
            socket.off(`delete:${list.id}`)
        }
    }, [cards, list.id, socket])

    return (
        <li

            className={twMerge(' bg-neutral-100 p-2 min-w-[250px] rounded-md  h-fit border', searchParams?.has("hover") ? searchParams?.get("hover") === list.id && "bg-sky-200/80" : "")}>
            <div >
                <ListHeader list={list} />
                <ol
                    className=' flex flex-col space-y-2'>
                    {
                        cards && cards.map((card, index) => (
                            <CardComponent key={card.id} card={card} index={index} />
                        ))
                    }
                </ol>
                <CreateCard listId={list.id} />
            </div>
        </li>
    )
}

export default ListItem