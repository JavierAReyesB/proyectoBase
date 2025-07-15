'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Bell,
  Menu,
  Mountain,
} from 'lucide-react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface HeaderProps {
  activeSection: string
  setSidebarOpen: (open: boolean) => void
}

export function Header({ activeSection, setSidebarOpen }: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getTitle = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'Dashboard'
      case 'check-in-out':
        return 'Check In-Out'
      case 'rooms':
        return 'Rooms'
      case 'messages':
        return 'Messages'
      case 'customer-review':
        return 'Customer Review'
      case 'billing':
        return 'Billing System'
      case 'food-delivery':
        return 'Food Delivery'
      default:
        return 'Premium Version'
    }
  }

  return (
    <header className="fixed top-0 w-full px-2 md:px-4 lg:px-6 h-14 flex items-center justify-between z-20 bg-dashboard-bg">
  {/* IZQUIERDA: Logo + menú */}
  <div className="flex items-center gap-2 min-w-[50px]">
    <Link href="/" className="flex items-center justify-center">
      <Mountain className="size-5 md:size-6" />
      <span className="sr-only">Acme Inc</span>
    </Link>
    {/* {isMobile && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    )} */}
  </div>

  {/* CENTRO: Input con botón de búsqueda */}
  <div className="flex-1 px-2 md:px-4">
    <div className="relative w-full max-w-[160px] sm:max-w-xs md:max-w-md mx-auto">
      <Input
        className="pr-20 pl-9 h-8 text-sm"
        placeholder="Buscar hotel..."
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />
      <Button
        type="button"
        size="xs"
        onClick={() => console.log('Buscar clickeado')}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
      >
        Buscar
      </Button>
    </div>
  </div>

  {/* DERECHA: Notificaciones + Avatar */}
  <div className="flex items-center gap-2 min-w-fit">
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="User"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</header>

  )
}
