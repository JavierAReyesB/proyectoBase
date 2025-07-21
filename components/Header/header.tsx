'use client'

import { useEffect, useState } from 'react'
import { HeaderLogo } from './HeaderLogo'
import { HeaderSearch } from './HeaderSearch'
import { HeaderActions } from './HeaderActions'

interface HeaderProps {
  activeSection: string
}

export function Header({ activeSection }: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className="fixed top-0 w-full px-2 md:px-4 lg:px-6 h-14 flex items-center justify-between z-20 bg-dashboard-bg">
      <HeaderLogo />
      <HeaderSearch />
      <HeaderActions />
    </header>
  )
}
