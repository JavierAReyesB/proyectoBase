'use client'

import { useEffect, useState } from 'react'

export default function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='h-full flex flex-col items-center justify-center p-4'>
      <div className='text-2xl font-mono font-bold'>
        {time.toLocaleTimeString()}
      </div>
      <div className='text-sm text-muted-foreground'>
        {time.toLocaleDateString()}
      </div>
    </div>
  )
}
