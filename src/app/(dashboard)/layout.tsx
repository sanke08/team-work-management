import { getUser } from "@/action/user.action"
import { Navbar } from "./_components/Navbar"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Suspense } from "react"
import { ArrowUpDown, ChevronsUpDown } from "lucide-react"

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { user } = await getUser()
    if (!user) return redirect("/auth")
    const members = await db.member.findMany({
        where: { userId: user.id },
        include: {
            Organization: {
                include: { creator: true }
            }
        }
    })

    return (
        <div className="  min-h-screen h-full">
            <Suspense fallback={<Skeleton/>}>
                <Navbar members={members} user={user} />
            </Suspense>
            <div className=" pt-14">
                {children}
            </div>
        </div>
    )
}

const Skeleton=()=>{
    return (
        <div className=" w-full h-14 flex justify-between items-center px-5">
            <div className=" flex items-center gap-5">
                <p className=" animate-pulse bg-neutral-500/50 w-20 py-4 rounded-lg"/>
                <p className=" animate-pulse bg-neutral-500/50 w-20 py-4 rounded-lg"/>
            </div>
            <div className=" w-60 flex py-1 justify-between items-center px-5 border border-neutral-500/30 rounded-lg ">
                <p className="bg-neutral-300/50 animate-pulse py-4 w-28 rounded-lg"/>
                <ChevronsUpDown className=" w-5 h-5"/>
            </div>
        </div>
    )
}