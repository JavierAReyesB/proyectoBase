// app/layout.tsx  ← **server component**, NO lleva 'use client'
import React from 'react'
import { cookies } from 'next/headers'
import './globals.css'

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'false'

  return (
    <html lang="es" className="bg-background">
      <head>
        <style>{`
          html, body { background-color: var(--background); }
        `}</style>
      </head>
      <body className="h-full min-h-screen">
        {/** Aquí metemos SOLO nuestro route‐group de cliente */}
        {children}
        <div id="drawer-root" />
      </body>
    </html>
  )
}
