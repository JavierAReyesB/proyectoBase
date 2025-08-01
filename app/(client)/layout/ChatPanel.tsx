'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/* ---------- Tipado ---------- */
interface Message {
  id: number
  text: string
  fromMe: boolean
}

/* ---------- Mapa de rutas ---------- */
const routeMap: Record<string, string> = {
  inicio: '/inicio',
  dashboard: '/dashboard',
  trabajos: '/trabajos/ListadoTrabajos',
  deficiencias: '/trabajos/ListadoDeficienciasCliente',
  avisos: '/trabajos/ListadoAvisos',
  inventario: '/trabajos/ListadoPuntos',
  'puntos de control': '/trabajos/ListadoPuntos',
  'inventario puntos de control': '/trabajos/ListadoPuntos',
  'plan de trabajo': '/trabajos/ListadoPuntos',
  // documentación: '/documentacion',
  // documentacion: '/documentacion',
  productos: '/documentacion/ListadoProductos',
  contrato: '/contratos',
  contratos: '/contratos',
  'nuevo contrato': '/contratos/nuevo',
  estadísticas: '/estadisticas',
  estadisticas: '/estadisticas'
}

const ChatPanel: React.FC = () => {
  const router = useRouter()

  /* Estado del chat */
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text:
        '¡Hola! 👋 Soy Joseline 2.0, tu asistente virtual desde Perú la Mala. ¿En qué puedo ayudarte hoy?',
      fromMe: false
    }
  ])
  const [input, setInput] = useState('')

  /* Preparamos el regex una sola vez */
  const keywordRegex = useMemo(() => {
    const escaped = Object.keys(routeMap)
      .sort((a, b) => b.length - a.length)
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')
    return new RegExp(`(${escaped})`, 'gi')
  }, [])

  /* Enviar mensaje */
  const sendMessage = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    addMessage(trimmed, true)
    setInput('')

    setTimeout(() => {
      const response = getAutoResponse(trimmed)
      addMessage(response, false)
    }, 600)
  }

  /* Añade mensaje al estado */
  const addMessage = (text: string, fromMe: boolean) =>
    setMessages(prev => [...prev, { id: Date.now(), text, fromMe }])

  /* ---------- Respuestas automáticas ---------- */
  const getAutoResponse = (raw: string): string => {
    const txt = raw.toLowerCase()
    const hasAny = (keywords: string[]) => keywords.some(kw => txt.includes(kw))

    if (hasAny(['usuario', 'crear cuenta', 'registrar usuario']))
      return 'Para crear un usuario, ve a Configuración ➜ Usuarios y pulsa “Nuevo usuario”.'
    if (hasAny(['contraseña', 'clave', 'password', 'olvidé', 'recuperar']))
      return 'Si olvidaste tu contraseña, haz clic en “¿Olvidaste tu contraseña?” en la pantalla de inicio de sesión.'
    if (hasAny(['ticket', 'soporte', 'incidencia']))
      return 'Puedes crear un ticket en la sección Soporte pulsando “Nuevo ticket”.'
    if (
      hasAny([
        'dashboard',
        'tablero',
        'cómo accedo al dashboard',
        'cómo veo el dashboard',
        'dónde está el dashboard',
        'como entro al dashboard'
      ])
    )
      return 'El dashboard está en el menú principal, opción “Inicio ➜ Dashboard”.'
    if (hasAny(['inicio', 'página principal', 'home']))
      return 'La página principal está en “Inicio”.'
    if (
      hasAny([
        'contrato',
        'contratos',
        'gestión de contratos',
        'administrar contratos',
        'ver contratos',
        'como llego a contratos',
        'como accedo a contratos'
      ])
    )
      return 'Los contratos se gestionan en “Administración ➜ Contratos”.'
    if (hasAny(['nuevo contrato', 'crear contrato', 'agregar contrato']))
      return 'Para crear un nuevo contrato ve a “Administración ➜ Contratos ➜ Nuevo Contrato”.'
    if (
      hasAny([
        'estadistica',
        'estadísticas',
        'reportes',
        'ver reportes',
        'acceder estadísticas',
        'ver estadísticas'
      ])
    )
      return 'Las estadísticas completas están en “Reportes ➜ Estadísticas”.'
    if (
      hasAny([
        'trabajos',
        'gestión de trabajos',
        'gestionar trabajos',
        'acceder trabajos',
        'trabajo'
      ])
    )
      return 'Puedes gestionar tus trabajos en la sección “Trabajos”.'
    if (hasAny(['deficiencias', 'deficiencia']))
      return 'Para revisar Deficiencias ve a “Trabajos ➜ Deficiencias”.'
    if (hasAny(['avisos']))
      return 'Los Avisos se encuentran en “Trabajos ➜ Avisos”.'
    if (
      hasAny([
        'inventario',
        'puntos de control',
        'inventario puntos de control'
      ])
    )
      return 'El Inventario de Puntos de Control está en “Trabajos ➜ Inventario Puntos de Control”.'
    if (hasAny(['plan de trabajo', 'plan trabajo']))
      return 'Tu Plan de Trabajo está en “Trabajos ➜ Plan de Trabajo”.'
    if (hasAny(['documentacion', 'documentación', 'gestión documental']))
      return 'La gestión documental está en “Documentación”.'
    if (hasAny(['productos']))
      return 'Los Productos están en “Documentación ➜ Productos”.'
    if (hasAny(['gracias', 'muchas gracias'])) return '¡De nada! 😊'
    if (hasAny(['hola', 'buenas', 'hey', 'holi']))
      return '¡Hola! ¿En qué puedo ayudarte hoy?'

    return 'Lo siento, no entendí tu pregunta. ¿Puedes reformularla?'
  }

  /* ---------- Convierte palabras clave en links ---------- */
  const assistantTextToJSX = (text: string) => {
    const parts = text.split(keywordRegex)
    return parts.map((part, i) => {
      const key = part.toLowerCase()
      if (routeMap[key]) {
        return (
          <button
            key={i}
            onClick={() => router.push(routeMap[key])}
            className='underline text-blue-600 hover:text-blue-800'
          >
            {part}
          </button>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className='relative flex flex-col h-full max-h-[90vh]'>
      <div className='flex-1 overflow-y-auto p-4 space-y-2 pb-4'>
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm max-w-[90%] break-words ${
                m.fromMe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {m.fromMe ? m.text : assistantTextToJSX(m.text)}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`
          flex gap-2 border-t p-3 bg-white
          ${
            typeof window !== 'undefined' && window.innerWidth < 840
              ? 'fixed bottom-0 left-0 w-full'
              : 'sticky bottom-4'
          }
        `}
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Escribe tu mensaje…'
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className='flex-1'
        />
        <Button onClick={sendMessage} size='sm'>
          Enviar
        </Button>
      </div>
    </div>
  )
}

export default ChatPanel
