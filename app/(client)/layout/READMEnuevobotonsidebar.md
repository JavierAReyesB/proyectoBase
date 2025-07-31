# 🧭 Guía para agregar un nuevo botón y panel lateral en el Sidebar

Este proyecto utiliza un sistema dinámico y responsive compuesto por:

- `SidebarPanel.tsx`: Renderiza el panel lateral (modal en móvil, sidebar en escritorio).
- `SidebarToggleBar.tsx`: Botonera vertical con acceso a diferentes herramientas.
- `PageWrapper.tsx`: Layout central que controla el estado del panel activo.
- `PanelKey`: Tipo TypeScript que contiene los identificadores únicos de cada panel.

---

## ✅ Objetivo

Permitir a cualquier desarrollador del proyecto **agregar un nuevo botón** en el `SidebarToggleBar` que **abra su propio panel lateral personalizado**.

---

## 🛠️ Pasos para agregar un nuevo botón/panel

### 1. Agrega el nuevo identificador al tipo `PanelKey`

Ubica el tipo `PanelKey` (normalmente en `PageWrapper.tsx` o en un archivo de tipos compartido):

```ts
type PanelKey = 'chat' | 'settings' | 'help' | 'TU_NUEVO_PANEL'
Reemplaza TU_NUEVO_PANEL por el nombre de tu nuevo panel (por ejemplo, stats, notificaciones, formulario, etc).


### 2. Crea el componente del panel


En la carpeta components/, crea un archivo con tu nuevo panel. Ejemplo: components/StatsPanel.tsx


'use client'

import React from 'react'

const StatsPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Estadísticas</h2>
      <p className="text-muted-foreground">Aquí puedes ver datos analíticos del sistema.</p>
    </div>
  )
}

export default StatsPanel
Puedes poner cualquier contenido React válido: formularios, tablas, gráficas, tabs, etc.


### 3. Importa y registra el nuevo panel en PageWrapper.tsx


Importa el nuevo componente:


import StatsPanel from './StatsPanel' // o el componente que creaste
Luego, agrégalo a:

panels:

const panels: Record<PanelKey, React.ReactNode> = {
  chat: <ChatPanel />,
  settings: <SettingsPanel />,
  help: <HelpPanel />,
  TU_NUEVO_PANEL: <StatsPanel /> // 👈 nuevo
}

const titles: Record<PanelKey, string> = {
  chat: 'Chat',
  settings: 'Configuración',
  help: 'Centro de ayuda',
  TU_NUEVO_PANEL: 'Estadísticas' // 👈 título que aparece en el modal
}

const buttons = [
  { key: 'chat', icon: '💬', label: 'Chat' },
  { key: 'settings', icon: '⚙️', label: 'Configuración' },
  { key: 'help', icon: '❓', label: 'Ayuda' },
  { key: 'TU_NUEVO_PANEL', icon: '📊', label: 'Estadísticas' } // 👈 botón nuevo
]
Puedes usar emojis o íconos SVG según la implementación del proyecto.


### 4. Asegúrate de pasar buttons a SidebarToggleBar



<SidebarToggleBar
  active={activePanel}
  onToggle={setActivePanel}
  buttons={buttons}
/>


### 5. Verifica que SidebarToggleBar.tsx esté tipado con PanelKey
Asegúrate de que acepte el tipo correcto:


type PanelKey = 'chat' | 'settings' | 'help' | 'stats' // debe coincidir

interface ButtonConfig {
  key: PanelKey
  icon: React.ReactNode
  label?: string
}
Y que el botón active o cierre el panel:

const handleClick = (key: PanelKey) => {
  onToggle(active === key ? null : key)
}


🧪 Resultado final


El nuevo botón aparece automáticamente en escritorio (barra lateral) y en móvil (como FAB flotante).

Al hacer clic, se abre tu nuevo panel en la UI.

El sistema ya se encarga del layout, transición y cierre.

💡 Tip: Paneles comunes que puedes agregar


Panel	Propósito
filters	Filtros para tablas o dashboards
notifications	Muestra mensajes recientes
profile	Datos del usuario o edición de cuenta
form	Formulario para añadir contenido
logs	Actividad o trazas de sistema