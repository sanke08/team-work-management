import { Footer } from "./_components/Footer"
import { Navbar } from "./_components/Navbar"



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" bg-slate-200 h-full min-h-screen">
      <Navbar />
      <main className=" pt-40 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}
