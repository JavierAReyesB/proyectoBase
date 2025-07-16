'use client'

export default function ChatWidget() {
  const chats = [
    { name: 'Juan Pérez', message: 'Hola, ¿cómo va el proyecto?', initials: 'JD', color: 'blue' },
    { name: 'María García', message: 'Perfecto, enviado!', initials: 'MG', color: 'green' },
    { name: 'Ana López', message: 'Revisemos mañana', initials: 'AL', color: 'purple' }
  ]

  return (
    <div className='h-full p-4 space-y-3'>
      {chats.map(({ name, message, initials, color }, i) => (
        <div key={i} className='flex items-center gap-2'>
          <div className={`w-8 h-8 bg-${color}-500 rounded-full flex items-center justify-center text-white text-xs`}>
            {initials}
          </div>
          <div className='flex-1'>
            <div className='text-sm font-medium'>{name}</div>
            <div className='text-xs text-muted-foreground'>{message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
