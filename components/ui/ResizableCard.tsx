'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ResizableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, card stretches to fill parent (100% width & height).
   * Otherwise it respects explicit width / height passed via style.
   */
  full?: boolean
}

/**
 * A fluid Card component that can be resized freely by its parent.
//  * – No fixed w‑*/
//  * – Animation / glassmorphism styles included.
//  */
export const ResizableCard = React.forwardRef<HTMLDivElement, ResizableCardProps>(
  ({ className, full, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // base visual
        'flex flex-col rounded-lg border border-white/20 bg-white/20 backdrop-blur-md text-card-foreground',
        // subtle elevation & hover motion
        'shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:bg-white/25 hover:border-white/30 hover:-translate-y-[2px]',
        // 100% sizing when demanded
        full && 'w-full h-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
ResizableCard.displayName = 'ResizableCard'

/* --------------------------------------------------------------------------
 * SUB‑COMPONENTS
 * ------------------------------------------------------------------------*/

export const ResizableCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-4', className)} {...props}>
    {children}
  </div>
))
ResizableCardHeader.displayName = 'ResizableCardHeader'

export const ResizableCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
ResizableCardTitle.displayName = 'ResizableCardTitle'

export const ResizableCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
ResizableCardDescription.displayName = 'ResizableCardDescription'

export const ResizableCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 w-full h-full p-4 overflow-hidden', className)} {...props}>
    {children}
  </div>
))
ResizableCardContent.displayName = 'ResizableCardContent'

export const ResizableCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-4 pt-0', className)} {...props}>
    {children}
  </div>
))
ResizableCardFooter.displayName = 'ResizableCardFooter'

/* --------------------------------------------------------------------------
 * NAMED EXPORT GROUP (optional syntactic sugar)
 * ------------------------------------------------------------------------*/
export const RC = {
  Root: ResizableCard,
  Header: ResizableCardHeader,
  Title: ResizableCardTitle,
  Description: ResizableCardDescription,
  Content: ResizableCardContent,
  Footer: ResizableCardFooter
}

// Usage example:
// <ResizableCard style={{ width: 320, height: 200 }}>
//   <ResizableCardHeader>
//     <ResizableCardTitle>My Widget</ResizableCardTitle>
//   </ResizableCardHeader>
//   <ResizableCardContent>…content…</ResizableCardContent>
// </ResizableCard>
