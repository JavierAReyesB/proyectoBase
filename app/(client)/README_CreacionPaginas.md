# Guía para la Creación de una Nueva Página en el Proyecto

Esta guía describe el **proceso genérico y paso a paso** para crear una nueva página siguiendo la misma estructura utilizada en `ListadoDeficiencias`.

## 1. Estructura de Archivos


Cada página debe contener **mínimo** estos elementos:

/<NombrePagina>/
├── page.tsx # Página principal que usa el layout
├── tablePanel.tsx # Panel principal con filtros y tabla
├── tablefilters.tsx # Componente de filtros personalizados
├── columns.ts # Definición de columnas de la tabla
├── drawer/
│ ├── <Nombre>Drawer.tsx # Drawer que contiene detalle y formulario
│ ├── <Nombre>DetalleTabla.tsx # Tabla detalle de un elemento
│ ├── <Nombre>Formulario.tsx # Formulario para editar elemento
├── services/
│ ├── api.ts # Todas las llamadas API relacionadas


> 📌 Los nombres deben adaptarse a la entidad. Ejemplo: `Deficiencia` → `DeficienciaDrawer`, `DeficienciaFormulario`, etc.

---


## 2. Página Principal (`page.tsx`)


Encapsula el contenido en el `PageWrapper` y carga el `TablePanel` principal.

```tsx
'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { MiEntidadTablePanel } from './tablePanel'

export default function MiEntidadPage() {
  return (
    <PageWrapper>
      <MiEntidadTablePanel />
    </PageWrapper>
  )
}


3. Panel Principal (tablePanel.tsx)


Obtiene datos desde services/api.ts.

Renderiza los filtros (tablefilters.tsx).

Renderiza la tabla (ResponsiveTable).

Maneja la apertura del Drawer al hacer clic en una fila.

Puntos clave:

useEffect para cargar datos al montar el componente.

handleRowClick para abrir el drawer.

Uso de paginationPageSize y breakpoint para responsive.


4. Filtros (tablefilters.tsx)


Define campos para filtrar datos (selects, inputs, date pickers).

Utiliza componentes de UI reutilizables (Select, Input, Button).

Gestiona estados con useState y setXXX recibidos por props.

Incluye acciones Filtrar y Limpiar filtros.


5. Columnas (columns.ts)


Se definen como un array de objetos ColDef[].

Cada columna debe tener:

headerName: Nombre visible en tabla.

field: Propiedad del dato.

cellRenderer opcional para renderizado personalizado.

Ejemplo:

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


6. Drawer (drawer/<Nombre>Drawer.tsx)


Contiene dos partes principales:

Detalle: Muestra datos en formato tabla (<Nombre>DetalleTabla).

Formulario: Permite editar datos (<Nombre>Formulario).

Ejemplo:

export function MiEntidadDrawer({ data }: { data: MiEntidad }) {
  return (
    <div className="w-full flex flex-col gap-6">
      <MiEntidadDetalleTabla data={data} />
      <MiEntidadFormulario data={data} />
    </div>
  )
}


7. Detalle (<Nombre>DetalleTabla.tsx)


Tabla con una sola fila (rowData={[data]}).

Columnas adaptadas al detalle del elemento.

Uso de ResponsiveTable para mantener consistencia.


8. Formulario (<Nombre>Formulario.tsx)


Usa estados locales para editar campos.

Maneja cambios con un handle genérico.

onSubmit para enviar datos a la API.


9. Servicios (services/api.ts)


Centraliza todas las llamadas API relacionadas con la página:

Fetch principal (fetchMiEntidad).

Otros fetch para listas (sedes, categorías, tipos…).

Simular datos con /mock/ en desarrollo si no hay backend.

Ejemplo:

export async function fetchMiEntidad(): Promise<MiEntidad[]> {
  const res = await fetch('/mock/data.json')
  if (!res.ok) return []
  return res.json()
}


10. Flujo para Crear una Nueva Página


Crear carpeta /app/(client)/<NuevaPagina>/

Copiar la estructura de ListadoDeficiencias y renombrar archivos.

Actualizar nombres de componentes, tipos y rutas.

Definir columnas en columns.ts.

Actualizar API en services/api.ts.

Configurar filtros en tablefilters.tsx.

Probar funcionalidad de tabla y drawer.

Conectar con API real (opcional en primera fase).



11. Buenas Prácticas


Mantener consistencia en nombres.

No mezclar lógica de API en componentes.

Usar ResponsiveTable para asegurar soporte móvil.

No duplicar código: reutilizar componentes de UI.


12. Ejemplo de Nombres


Para la entidad Incidencia:

IncidenciaPage.tsx
IncidenciaTablePanel.tsx
IncidenciaTableFilters.tsx
IncidenciaDrawer.tsx
IncidenciaDetalleTabla.tsx
IncidenciaFormulario.tsx
services/api.ts
columns.ts


13. Recursos


ResponsiveTable: Componente reutilizable para tablas adaptativas.

DrawerProvider: Contexto para manejar drawers globales.

UI Components: Inputs, Selects y Botones estandarizados.

