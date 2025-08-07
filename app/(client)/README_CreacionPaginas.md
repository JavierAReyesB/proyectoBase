# 🧩 Guía para la Creación de una Nueva Página en el Proyecto

Esta guía describe el proceso paso a paso para crear una nueva página **modular, responsive y reutilizable**, siguiendo el patrón de `ListadoDeficienciasCliente`.

Está pensada para cualquier programador que se incorpore al equipo y necesite crear rápidamente una nueva sección sin romper consistencia ni romper la arquitectura base.

---

## 📁 Estructura General

Cada nueva página debe contener al menos los siguientes archivos:

/<NuevaEntidad>/
├── page.tsx # Entrada principal
├── tablePanel.tsx # Lógica principal de la tabla + filtros + drawer
├── tablefilters.tsx # Vista lateral con filtros visuales
├── columns.ts # Definición de columnas AG Grid
├── drawer/
│ ├── <Entidad>Drawer.tsx # Agrupa el detalle + formulario
│ ├── <Entidad>DetalleTabla.tsx # Tabla de 1 fila con datos del drawer
│ └── <Entidad>Formulario.tsx # Formulario editable
├── hooks/
│ └── useFiltroTabla.ts # Hook para aplicar filtros a los datos
├── services/
│ └── api.ts # Simulación o llamadas API reales
├── Filtros<Entidad>Context.tsx # Contexto global de filtros
├── <Entidad>TableFiltersWrapper.tsx # Inyección lógica de filtros


> 📌 Los nombres de archivo deben adaptarse a la entidad: `Deficiencia`, `Aviso`, `Contrato`, etc.

---

## 1. `page.tsx` – Página principal

```tsx
'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { FiltrosMiEntidadProvider } from './FiltrosMiEntidadContext'
import { FiltersPanelProvider } from '@/app/(client)/layout/FiltersPanelContext'
import { MiEntidadTableFiltersWrapper } from './MiEntidadTableFiltersWrapper'
import { MiEntidadTablePanel } from './tablePanel'

export default function MiEntidadPage() {
  return (
    <FiltrosMiEntidadProvider>
      <FiltersPanelProvider filtersComponent={<MiEntidadTableFiltersWrapper />}>
        <PageWrapper>
          <MiEntidadTablePanel />
        </PageWrapper>
      </FiltersPanelProvider>
    </FiltrosMiEntidadProvider>
  )
}
✔️ Por qué:
FiltrosProvider: encapsula los filtros en contexto global.

FiltersPanelProvider: permite inyectar el sidebar de filtros reutilizable.

PageWrapper: asegura consistencia visual y layout común.

2. tablePanel.tsx – Lógica de la tabla
Contiene:

Carga de datos con useEffect.

Aplicación de filtros con useFiltroTabla.

Render de ResponsiveTable.

Lógica para abrir Drawer al hacer click en una fila.

✔️ Claves importantes:
mobileCardProps define orden y visibilidad de campos en móvil.

Usa TableContext para referencias de tamaño.

paginationPageSize y breakpoint aseguran experiencia responsive.

3. tablefilters.tsx – Componente de filtros visuales
Contiene:

Selects (sede, tipo, categoría)

Input de búsqueda

Pickers de fecha

Badges de estado y criticidad

Botones para aplicar y limpiar filtros

Este componente no maneja lógica de datos, solo presentación y eventos.

4. Filtros<Entidad>Context.tsx – Contexto de filtros

Centraliza los filtros aplicados para que puedan ser utilizados por:

La tabla

El drawer

Widgets futuros (Dashboard)

También puedes agregar aquí showRecords o paginación global si lo deseas.

5. useFiltroTabla.ts – Hook para aplicar filtros

Este hook permite reutilizar lógica con claves configurables como:

sedeKey, tipoKey, categoriaKey

searchKeys para filtrar por múltiples campos

Ventaja: se desacopla la lógica de filtrado del componente de tabla.

6. columns.ts – Definición de columnas AG Grid

export const jobTableColumns: ColDef[] = [
  { headerName: 'Fecha', field: 'fecha' },
  {
    headerName: 'Operario',
    field: 'operario',
    cellRenderer: ({ value }) => (
      <span className="text-blue-600 underline cursor-pointer">{value}</span>
    ),
  },
]
Recomendaciones:

Siempre usar cellRenderer para estilos o íconos.

Usar truncado (max-w) en campos largos como observaciones.

7. drawer/<Entidad>Drawer.tsx – Componente principal del Drawer
Agrupa los subcomponentes del drawer:

Detalle en formato tabla (<Entidad>DetalleTabla)

Formulario editable (<Entidad>Formulario)

Permite mantener independencia visual y lógica.

8. drawer/<Entidad>DetalleTabla.tsx
Renderiza los detalles del registro como una fila de tabla usando ResponsiveTable.

<ResponsiveTable
  columnDefs={columnDefs}
  rowData={[data]}
  pagination={false}
/>

9. drawer/<Entidad>Formulario.tsx

Formulario editable con campos controlados por useState.

const [form, setForm] = useState({ campo1: data.campo1, ... })

const handle = (campo: keyof Form) => (e) =>
  setForm({ ...form, [campo]: e.target.value })

10. services/api.ts – API y mocks
Debe contener:

Interfaces (Entidad, TipoServicio, etc.)

Funciones para simular o hacer fetch real

export async function fetchMiEntidad(): Promise<MiEntidad[]> {
  const res = await fetch('/mock/data.json')
  if (!res.ok) return []
  return res.json()
}

11. <Entidad>TableFiltersWrapper.tsx
Este archivo:

Llama a fetchMiEntidad para obtener sedes, tipos, categorías, etc.

Convierte esos datos en props para tablefilters.tsx.

✔️ Por qué:
Permite separar la lógica de datos de la vista.

12. Drawers: integración

Usamos DrawerProvider y useDrawerContext:

openDrawer({
  id: 'drawer-id',
  title: 'Título',
  width: 'half',
  isPinned: false,
  content: <MiEntidadDrawer data={data} />
})
Los drawers pueden:

Abrirse desde cualquier componente

Mantener múltiples instancias

Actualizarse dinámicamente si ya están abiertos

13. ResponsiveTable: claves para vista móvil

mobileCardProps={{
  titleField: 'sede',
  collapsedFields: ['estado'],
  expandedFieldOrder: ['fecha', 'resultado', 'operario']
}}
Estas props son necesarias para que el diseño en móvil sea legible y personalizado.

14. Flujo resumido para crear nueva página

Crear carpeta: /app/(client)/MiEntidad/

Copiar archivos desde ListadoDeficienciasCliente

Renombrar archivos y tipos (Deficiencia → MiEntidad)

Definir columnas en columns.ts

Crear lógica en api.ts

Configurar filtros en tablefilters.tsx

Testear tabla y drawer (desktop y móvil)

Conectar con API real si es necesario

15. Buenas prácticas

✅ Nombres consistentes
✅ No mezclar lógica en componentes visuales
✅ Separar lógica de filtros del componente visual
✅ Reutilizar UI estándar (botones, selects, inputs)
✅ Reutilizar ResponsiveTable para mantener consistencia
✅ Encapsular filtros en contextos propios por entidad
✅ Simular datos usando /mock/ si no hay backend

16. Ejemplo de nombres por entidad Incidencia

IncidenciaPage.tsx
IncidenciaTablePanel.tsx
IncidenciaDrawer.tsx
IncidenciaDetalleTabla.tsx
IncidenciaFormulario.tsx
FiltrosIncidenciaContext.tsx
IncidenciaTableFiltersWrapper.tsx
services/api.ts
columns.ts

17. Recursos útiles

ResponsiveTable → Tabla AG Grid + cards móviles

DrawerProvider → Control de drawers global

FiltersPanelProvider → Sidebar lateral de filtros

TableContext → Referencias para ajuste dinámico

PageWrapper → Estructura común de página

