'use client'

import Link from 'next/link'
import { Mountain } from 'lucide-react'

export const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-2 min-w-[50px]">
      <Link href="/inicio" className="flex items-center justify-center">
        <Mountain className="size-5 md:size-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
    </div>
  )
}
