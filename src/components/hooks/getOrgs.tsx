"use client"
import { getOrganizations } from "@/action/organization.action"
import { Organization } from "@prisma/client"
import { useEffect, useState } from "react"


const GetOrgs = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [orgs, setOrgs] = useState<Organization[]>()

    useEffect(() => {
        setIsLoading(true)
        const get = async () => {
            const { organizations, success, message } = await getOrganizations()
            setOrgs(organizations)
            setIsLoading(false)
        }
        get()
    }, [])
    return { organizations: orgs, isLoading }
}

export default GetOrgs