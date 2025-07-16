'use client'

export default function NotesWidget() {
  return (
    <div className='h-full p-4 space-y-2'>
      {[
        ['yellow', 'Reunión con el equipo'],
        ['green', 'Revisar propuesta'],
        ['blue', 'Llamar al cliente'],
        ['red', 'Entregar proyecto']
      ].map(([color, text], i) => (
        <div key={i} className='flex items-center gap-2'>
          <div className={`w-2 h-2 bg-${color}-400 rounded-full`}></div>
          <span className='text-sm'>{text}</span>
        </div>
      ))}
    </div>
  )
}
