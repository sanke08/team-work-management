"use client"
import { useCallback, useEffect, useState } from "react"

export const useOldAction = ({ FN, onSuccess }: { FN: () => Promise<any>, onSuccess?: () => void }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const execute = async () => {
        setLoading(true)
        setSuccess("")
        setError("")
        try {
            const { data } = await FN()
            setSuccess(data.message)
            onSuccess ? onSuccess() : null
        } catch (error: any) {
            setError(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }


    const reset = useCallback(() => {
        setError("")
        setSuccess("")
        setLoading(false)
    }, [])

    return { loading, error, success, execute, reset }
}