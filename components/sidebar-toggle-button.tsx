"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function SidebarToggleButton() {
  const { open, toggleSidebar, isMobile } = useSidebar()

  // No mostrar el botón en dispositivos móviles, ya que el sidebar móvil es offcanvas
  if (isMobile) {
    return null
  }

  // El tamaño del botón es size-8, que es 2rem o 32px.
  // Para que la mitad del botón quede fuera del borde, lo movemos -16px.
  const BUTTON_OFFSET_PX = 16 // La mitad del tamaño del botón (32px / 2)

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute top-1/2 -translate-y-1/2 rounded-full z-30 transition-all duration-300 ease-in-out bg-background border-border shadow-md"
      // Posicionamos el botón en el borde derecho del sidebar.
      // 'right: -16px' lo saca 16px del borde derecho de su contenedor.
      style={{ right: `-${BUTTON_OFFSET_PX}px` }}
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar"
    >
      {open ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
    </Button>
  )
}
