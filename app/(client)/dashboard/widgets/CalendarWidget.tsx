'use client'

import { cn } from '@/lib/utils'

export default function CalendarWidget() {
  return (
    <div className='h-full p-4'>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h4 className='font-semibold'>Diciembre 2024</h4>
        </div>
        <div className='grid grid-cols-7 gap-1 text-xs'>
          {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day) => (
            <div key={day} className='text-center font-medium p-1'>
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'text-center p-1 rounded hover:bg-accent cursor-pointer',
                i + 1 === 15 && 'bg-primary text-primary-foreground'
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
