import { db } from '@/lib/db'
import React, { Suspense } from 'react'
import Setting from './_components/Setting'
import Members from './_components/Members'
import Toggle from './_components/Toggle'
import { getUser } from '@/action/user.action'
import { redirect } from 'next/navigation'

interface Props {
  params: {
    orgId: string
  },
  searchParams: {
    memberPage: number
  }
}

const page = async ({ params, searchParams }: Props) => {
  const page = parseInt(`${searchParams.memberPage}`, 10) || 0
  const organization = await db.organization.findUnique({
    where: {
      id: params.orgId
    }
  })
  const members = await db.member.findMany({
    where: {
      organizationId: organization?.id
    },
    include: {
      user: true
    },
    skip: (1 - page) * 10,
    take: 10
  })

  const { user } = await getUser()
  if (!user) return redirect("/auth")
  const currMember = await db.member.findFirst({
    where: {
      userId: user.id,
      organizationId: organization?.id
    }
  })
  if (!currMember) return
  if (organization?.creatorId !== user.id) {
    return redirect("/organization/" + organization?.id)
  }

  if (!organization) {
    return (
      <div>
        Something went Wrong
      </div>
    )
  }


  return (
    <Suspense fallback={<p className=' p-5 bg-red-400 w-full h-40'>Loadin</p>} >
      <div className=' w-full'>
        <div className=' lg:flex w-full justify-center sm:px-10'>
          <div className='lg:w-[50%] mt-2'>
            <Toggle org={organization} />
          </div>
          <div className=' w-full h-full'>
            <Setting orgName={organization?.name} orgId={organization.id} />
            <Members organization={organization} members={members} user={currMember} />
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default page