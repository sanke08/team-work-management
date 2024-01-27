"use client"
import { Button } from '@/components/ui/button'
import { OPEN_CREATE_ORGANIZATION } from '@/redux/constant'
import { Plus } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'

const CreateOrgNavComponent = () => {
  const dispatch = useDispatch()
  return (
    <div className=' flex justify-between items-center'>
      <p>WorkSpaces</p>
      <Button onClick={() => dispatch({ type: OPEN_CREATE_ORGANIZATION })} variant={"ghost"} className=' bg-slate-300/70 hover:bg-slate-300/70 hidden md:block'>
        <Plus />
      </Button>
    </div>
  )
}

export default CreateOrgNavComponent