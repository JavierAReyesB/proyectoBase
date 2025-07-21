'use client'

export default function ChartWidget() {
  const stats = [
    { label: 'Ventas', value: 85, color: 'blue' },
    { label: 'Marketing', value: 72, color: 'green' },
    { label: 'Soporte', value: 91, color: 'purple' }
  ]

  return (
    <div className='h-full p-4 space-y-2'>
      {stats.map(({ label, value, color }, i) => (
        <div key={i}>
          <div className='flex justify-between items-center'>
            <span className='text-sm'>{label}</span>
            <span className='text-sm font-medium'>{value}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className={`bg-${color}-600 h-2 rounded-full`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
