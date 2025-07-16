'use client'

import dynamic from 'next/dynamic'

// Import dinámico del componente real
const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false
})

export default function DashboardWrapper() {
  return <DashboardClient />
}
