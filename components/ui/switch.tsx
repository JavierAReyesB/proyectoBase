'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

interface FilterSwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  labelOn?: string
  labelOff?: string
  id?: string
}

export const FilterSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  FilterSwitchProps
>(
  (
    {
      checked,
      onCheckedChange,
      labelOn = 'Completo',
      labelOff = 'Mitad',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const thumbTranslateX = checked
      ? 'translate-x-[105px]'
      : 'translate-x-[0px]'

    return (
      <SwitchPrimitives.Root
        role='switch'
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        ref={ref}
        className={cn(
          'relative inline-flex h-8 w-32 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out',
          checked ? 'bg-blue-500' : 'bg-gray-300',
          'outline-none ring-0 ring-offset-0 shadow-none',
          className
        )}
        {...props}
      >
        {/* Etiqueta central */}
        <span className='absolute inset-0 flex items-center justify-center text-[0.85rem] font-medium text-white'>
          {checked ? labelOn : labelOff}
        </span>

        {/* Thumb */}
        <SwitchPrimitives.Thumb
          className={cn(
            'absolute block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform duration-200 ease-in-out left-[4px]',
            thumbTranslateX,
            checked ? 'bg-gray-400' : 'bg-gray-400'
          )}
        />
      </SwitchPrimitives.Root>
    )
  }
)

FilterSwitch.displayName = 'FilterSwitch'
