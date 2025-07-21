'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

/**
 * Hook personalizado para cerrar sesión del usuario.
 * Elimina las cookies relevantes y redirige al login.
 */
export function useLogout() {
  const router = useRouter()

  const logout = () => {
    // Elimina datos de sesión
    Cookies.remove('token')
    Cookies.remove('dominio')
    Cookies.remove('userId')
    Cookies.remove('semilla')

    // Redirige al login
    router.push('/login')
  }

  return logout
}
