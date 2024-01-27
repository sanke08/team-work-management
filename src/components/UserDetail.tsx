import { User } from '@prisma/client'
import React, { useRef } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'




interface Props {
    user: User
}







const UserDetail = ({ user }: Props) => {
    const inputref = useRef({
        name: user.name
    })
    return (
        <div className=' w-full flex flex-col mt-5'>
            <Label htmlFor='name' >Name</Label>
            <Input id='name' placeholder={inputref.current.name} onChange={(e) => inputref.current.name = e.target.value} className=' border-2' />
            <Button className=' mt-5'>Update</Button>
        </div>
    )
}

export default UserDetail