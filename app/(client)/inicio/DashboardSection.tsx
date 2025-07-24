'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface DashboardSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function DashboardSection({
  title,
  description,
  children,
  className
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        // ↓↓↓ Menos padding lateral en móvil / tablet
        'rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-2 sm:px-4 md:px-6 py-6 shadow-md space-y-6',
        className
      )}
    >
      {<h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
}
      {description && (
        <p className="text-sm text-white/70">{description}</p>
      )}
      {children}
    </section>
  )
}
