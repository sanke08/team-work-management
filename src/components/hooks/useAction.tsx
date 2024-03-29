"use client"
import { useCallback, useEffect, useState } from "react"

export const useAction = ({ FN, onSuccess }: { FN: (val?:any) => Promise<any>, onSuccess?: () => void }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const execute = async (val?: string) => {
        setLoading(true)
        setSuccess(false)
        setError("")
        const { success, message } = await FN(val)
        if (success) {
            setSuccess(true)
            onSuccess ? onSuccess() : null
        }
        if (!success) setError(message)
        setLoading(false)
    }
    const reset = useCallback(() => {
        setError("")
        setSuccess(false)
        setLoading(false)
    }, [])
    useEffect(() => {
        if (success) {
            setError("")
            setSuccess(true)
            setSuccess(false)
        }
    }, [success])
    return { loading, error, success, execute, reset }
}