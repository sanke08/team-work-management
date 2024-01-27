"use client"
import { Button } from '@/components/ui/button'
import { OPEN_CREATE_BOARD } from '@/redux/constant'
import { Member, Role } from '@prisma/client'
import { HelpCircle } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { twMerge } from 'tailwind-merge'


const CreateBoard = ({ member }: { member: Member }) => {
  const dispatch = useDispatch()
  return (
    <div className=' flex flex-col gap-0.5'>
      <Button disabled={member.role == Role.MEMBER} onClick={() => dispatch({ type: OPEN_CREATE_BOARD })} variant={"ghost"} className='group-item bg-gray-500/20 hover:bg-slate-200  py-10 rounded-lg w-full '>
        <div className=' text-xs w-max mx-auto'>
          create new Board
        </div>
      </Button>
      {
        member.role == Role.MEMBER&&
      <p className=' text-[0.6rem] font-semibold text-red-500'>Only Admin Can Create Board</p>
      }
    </div>
  )
}

export default CreateBoard