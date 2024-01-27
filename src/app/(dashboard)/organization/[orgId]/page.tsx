import React, { Suspense } from 'react'
import CreateBoard from './_components/CreateBoard'
import { db } from '@/lib/db'
import OrgInfo from './_components/OrgInfo'
import BoardList from './_components/BoardList'
import { getUser } from '@/action/user.action'
import { redirect } from 'next/navigation'

interface Props {
  params: {
    orgId: string
  }
}


const page = async ({ params }: Props) => {
  const { user } = await getUser()
  if (!user) return redirect("/auth")
  const organization = await db.organization.findUnique({
    where: {
      id: params.orgId
    }
  })
  if (!organization) {
    return (
      <div>
        Not organization found
      </div>
    )
  }
  const member = await db.member.findFirst({
    where: {
      organizationId: organization.id,
      userId: user.id
    }
  })
  if (!member) {
    return (
      <div>
        You are not part of <span className=' text-2xl text-blue-600'>{organization.name}</span>  Org
      </div>
    )
  }
  const boards = await db.board.findMany({
    where: {
      organizationId: organization.id,
      trash:false
    }
  })
  return (
    <Suspense fallback={<Skeleton />} >
      <div className=' w-full mt-2'>
        <Suspense fallback={<InfoSkeleton />} >
          <OrgInfo organization={organization} />
        </Suspense>
        <div className=' w-full h-[0.1rem] rounded-full mt-3 bg-neutral-900/10' />
        <div className=' grid justify-center w-full md:grid-cols-3 min-[412px]:grid-cols-2 sm:p-0 px-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 lg:px-10 min-[412px]:gap-3 mt-5'>
          <Suspense fallback={<BoardSkeleton />} >
            <BoardList boards={boards} orgId={organization.id} />
          </Suspense>
          <CreateBoard member={member} />
        </div>
      </div>
    </Suspense>
  )
}

export default page


const BoardSkeleton = () => {
  return (
    <div className=' w-full h-20 rounded-lg bg-neutral-700/50 animate-pulse shadow-lg shadow-neutral-500/50 relative' />
  )
}

const InfoSkeleton = () => {
  return (
    <div className='w-40 flex gap-2 p-2 rounded-lg px-5'>
      <div className=" p-5 rounded-lg bg-neutral-400/70 animate-pulse w-max" />
      <div>
        <p className=' font-semibold text-lg w-20 py-3 bg-neutral-400/50 animate-pulse rounded-md' />
        <p className=' flex items-center gap-1 mt-1'>
          <p className=' w-3 py-2 animate-pulse bg-neutral-400/50' />
          <p className=' w-10 rounded-md py-2 animate-pulse bg-neutral-400/50' />
        </p>
      </div>
    </div>
  )
}


const Skeleton = () => {
  return (
    <div className='w-40 flex gap-2 p-2 rounded-lg px-5'>
      <div className=" p-5 rounded-lg bg-neutral-400/70 animate-pulse w-max" />
      <div>
        <p className=' font-semibold text-lg w-20 py-3 bg-neutral-400/50 animate-pulse rounded-md' />
        <p className=' flex items-center gap-1 mt-1'>
          <p className=' w-3 py-2 animate-pulse bg-neutral-400/50' />
          <p className=' w-10 rounded-md py-2 animate-pulse bg-neutral-400/50' />
        </p>
      </div>
    </div>
  )
}