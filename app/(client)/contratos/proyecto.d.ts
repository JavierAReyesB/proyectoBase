// types/proyecto.d.ts
export interface Proyecto {
  id: number
  nombre: string
  cliente: string
  estado: 'En curso' | 'Pendiente' | 'Finalizado'
  fechaInicio: string
  fechaFin: string
  presupuesto: number
  responsable: string
  departamento: string
  prioridad: 'Alta' | 'Media' | 'Baja'
  tecnologia: string
  observaciones: string
}
