'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

export type PanelKey = 'chat' | 'settings' | 'help' | 'filters' | 'actions' // ajusta si tienes más keys

interface ButtonConfig {
  key: PanelKey
  icon: React.ReactNode
  label?: string
}

interface Props {
  active: PanelKey | null
  onToggle: (panel: PanelKey | null) => void
  buttons?: ButtonConfig[]
  fabIcon?: React.ReactNode
}

const MAX_RADIAL_ITEMS = 8
const RADIUS = 70 

const SidebarToggleBar: React.FC<Props> = ({ active, onToggle, buttons = [], fabIcon }) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  if (!buttons.length) return null

  const handleClick = (key: PanelKey) => {
    onToggle(active === key ? null : key)
    setOpen(false) 
  }

  const radialItems = useMemo(() => {
    const items = buttons.slice(0, MAX_RADIAL_ITEMS)
    const startDeg = -45
    const endDeg = -225
    const n = items.length

    return items.map((btn, i) => {
      const t = n === 1 ? 0 : i / (n - 1) 
      const deg = startDeg + t * (endDeg - startDeg)
      return { ...btn, deg, delay: 20 + i * 20 }
    })
  }, [buttons])

  const useBottomSheet = buttons.length > MAX_RADIAL_ITEMS

  return (
    <>
      {/* 📱 MÓVIL: Speed Dial / Bottom Sheet */}
      <div
        ref={rootRef}
        className="fixed z-[9999] block lg:hidden"
        style={{
          right: '3rem',
          bottom: 'calc(5.5rem + env(safe-area-inset-bottom))',
        }}
      >
        {/* Contenedor relativo para FAB + radial (evita desalineaciones) */}
        <div className="relative h-14 w-14">
          {/* FAB */}
          <button
            aria-label="Abrir acciones"
            aria-expanded={open}
            aria-haspopup="true"
            onClick={() => setOpen(v => !v)}
            className="absolute inset-0 rounded-full shadow-lg bg-[#1d2b44] text-white flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d2b44]"
          >
            {fabIcon ?? buttons[0]?.icon}
          </button>

          {/* Modo radial */}
          {!useBottomSheet && (
            <ul
              role="menu"
              aria-label="Acciones rápidas"
              className="pointer-events-none absolute inset-0"
            >
              {radialItems.map(({ key, icon, label, deg, delay }) => (
                <li key={key} role="none">
                  <button
                    role="menuitem"
                    title={label || key}
                    onClick={() => handleClick(key)}
                    className="pointer-events-auto absolute h-12 w-12 rounded-full bg-[#1d2b44] text-white shadow-lg flex items-center justify-center text-xl"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: open
                        ? `translate(-50%, -50%) rotate(${deg}deg) translate(${RADIUS}px) rotate(${-deg}deg) scale(1)`
                        : 'translate(-50%, -50%) scale(0)',
                      transition: `transform 200ms ease-out ${delay}ms`,
                      willChange: 'transform',
                    }}
                  >
                    {icon}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modo bottom sheet (cuando hay muchas opciones) */}
        {useBottomSheet && open && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[10000] flex items-end justify-center lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div
              className="relative w-full rounded-t-2xl bg-[#0f172a] text-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl"
            >
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20" />
              <div className="grid grid-cols-4 gap-3">
                {buttons.map(({ key, icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleClick(key)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1d2b44] p-3 text-sm transition
                      ${active === key ? 'ring-2 ring-yellow-300' : 'opacity-90 hover:opacity-100'}`}
                    title={label || key}
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="truncate max-w-[5.5rem]">{label || key}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🖥️ ESCRITORIO: barra lateral vertical */}
      <div className="hidden lg:flex z-30 w-12 bg-[#1d2b44] text-white flex-col items-center py-4 flex-shrink-0 h-full space-y-6">
        {buttons.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => onToggle(active === key ? null : key)}
            title={label || key}
            className={`text-xl transition-all ${
              active === key ? 'scale-125 text-yellow-300' : 'opacity-70 hover:opacity-100'
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </>
  )
}

export default SidebarToggleBar
