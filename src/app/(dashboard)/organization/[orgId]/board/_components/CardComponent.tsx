import { Card } from '@prisma/client'
import React, { useEffect } from 'react'
import { Draggable } from "@hello-pangea/dnd"
import { draftMode } from 'next/headers'
import { useDispatch } from 'react-redux'
import { GET_CARD_SUCCESS, OPEN_CARD_DETAIL } from '@/redux/constant'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import CustomDialogTrigger from '@/components/CustomDialogTrigger'
import CardDetail from '../../../_components/CardDetail'

interface Props {
  card: Card,
  index: number
}


const CardComponent = ({ card, index }: Props) => {

  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const handleClick = () => {
    dispatch({ type: GET_CARD_SUCCESS, payload: card })
    dispatch({ type: OPEN_CARD_DETAIL })
  }
  useEffect(() => {
    const time = setTimeout(() => {
      router.replace(pathname)
    }, 4000);
    return () => {
      clearTimeout(time)
    }
  }, [pathname, router])
  return (
    <CustomDialogTrigger header='Card Detail' height='min-h-[20em]' width=' w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%]' content={<CardDetail card={card} />}>
      <Draggable draggableId={card.id} index={index}>
        {(provided) => {
          return (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              // onClick={handleClick}
              className={twMerge(' w-full p-2 px-4 rounded-lg shadow  shadow-neutral-500/10 hover:border-black border bg-white', searchParams.has("hover") ? searchParams.get("hover") === card.id && "bg-sky-200/80" : "")}>
              {card.title}
            </div>
          )
        }}
      </Draggable>
    </CustomDialogTrigger>
  )
}

export default CardComponent