'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export const HeaderSearch = () => {
  return (
    <div className="flex-1 px-2 md:px-4">
      <div className="relative w-full max-w-[160px] sm:max-w-xs md:max-w-md mx-auto">
        <Input className="pr-20 pl-9 h-8 text-sm" placeholder="Buscar hotel..." />
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
  )
}
