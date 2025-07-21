'use client'

export default function GalleryWidget() {
  return (
    <div className='h-full p-4'>
      <div className='grid grid-cols-2 gap-2 h-full'>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className='bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg'
          />
        ))}
      </div>
    </div>
  )
}
