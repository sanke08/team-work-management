import type { Metadata } from 'next'
import './globals.css'
import ReduxProvider from '@/components/provider/ReduxProvider'


export const metadata: Metadata = {
  title: "Taskify",
  description: "Collaborate, manage projects, and reach new productivity peaks",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <div>
          {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
