"use client"

import { getUser } from "@/action/user.action"
import { User } from "@prisma/client"
import { useEffect, useState } from "react"

const useUser = () => {
    const [user, setUser] = useState<User>()
    useEffect(() => {
        const get = async () => {
            const { user, success } = await getUser()
            if (success) {
                setUser(user)
            }
        }
        get()
    }, [])
    return user
}

export default useUser