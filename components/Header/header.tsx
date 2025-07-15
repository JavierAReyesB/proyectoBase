import Link from 'next/link'
import { Mountain } from 'lucide-react'

export function Header() {
  return (
    // Añadimos fixed top-0 w-full para que el header se superponga al sidebar y sea fijo
    <header className='fixed top-0 w-full px-4 lg:px-6 h-14 flex items-center z-20 bg-dashboard-bg'>
      <Link href='/' className='flex items-center justify-center'>
        <Mountain className='size-6' />
        <span className='sr-only'>Acme Inc</span>
      </Link>
      <nav className='ml-auto flex gap-4 sm:gap-6'>
        <Link
          href='#'
          className='text-sm font-medium hover:underline underline-offset-4'
        >
          Características
        </Link>
        <Link
          href='#'
          className='text-sm font-medium hover:underline underline-offset-4'
        >
          Precios
        </Link>
        <Link
          href='#'
          className='text-sm font-medium hover:underline underline-offset-4'
        >
          Acerca de
        </Link>
        <Link
          href='#'
          className='text-sm font-medium hover:underline underline-offset-4'
        >
          Contacto
        </Link>
      </nav>
    </header>
  )
}
