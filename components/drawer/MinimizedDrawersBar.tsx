'use client'

import type React from 'react'
import { useState, useEffect  } from 'react'
import { Maximize2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { saveMapToLocalStorage } from '@/app/utils/localStorageMapUtils'


type DrawerSize = 'quarter' | 'third' | 'half' | 'full'

export interface MinimizedDrawerInfo {
  id: string
  title: React.ReactNode
  width: DrawerSize
  isPinned: boolean
  icon?: React.ReactNode
  instanceId?: string
}

interface MinimizedDrawersBarProps {
  groupedDrawers: Map<string, MinimizedDrawerInfo[]>
  onRestoreIndividual: (id: string) => void
  onCloseIndividual: (id: string) => void
}

 const STORAGE_KEY = 'minimizedDrawers'
 

export function MinimizedDrawersBar({
  groupedDrawers,
  onRestoreIndividual,
  onCloseIndividual
}: MinimizedDrawersBarProps) {
  const [openPopoverTitle, setOpenPopoverTitle] = useState<string | null>(null)

  useEffect(() => {
    saveMapToLocalStorage(STORAGE_KEY, groupedDrawers)
  }, [groupedDrawers])

  if (groupedDrawers.size === 0) return null

  return (
    <div
      className='fixed bottom-4 right-4 z-[5000] flex flex-row items-center gap-2 bg-background p-2 rounded-lg shadow-lg max-w-[calc(100vw-32px)] overflow-x-auto'
      data-drawer-ignore="true"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {Array.from(groupedDrawers.entries()).map(([title, drawersList]) => {
        const firstDrawer = drawersList[0]
        const count = drawersList.length
        const isPopoverOpen = openPopoverTitle === title

        if (count === 1) {
          const singleDrawer = drawersList[0]
          return (
            <div key={title} className='flex items-center gap-1'>
              <Button
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation()
                  onRestoreIndividual(singleDrawer.id)
                }}
                className='flex items-center gap-2 px-3 py-2 h-auto text-sm font-medium whitespace-nowrap'
              >
                {singleDrawer.icon && (
                  <div className='flex-shrink-0'>{singleDrawer.icon}</div>
                )}
                <span className='truncate'>
                  {singleDrawer.instanceId || singleDrawer.title}
                </span>
              </Button>
              <Button
                size='sm'
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseIndividual(singleDrawer.id)
                }}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          )
        }

        return (
          <div key={title} className='flex items-center gap-1'>
            <Popover
              open={isPopoverOpen}
              onOpenChange={(open) => setOpenPopoverTitle(open ? title : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  className='flex items-center gap-2 px-3 py-2 h-auto text-sm font-medium whitespace-nowrap'
                  onClick={(e) => e.stopPropagation()}
                >
                  {firstDrawer.icon && (
                    <div className='flex-shrink-0'>{firstDrawer.icon}</div>
                  )}
                  <span className='truncate'>{title}</span>
                  <Badge
                    className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] ml-auto px-2 py-0.5 text-xs"
                  >
                    {count}
                  </Badge>
                  {isPopoverOpen ? (
                    <ChevronUp className='h-3 w-3 ml-1' />
                  ) : (
                    <ChevronDown className='h-3 w-3 ml-1' />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-64 p-2 mb-2'
                align='end'
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <div className='flex flex-col gap-1'>
                  {drawersList.map((drawer, idx) => (
                    <div
                      key={`${drawer.id}-${drawer.instanceId ?? idx}`} /* clave única */
                      className='flex items-center justify-between rounded-md bg-muted/50 p-2 text-xs'
                    >
                      <span className='truncate'>
                        {drawer.instanceId || drawer.title}
                      </span>
                      <div className='flex gap-1'>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={(e) => {
                            e.stopPropagation()
                            onRestoreIndividual(drawer.id)
                            setOpenPopoverTitle(null)
                          }}
                          className='h-6 w-6 p-0'
                        >
                          <Maximize2 className='h-3 w-3' />
                        </Button>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={(e) => {
                            e.stopPropagation()
                            onCloseIndividual(drawer.id)
                            if (drawersList.length === 1) {
                              setOpenPopoverTitle(null)
                            }
                          }}
                          className='h-6 w-6 p-0'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Cerrar todo el grupo */}
            <Button
              size='sm'
              variant='ghost'
              onClick={(e) => {
                e.stopPropagation()
                drawersList.forEach((d) => onCloseIndividual(d.id))
                setOpenPopoverTitle(null)
              }}
              className='h-8 w-8 p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
