'use client'

import type React from 'react'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  ImageIcon,
  MessageSquare,
  PieChart,
  Plus,
  Settings,
  Users,
  X,
  GripVertical
} from 'lucide-react'
import { PageWrapper } from '@/app/layout/PageWrapper'
import { cn } from '@/lib/utils'

// Tipos de widgets disponibles
const WIDGET_TYPES = {
  ANALYTICS: 'analytics',
  CALENDAR: 'calendar',
  CLOCK: 'clock',
  NOTES: 'notes',
  GALLERY: 'gallery',
  CHAT: 'chat',
  CHART: 'chart',
  TEAM: 'team'
} as const

type WidgetType = (typeof WIDGET_TYPES)[keyof typeof WIDGET_TYPES]

interface Widget {
  id: string
  type: WidgetType
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

// Configuración de widgets disponibles
const AVAILABLE_WIDGETS = [
  {
    type: WIDGET_TYPES.ANALYTICS,
    title: 'Analytics',
    icon: BarChart3,
    description: 'Métricas y estadísticas',
    defaultSize: { width: 400, height: 300 }
  },
  {
    type: WIDGET_TYPES.CALENDAR,
    title: 'Calendario',
    icon: Calendar,
    description: 'Vista de calendario',
    defaultSize: { width: 350, height: 400 }
  },
  {
    type: WIDGET_TYPES.CLOCK,
    title: 'Reloj',
    icon: Clock,
    description: 'Hora actual',
    defaultSize: { width: 250, height: 200 }
  },
  {
    type: WIDGET_TYPES.NOTES,
    title: 'Notas',
    icon: FileText,
    description: 'Notas rápidas',
    defaultSize: { width: 300, height: 250 }
  },
  {
    type: WIDGET_TYPES.GALLERY,
    title: 'Galería',
    icon: ImageIcon,
    description: 'Galería de imágenes',
    defaultSize: { width: 400, height: 300 }
  },
  {
    type: WIDGET_TYPES.CHAT,
    title: 'Chat',
    icon: MessageSquare,
    description: 'Mensajes recientes',
    defaultSize: { width: 320, height: 400 }
  },
  {
    type: WIDGET_TYPES.CHART,
    title: 'Gráfico',
    icon: PieChart,
    description: 'Gráficos de datos',
    defaultSize: { width: 380, height: 280 }
  },
  {
    type: WIDGET_TYPES.TEAM,
    title: 'Equipo',
    icon: Users,
    description: 'Miembros del equipo',
    defaultSize: { width: 300, height: 300 }
  }
]

// Componentes de widgets (mismos que antes)
const AnalyticsWidget = () => (
  <div className='h-full p-4'>
    <div className='grid grid-cols-2 gap-4 h-full'>
      <div className='bg-blue-50 dark:bg-blue-950 p-3 rounded-lg'>
        <div className='text-2xl font-bold text-blue-600'>1,234</div>
        <div className='text-sm text-muted-foreground'>Visitantes</div>
      </div>
      <div className='bg-green-50 dark:bg-green-950 p-3 rounded-lg'>
        <div className='text-2xl font-bold text-green-600'>89%</div>
        <div className='text-sm text-muted-foreground'>Conversión</div>
      </div>
      <div className='bg-purple-50 dark:bg-purple-950 p-3 rounded-lg'>
        <div className='text-2xl font-bold text-purple-600'>456</div>
        <div className='text-sm text-muted-foreground'>Ventas</div>
      </div>
      <div className='bg-orange-50 dark:bg-orange-950 p-3 rounded-lg'>
        <div className='text-2xl font-bold text-orange-600'>$12.3k</div>
        <div className='text-sm text-muted-foreground'>Ingresos</div>
      </div>
    </div>
  </div>
)

const CalendarWidget = () => (
  <div className='h-full p-4'>
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h4 className='font-semibold'>Diciembre 2024</h4>
      </div>
      <div className='grid grid-cols-7 gap-1 text-xs'>
        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day) => (
          <div key={day} className='text-center font-medium p-1'>
            {day}
          </div>
        ))}
        {Array.from({ length: 31 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'text-center p-1 rounded hover:bg-accent cursor-pointer',
              i + 1 === 15 && 'bg-primary text-primary-foreground'
            )}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ClockWidget = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='h-full flex flex-col items-center justify-center p-4'>
      <div className='text-2xl font-mono font-bold'>
        {time.toLocaleTimeString()}
      </div>
      <div className='text-sm text-muted-foreground'>
        {time.toLocaleDateString()}
      </div>
    </div>
  )
}

const NotesWidget = () => (
  <div className='h-full p-4'>
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
        <span className='text-sm'>Reunión con el equipo</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-2 h-2 bg-green-400 rounded-full'></div>
        <span className='text-sm'>Revisar propuesta</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
        <span className='text-sm'>Llamar al cliente</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-2 h-2 bg-red-400 rounded-full'></div>
        <span className='text-sm'>Entregar proyecto</span>
      </div>
    </div>
  </div>
)

const GalleryWidget = () => (
  <div className='h-full p-4'>
    <div className='grid grid-cols-2 gap-2 h-full'>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className='bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg'
        ></div>
      ))}
    </div>
  </div>
)

const ChatWidget = () => (
  <div className='h-full p-4'>
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs'>
          JD
        </div>
        <div className='flex-1'>
          <div className='text-sm font-medium'>Juan Pérez</div>
          <div className='text-xs text-muted-foreground'>
            Hola, ¿cómo va el proyecto?
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs'>
          MG
        </div>
        <div className='flex-1'>
          <div className='text-sm font-medium'>María García</div>
          <div className='text-xs text-muted-foreground'>
            Perfecto, enviado!
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs'>
          AL
        </div>
        <div className='flex-1'>
          <div className='text-sm font-medium'>Ana López</div>
          <div className='text-xs text-muted-foreground'>Revisemos mañana</div>
        </div>
      </div>
    </div>
  </div>
)

const ChartWidget = () => (
  <div className='h-full p-4'>
    <div className='space-y-2'>
      <div className='flex justify-between items-center'>
        <span className='text-sm'>Ventas</span>
        <span className='text-sm font-medium'>85%</span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className='bg-blue-600 h-2 rounded-full'
          style={{ width: '85%' }}
        ></div>
      </div>
      <div className='flex justify-between items-center'>
        <span className='text-sm'>Marketing</span>
        <span className='text-sm font-medium'>72%</span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className='bg-green-600 h-2 rounded-full'
          style={{ width: '72%' }}
        ></div>
      </div>
      <div className='flex justify-between items-center'>
        <span className='text-sm'>Soporte</span>
        <span className='text-sm font-medium'>91%</span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className='bg-purple-600 h-2 rounded-full'
          style={{ width: '91%' }}
        ></div>
      </div>
    </div>
  </div>
)

const TeamWidget = () => (
  <div className='h-full p-4'>
    <div className='space-y-3'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium'>
          JD
        </div>
        <div>
          <div className='text-sm font-medium'>Juan Pérez</div>
          <div className='text-xs text-muted-foreground'>Desarrollador</div>
        </div>
        <Badge variant='secondary' className='ml-auto'>
          Online
        </Badge>
      </div>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium'>
          MG
        </div>
        <div>
          <div className='text-sm font-medium'>María García</div>
          <div className='text-xs text-muted-foreground'>Diseñadora</div>
        </div>
        <Badge variant='outline' className='ml-auto'>
          Ausente
        </Badge>
      </div>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium'>
          AL
        </div>
        <div>
          <div className='text-sm font-medium'>Ana López</div>
          <div className='text-xs text-muted-foreground'>Product Manager</div>
        </div>
        <Badge variant='secondary' className='ml-auto'>
          Online
        </Badge>
      </div>
    </div>
  </div>
)

// Función para renderizar el contenido del widget
const renderWidgetContent = (type: WidgetType) => {
  switch (type) {
    case WIDGET_TYPES.ANALYTICS:
      return <AnalyticsWidget />
    case WIDGET_TYPES.CALENDAR:
      return <CalendarWidget />
    case WIDGET_TYPES.CLOCK:
      return <ClockWidget />
    case WIDGET_TYPES.NOTES:
      return <NotesWidget />
    case WIDGET_TYPES.GALLERY:
      return <GalleryWidget />
    case WIDGET_TYPES.CHAT:
      return <ChatWidget />
    case WIDGET_TYPES.CHART:
      return <ChartWidget />
    case WIDGET_TYPES.TEAM:
      return <TeamWidget />
    default:
      return <div className='p-4'>Widget no encontrado</div>
  }
}

// Hook personalizado para drag & drop
const useDragAndDrop = () => {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, widgetId: string) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setDraggedWidget(widgetId)
    },
    []
  )

  const handleMouseUp = useCallback(() => {
    setDraggedWidget(null)
    setDragOffset({ x: 0, y: 0 })
  }, [])

  return {
    draggedWidget,
    dragOffset,
    handleMouseDown,
    handleMouseUp
  }
}

// Hook para redimensionamiento
const useResize = () => {
  const [resizingWidget, setResizingWidget] = useState<string | null>(null)

  const handleResizeStart = useCallback((widgetId: string) => {
    setResizingWidget(widgetId)
  }, [])

  const handleResizeEnd = useCallback(() => {
    setResizingWidget(null)
  }, [])

  return {
    resizingWidget,
    handleResizeStart,
    handleResizeEnd
  }
}

export default function CustomizableDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [maxZIndex, setMaxZIndex] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)

  const { draggedWidget, dragOffset, handleMouseDown, handleMouseUp } =
    useDragAndDrop()
  const { resizingWidget, handleResizeStart, handleResizeEnd } = useResize()

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboard-widgets')
    if (savedWidgets) {
      const parsedWidgets = JSON.parse(savedWidgets)
      setWidgets(parsedWidgets)
      const maxZ = Math.max(...parsedWidgets.map((w: Widget) => w.zIndex), 0)
      setMaxZIndex(maxZ + 1)
    }
  }, [])

  // Guardar configuración en localStorage
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboard-widgets', JSON.stringify(widgets))
    }
  }, [widgets])

  // Función para encontrar posición libre
  const findFreePosition = useCallback(
    (newWidget: { width: number; height: number }) => {
      if (widgets.length === 0) return { x: 20, y: 20 }

      const canvasWidth = canvasRef.current?.clientWidth || 1200
      const canvasHeight = canvasRef.current?.clientHeight || 800
      const margin = 20

      // Intentar posiciones en una grilla
      for (let y = margin; y < canvasHeight - newWidget.height; y += 50) {
        for (let x = margin; x < canvasWidth - newWidget.width; x += 50) {
          const overlaps = widgets.some(
            (widget) =>
              x < widget.position.x + widget.size.width &&
              x + newWidget.width > widget.position.x &&
              y < widget.position.y + widget.size.height &&
              y + newWidget.height > widget.position.y
          )

          if (!overlaps) {
            return { x, y }
          }
        }
      }

      // Si no encuentra espacio, colocar en cascada
      const lastWidget = widgets[widgets.length - 1]
      return {
        x: lastWidget.position.x + 30,
        y: lastWidget.position.y + 30
      }
    },
    [widgets]
  )

  // Añadir nuevo widget
  const addWidget = useCallback(
    (type: WidgetType) => {
      const widgetConfig = AVAILABLE_WIDGETS.find((w) => w.type === type)
      if (!widgetConfig) return

      const position = findFreePosition(widgetConfig.defaultSize)
      const newZIndex = maxZIndex + 1

      const newWidget: Widget = {
        id: `widget-${Date.now()}`,
        type,
        title: widgetConfig.title,
        position,
        size: widgetConfig.defaultSize,
        zIndex: newZIndex
      }

      setWidgets((prev) => [...prev, newWidget])
      setMaxZIndex(newZIndex)
    },
    [findFreePosition, maxZIndex]
  )

  // Eliminar widget
  const removeWidget = useCallback((widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId))
  }, [])

  // Mover widget al frente
  const bringToFront = useCallback(
    (widgetId: string) => {
      const newZIndex = maxZIndex + 1
      setWidgets((prev) =>
        prev.map((widget) =>
          widget.id === widgetId ? { ...widget, zIndex: newZIndex } : widget
        )
      )
      setMaxZIndex(newZIndex)
    },
    [maxZIndex]
  )

  // Manejar movimiento del mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedWidget || !canvasRef.current) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const newX = e.clientX - canvasRect.left - dragOffset.x
      const newY = e.clientY - canvasRect.top - dragOffset.y

      setWidgets((prev) =>
        prev.map((widget) =>
          widget.id === draggedWidget
            ? {
                ...widget,
                position: {
                  x: Math.max(
                    0,
                    Math.min(newX, canvasRect.width - widget.size.width)
                  ),
                  y: Math.max(
                    0,
                    Math.min(newY, canvasRect.height - widget.size.height)
                  )
                }
              }
            : widget
        )
      )
    }

    if (draggedWidget) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggedWidget, dragOffset, handleMouseUp])

  return (
    <div className='min-h-screen bg-background'>
      {/* 1️⃣  Fila principal: Sidebar + Columna de contenido */}
      <div className='flex'>
        {/* ════════════ Sidebar (columna 1) ════════════ */}
        <aside
          className={cn(
            'sticky top-14 z-30 h-[calc(100vh-3.5rem)] w-80 border-r bg-muted/40 transition-all duration-300',
            !sidebarOpen && 'w-0 overflow-hidden'
          )}
        >
          <div className='p-4'>
            <h2 className='mb-4 text-lg font-semibold'>Widgets Disponibles</h2>

            {/* Lista de botones para añadir widgets */}
            <div className='space-y-2'>
              {AVAILABLE_WIDGETS.map((widget) => {
                const Icon = widget.icon
                return (
                  <Button
                    key={widget.type}
                    variant='outline'
                    className='w-full justify-start h-auto p-3'
                    onClick={() => addWidget(widget.type)}
                  >
                    <Icon className='mr-3 h-4 w-4' />
                    <div className='text-left'>
                      <div className='font-medium'>{widget.title}</div>
                      <div className='text-xs text-muted-foreground'>
                        {widget.description}
                      </div>
                    </div>
                    <Plus className='ml-auto h-4 w-4' />
                  </Button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* ════════════ Columna 2: Header gris + contenido ════════════ */}
        <div className='flex-1 flex flex-col'>
          {/* 2️⃣  Header gris fijo (debajo del header global azul) */}
          {/* <header className='sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-14 items-center'> */}
          {/* Botón para abrir / cerrar sidebar */}
          {/* <div className='mr-4 flex'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Settings className='h-4 w-4' />
                </Button>
              </div> */}

          {/* Título + contador de widgets */}
          {/* <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
                <h1 className='text-lg font-semibold'>Mi Dashboard</h1>
                <div className='flex items-center space-x-2'>
                  <Badge variant='outline'>{widgets.length} widgets</Badge>
                </div>
              </div>
            </div>
          </header> */}

          {/* 3️⃣  Área scrolleable con PageWrapper */}
          <PageWrapper
            title='Dashboard'
            description='Panel personalizable de widgets.'
          >
            {/* --------- Si aún no hay widgets --------- */}
            {widgets.length === 0 ? (
              <div className='flex h-[60vh] items-center justify-center'>
                <div className='text-center'>
                  <div className='mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center'>
                    <Plus className='h-6 w-6' />
                  </div>
                  <h3 className='text-lg font-semibold'>No hay widgets</h3>
                  <p className='text-muted-foreground mb-4'>
                    Añade widgets desde el panel lateral para comenzar
                  </p>
                  <Button onClick={() => setSidebarOpen(true)}>
                    Abrir Panel de Widgets
                  </Button>
                </div>
              </div>
            ) : (
              /* --------- Canvas con widgets --------- */
              <div
                ref={canvasRef}
                className='relative min-h-[calc(100vh-8rem)] w-full'
                style={{ userSelect: draggedWidget ? 'none' : 'auto' }}
              >
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className={cn(
                      'absolute transition-shadow duration-200',
                      draggedWidget === widget.id && 'shadow-2xl'
                    )}
                    style={{
                      left: widget.position.x,
                      top: widget.position.y,
                      width: widget.size.width,
                      height: widget.size.height,
                      zIndex: widget.zIndex,
                      cursor:
                        draggedWidget === widget.id ? 'grabbing' : 'default'
                    }}
                    onMouseDown={() => bringToFront(widget.id)}
                  >
                    {/* Tarjeta del widget */}
                    <Card className='h-full'>
                      <CardHeader
                        className='flex flex-row items-center justify-between space-y-0 pb-2 cursor-grab active:cursor-grabbing'
                        onMouseDown={(e) => handleMouseDown(e, widget.id)}
                      >
                        <div className='flex items-center gap-2'>
                          <GripVertical className='h-4 w-4 text-muted-foreground' />
                          <CardTitle className='text-sm font-medium'>
                            {widget.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                          onClick={(e) => {
                            e.stopPropagation()
                            removeWidget(widget.id)
                          }}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </CardHeader>

                      {/* Contenido dinámico */}
                      <CardContent className='p-0 h-[calc(100%-4rem)] overflow-hidden'>
                        {renderWidgetContent(widget.type)}
                      </CardContent>
                    </Card>

                    {/* Handle de redimensionamiento */}
                    <div
                      className='absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100'
                      style={{
                        background:
                          'linear-gradient(-45deg, transparent 30%, #666 30%, #666 40%, transparent 40%, transparent 60%, #666 60%, #666 70%, transparent 70%)'
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        handleResizeStart(widget.id)

                        const startX = e.clientX
                        const startY = e.clientY
                        const startWidth = widget.size.width
                        const startHeight = widget.size.height

                        const handleMouseMove = (e: MouseEvent) => {
                          const newWidth = Math.max(
                            200,
                            startWidth + (e.clientX - startX)
                          )
                          const newHeight = Math.max(
                            150,
                            startHeight + (e.clientY - startY)
                          )
                          setWidgets((prev) =>
                            prev.map((w) =>
                              w.id === widget.id
                                ? {
                                    ...w,
                                    size: { width: newWidth, height: newHeight }
                                  }
                                : w
                            )
                          )
                        }

                        const handleMouseUp = () => {
                          handleResizeEnd()
                          document.removeEventListener(
                            'mousemove',
                            handleMouseMove
                          )
                          document.removeEventListener('mouseup', handleMouseUp)
                        }

                        document.addEventListener('mousemove', handleMouseMove)
                        document.addEventListener('mouseup', handleMouseUp)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </PageWrapper>
        </div>
        {/* ───────── Fin columna 2 ───────── */}
      </div>
      {/* ───────── Fin fila principal ───────── */}
    </div>
  )
}
