import React, { Suspense } from 'react'
import OrgInfo from '../_components/OrgInfo'
import { db } from '@/lib/db'
import { format } from "date-fns"
import { generateLogMessage } from '@/lib/generateLogMessage'
import { User } from 'lucide-react'
import Link from 'next/link'

interface Props {
    params: {
        orgId: string
    }
}



const page = async ({ params }: Props) => {
    const org = await db.organization.findUnique({
        where: { id: params.orgId }
    })
    if (!org) {
        return (
            <div>
                org not found
            </div>
        )
    }
    const activities = await db.auditLog.findMany({
        where: {
            orgId: org.id,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <Suspense fallback={<Skeleton />}  >
            <div >
                <OrgInfo organization={org} />
                <p className=' mt-5 text-3xl pl-5 sm:pl-0'>Activities</p>
                <div className=' space-y-2 mt-5 sm:pl-10 flex'>
                    {/* <Skeleton/> */}
                    <div className=' space-y-5 w-full'>
                        {
                            activities.length > 0 && activities.map((activity) => {
                                let link = "";
                                if (activity.entityType === "BOARD" && activity.action !== "DELETE") link = `/organization/${activity.orgId}/board/${activity.entityId}`;
                                if (activity.entityType === "CARD" && activity.action !== "DELETE") link = `/organization/${activity.orgId}/board/${activity.boardId}?hover=${activity.entityId}`
                                if (activity.entityType === "LIST" && activity.action !== "DELETE") link = `/organization/${activity.orgId}/board/${activity.boardId}?hover=${activity.entityId}`
                                return (
                                    <Link href={link} key={activity.id} className='px-3 py-1 w-full border-b-2 flex items-center'>
                                        <User className=' h-full aspect-square' />
                                        <div className="flex flex-col space-y-0.5 ">
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold lowercase text-neutral-700">
                                                    {activity.userName}
                                                </span> {generateLogMessage(activity)} <span className=' font-semibold'>{activity.entityTitle} </span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Suspense>
    )
}
 
export default page

const Skeleton = () => {
    return (
        <div className=' space-y-5'>
            {
                [...Array(10)].map((i, j) => (
                    <div key={j} className=' items-center flex'>
                        <User className=' h-full aspect-square animate-pulse' />
                        <div className="flex flex-col space-y-0.5 ">
                            <p className="text-sm text-muted-foreground">
                                <p className="font-semibold lowercase py-2 rounded-lg w-40 text-neutral-700 animate-pulse bg-neutral-500" ></p>
                            </p>
                            <p className="text-xs text-muted-foreground animate-pulse py-1.5 w-28 bg-neutral-500 rounded-lg" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}