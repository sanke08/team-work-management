import { getUser } from "@/action/user.action"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { Loader2, Medal } from "lucide-react"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function Home() {

  const { user } = await getUser()

  if (user) {
    const organization = await db.organization.findFirst({
      where: {
        creatorId: user.id
      }
    })
    redirect(`/organization/${organization?.id}`)

  }



  return (
    <Suspense fallback={<Loader2 className="h-20 w-20 animate-spin" />} >
      <div className=" flex flex-col items-center">
        <div className=" flex gap-1 bg-amber-200 p-3 rounded-lg text-amber-700 shadow-lg"> <Medal /> No 1 TASK MANAGEMENT</div>
        <div className=" text-4xl mt-4">Taskify hepls team move</div>
        <div className=" text-4xl bg-gradient-to-r from-fuchsia-400 to-pink-600 text-white p-2 rounded-lg mt-4">work forward .</div>
        <div className=" md:w-1/3 px-5 text-center text-neutral-500"> Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique - accomplish it all with Taskify.      </div>
        <Button className=" mt-5">get taskify for Free</Button>
      </div>
    </Suspense>
  )
}
