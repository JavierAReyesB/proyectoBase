// src/types/cards.ts
import type { ReactNode } from 'react'

export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export interface CardConfig {
  key: string
  title: string
  value: string
  badge: string
  badgeVariant: string
  content: ReactNode
  size?: CardSize
}
