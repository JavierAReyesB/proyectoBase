'use client'

import { useState } from 'react'
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLogout } from '@/hooks/useLogout'
import { Portal } from '@/components/Portal'

interface HeaderActionsProps {
  showAvatarButton?: boolean
  showNotificationButton?: boolean
  userName?: string
  userEmail?: string
  anchorClassName?: string
  isOpenExternal?: boolean
  onOpenChange?: (open: boolean) => void
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  showAvatarButton = true,
  showNotificationButton = true,
  userName = 'Juan Pérez',
  userEmail = 'juan.perez@example.com',
  anchorClassName,
  isOpenExternal,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = isOpenExternal ?? internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen

  const router = useRouter()
  const logout = useLogout()

  const userInitial = userName?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="flex items-center gap-2 min-w-fit relative">
      {/* Notificaciones */}
      {showNotificationButton && (
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>
      )}

      {/* Botón del avatar */}
      {showAvatarButton && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-black text-white font-semibold flex items-center justify-center">
            {userInitial}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {/* Menú desplegable */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9999]" onClick={() => setIsOpen(false)} />

          <Portal>
            <div
              className={`${anchorClassName ?? 'absolute right-4 top-[60px]'} w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[10000]`}
            >
              {/* Cabecera del usuario */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white font-semibold flex items-center justify-center">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Opciones */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/perfil')
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 mr-3 text-gray-500" />
                  Perfil
                </button>

                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 mr-3 text-gray-500" />
                  Configuración
                </button>
              </div>

              <div className="border-t border-gray-100 my-1" />

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-500" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </Portal>
        </>
      )}
    </div>
  )
}
