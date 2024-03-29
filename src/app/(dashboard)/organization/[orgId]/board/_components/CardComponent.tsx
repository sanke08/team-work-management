import { Card } from '@prisma/client'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {  usePathname, useRouter, useSearchParams } from 'next/navigation'
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
  useEffect(() => {
    const time = setTimeout(() => {
      // @ts-ignore
      router.replace(pathname)
    }, 4000);
    return () => {
      clearTimeout(time)
    }
  }, [pathname, router])
  return (
    <CustomDialogTrigger header='Card Detail' height='min-h-[20em]' width=' w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%]' content={<CardDetail card={card} />}>
      <div
        className={twMerge(' w-full p-2 px-4 rounded-lg shadow  shadow-neutral-500/10 hover:border-black border bg-white', searchParams?.has("hover") ? searchParams.get("hover") === card.id && "bg-sky-200/80" : "")}>
        {card.title}
      </div>

    </CustomDialogTrigger>
  )
}

export default CardComponent