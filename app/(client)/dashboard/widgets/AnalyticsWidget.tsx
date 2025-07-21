'use client'

export default function AnalyticsWidget() {
  return (
    <div className='h-full p-4'>
      <div className='grid grid-cols-2 gap-4 h-full'>
        <div className='bg-blue-50 dark:bg-blue-950 p-3 rounded-lg'>
          <div className='text-2xl font-bold text-blue-600'>1,234</div>
          <div className='text-sm text-muted-foreground'>Visitantes</div>
        </div>
        <div className='bg-green-50 dark:bg-green-950 p-3 rounded-lg'>
          <div className='text-2xl font-bold text-green-600'>89%</div>
          <div className='text-sm text-muted-foreground'>Conversión</div>
        </div>
        <div className='bg-purple-50 dark:bg-purple-950 p-3 rounded-lg'>
          <div className='text-2xl font-bold text-purple-600'>456</div>
          <div className='text-sm text-muted-foreground'>Ventas</div>
        </div>
        <div className='bg-orange-50 dark:bg-orange-950 p-3 rounded-lg'>
          <div className='text-2xl font-bold text-orange-600'>$12.3k</div>
          <div className='text-sm text-muted-foreground'>Ingresos</div>
        </div>
      </div>
    </div>
  )
}
