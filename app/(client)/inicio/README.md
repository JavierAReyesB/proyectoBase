
---

## 🧱 Estructura general del diseño

- El componente principal `CuadroMandoPanel.tsx` contiene:
  - Breadcrumb y botón de ayuda
  - Filtros (Sede, Fecha desde/hasta, botones)
  - Tarjetas (`DashboardCard`) con gráficos de tipo donut
- Las tarjetas se organizan dentro de una `DashboardSection` (contenedor visual estilizado).

---

## 📐 Estilo y diseño

- El diseño sigue un enfoque **glassy**:
  - Fondo translúcido `bg-white/10` con `backdrop-blur-md`
  - Bordes `white/20`, `rounded-xl`, `shadow-md`
- Totalmente **responsive**:
  - Grid adaptable: `1 columna` en móvil, `2` en tablet, `3 o más` en escritorio
  - Se controla con utilidades de Tailwind CSS como `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Cada `DashboardCard` tiene:
  - Título con rango temporal
  - Gráfico circular dinámico (usando [Recharts](https://recharts.org/))
  - Leyenda lateral
  - Pie de tarjeta con texto informativo
  - Botón flotante (descarga u opciones futuras)

---

## 📊 Formato esperado de datos (`CardData`)

```ts
{
  id: number,
  title: string,
  range: string,
  legend: string[],
  colors: string[],
  values: number[],
  total: number
}
