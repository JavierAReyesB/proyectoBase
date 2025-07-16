'use client'

import { Badge } from '@/components/ui/badge'

export default function TeamWidget() {
  const team = [
    { name: 'Juan Pérez', role: 'Desarrollador', status: 'Online', initials: 'JD', color: 'blue' },
    { name: 'María García', role: 'Diseñadora', status: 'Ausente', initials: 'MG', color: 'green' },
    { name: 'Ana López', role: 'Product Manager', status: 'Online', initials: 'AL', color: 'purple' }
  ]

  return (
    <div className='h-full p-4 space-y-3'>
      {team.map(({ name, role, status, initials, color }, i) => (
        <div key={i} className='flex items-center gap-3'>
          <div className={`w-10 h-10 bg-${color}-500 rounded-full flex items-center justify-center text-white font-medium`}>
            {initials}
          </div>
          <div>
            <div className='text-sm font-medium'>{name}</div>
            <div className='text-xs text-muted-foreground'>{role}</div>
          </div>
          <Badge variant={status === 'Online' ? 'secondary' : 'outline'} className='ml-auto'>
            {status}
          </Badge>
        </div>
      ))}
    </div>
  )
}
