import { Organization } from '@prisma/client'
import { Building, CreditCard } from 'lucide-react'
import React, { Suspense } from 'react'

const OrgInfo = ({ organization }: { organization: Organization | null }) => {
    return (
            <div className='w-max flex gap-2 border-b rounded-lg px-5'>
                <div className=" p-2 rounded-lg bg-blue-400 w-max"><Building className='fill-white text-black/50' /> </div>
                <div>
                    <p className=' font-semibold text-lg'>{organization?.name} </p>
                    <p className=' flex items-center gap-1 text-neutral-900/50 text-[0.7rem]'>
                        <CreditCard className='h-3 w-fit' />
                        Free
                    </p>
                </div>
            </div>
    )
}

export default OrgInfo

