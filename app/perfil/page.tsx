'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import PerfilPanel from '@/app/perfil/PerfilPanel'

export default function PerfilPage() {
  return (
    <PageWrapper
      title="Perfil"
      description="Datos personales y configuración del usuario."
    >
      <PerfilPanel />
    </PageWrapper>
  )
}
