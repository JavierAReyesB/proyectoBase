import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  ImageIcon,
  MessageSquare,
  PieChart,
  Users,
} from 'lucide-react';

export const AVAILABLE_WIDGETS = [
  { type: 'analytics', title: 'Analytics', icon: BarChart3, description: 'Métricas y estadísticas', defaultSize: { width: 400, height: 300 } },
  { type: 'calendar',  title: 'Calendario', icon: Calendar,  description: 'Vista de calendario',      defaultSize: { width: 350, height: 400 } },
  { type: 'clock',     title: 'Reloj',      icon: Clock,     description: 'Hora actual',             defaultSize: { width: 250, height: 200 } },
  { type: 'notes',     title: 'Notas',      icon: FileText,  description: 'Notas rápidas',           defaultSize: { width: 300, height: 250 } },
  { type: 'gallery',   title: 'Galería',    icon: ImageIcon, description: 'Galería de imágenes',     defaultSize: { width: 400, height: 300 } },
  { type: 'chat',      title: 'Chat',       icon: MessageSquare, description: 'Mensajes recientes', defaultSize: { width: 320, height: 400 } },
  { type: 'chart',     title: 'Gráfico',    icon: PieChart,  description: 'Gráficos de datos',       defaultSize: { width: 380, height: 280 } },
  { type: 'team',      title: 'Equipo',     icon: Users,     description: 'Miembros del equipo',     defaultSize: { width: 300, height: 300 } },
  {
    type: 'contratos',
    title: 'Contratos',
    icon: FileText,
    description: 'Gestión de contratos registrados',
    defaultSize: { width: 600, height: 500 }
  },
  {
  type: 'deficiencias',
  title: 'Deficiencias',
  icon: FileText,
  description: 'Gestión de deficiencias registradas',
  defaultSize: { width: 600, height: 500 }
},

] as const;
