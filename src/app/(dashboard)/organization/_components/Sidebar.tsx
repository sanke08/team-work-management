"use client"
import { Accordion } from '@/components/ui/accordion'
import React from 'react'
import NavItem from './Nab-Item'
import CreateOrgNavComponent from './CreateOrgNavComponent'
import { Member, Organization, User } from '@prisma/client'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import UserButton from '@/components/UserButton'
import CustomDialogTrigger from '@/components/CustomDialogTrigger'
import LeaveOrg from '@/components/LeaveOrg'
import { useParams } from 'next/navigation'


interface Props {
    members: Array<Member & { Organization: Organization & { creator: User } }> | undefined
    user: User
}

const Sidebar = ({ members, user }: Props) => {

    const params: { orgId: string } = useParams()
    if (!members) {
        return
    }


    let orgs: Array<Organization & { creator: User }> = [];
    members?.forEach((member) => {
        return orgs.push(member.Organization)
    })

    const currOrg = orgs.find((org) => org.id === params.orgId)


    return (
        <div className=' w-full h-fit'>
            <CreateOrgNavComponent />
            <Accordion type="multiple" className=' mt-1'>
                {
                    members && members.map(({ Organization }) => (
                        // @ts-ignorez
                        <NavItem key={Organization.id} organization={Organization} user={user} />
                    ))
                }
            </Accordion>
            <div className=' fixed bottom-0 space-y-2 w-[300px] bg-slate-200 sm:w-[250px] left-0 p-3'>
                <UserButton user={user} />
                {
                    // @ts-ignore
                    members[0].Organization.creatorId == members[0].userId &&
                    <CustomDialogTrigger header='Leave Organization' height=' md:h-[20em] min-h-[18em]' width='lg:w-[40%] w-[90%]' content={<LeaveOrg currOrg={currOrg} member={members[0]} />}>
                        <Button variant={"outline"} className=' flex gap-2 w-full h-fit p-1.5'>
                            Leave Organization
                            <LogOut />
                        </Button>
                    </CustomDialogTrigger>
                }
            </div>
        </div>
    )
}

export default Sidebar


