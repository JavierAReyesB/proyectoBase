'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


/* ---------- Tipado ---------- */
interface Message {
  id: number
  text: string
  fromMe: boolean
}

/* ---------- Componente ---------- */
const ChatPanel: React.FC = () => {
  const router = useRouter()

  /* Estado del chat */
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! 👋 Soy Joseline 2.0, tu asistente virtual desde Perú la Mala. ¿En qué puedo ayudarte hoy?',
      fromMe: false
    }
  ])
  const [input, setInput] = useState('')

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
    setMessages((prev) => [...prev, { id: Date.now(), text, fromMe }])

  /* ---------- Respuestas automáticas ---------- */
  const getAutoResponse = (raw: string): string => {
    const txt = raw.toLowerCase()
    const hasAny = (keywords: string[]) =>
      keywords.some((kw) => txt.includes(kw))

    if (hasAny(['usuario', 'crear cuenta', 'registrar usuario']))
      return 'Para crear un usuario, ve a Configuración ➜ Usuarios y pulsa “Nuevo usuario”.'
    if (hasAny(['contraseña', 'clave', 'password', 'olvidé', 'recuperar']))
      return 'Si olvidaste tu contraseña, haz clic en “¿Olvidaste tu contraseña?” en la pantalla de inicio de sesión.'
    if (hasAny(['ticket', 'soporte', 'incidencia']))
      return 'Puedes crear un ticket en la sección Soporte pulsando “Nuevo ticket”.'
    if (
      hasAny([
        'dashboard',
        'inicio',
        'tablero',
        'cómo accedo al dashboard',
        'cómo veo el dashboard',
        'dónde está el dashboard',
        'como entro al dashboard'
      ])
    )
      return 'El dashboard está en el menú principal, opción “Inicio ➜ Dashboard”.'
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
      return 'Los contratos se gestionan en la sección “Administración ➜ Contratos”.'
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
    if (hasAny(['gracias', 'muchas gracias'])) return '¡De nada! 😊'
    if (hasAny(['hola', 'buenas', 'hey', 'holi']))
      return '¡Hola! ¿En qué puedo ayudarte hoy?'

    return 'Lo siento, no entendí tu pregunta. ¿Puedes reformularla?'
  }

  /* ---------- Convierte palabras clave en links ---------- */
  const assistantTextToJSX = (text: string) => {
    const map: Record<string, string> = {
      dashboard: '/dashboard',
      contratos: '/contratos',
      contrato: '/contratos',
      estadísticas: '/estadisticas',
      estadisticas: '/estadisticas'
    }

    const parts = text.split(/\b(dashboard|contratos?|estad[ií]sticas?)\b/gi)

    return parts.map((part, i) => {
      const key = part.toLowerCase()
      if (map[key]) {
        return (
          <button
            key={i}
            onClick={() => router.push(map[key])}
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
      {/* Lista de mensajes scrolleable */}
      <div className='flex-1 overflow-y-auto p-4 space-y-2 pb-4'>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm max-w-[90%] break-words ${m.fromMe ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
            >
              {m.fromMe ? m.text : assistantTextToJSX(m.text)}
            </div>
          </div>
        ))}
      </div>

      {/* Input fijo adaptado */}
      <div
        className={`
        flex gap-2 border-t p-3 bg-white
        ${typeof window !== 'undefined' && window.innerWidth < 840 ? 'fixed bottom-0 left-0 w-full' : 'sticky bottom-4'}
      `}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Escribe tu mensaje…'
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className='flex-1'
        />
        <Button
          onClick={sendMessage}
          size='sm' // o 'xs', 'default', etc.
        >
          Enviar
        </Button>

      </div>
    </div>
  )

}

export default ChatPanel
