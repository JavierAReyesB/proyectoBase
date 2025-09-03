'use client';

import {
  AnalyticsWidget,
  CalendarWidget,
  ClockWidget,
  NotesWidget,
  GalleryWidget,
  ChatWidget,
  ChartWidget,
  TeamWidget,
  ContratosWidget,
  DeficienciaWidget,
} from '.';

export type WidgetKind =
  | 'analytics'
  | 'calendar'
  | 'clock'
  | 'notes'
  | 'gallery'
  | 'chat'
  | 'chart'
  | 'team'
  | 'contratos'
  | 'deficiencias';

export function renderWidgetContent(kind: WidgetKind | string) {
  const k = (kind ?? '').toString().trim().toLowerCase();

  switch (k) {
    case 'analytics':     return <AnalyticsWidget />;
    case 'calendar':      return <CalendarWidget />;
    case 'clock':         return <ClockWidget />;
    case 'notes':         return <NotesWidget />;
    case 'gallery':       return <GalleryWidget />;
    case 'chat':          return <ChatWidget />;
    case 'chart':         return <ChartWidget />;
    case 'team':          return <TeamWidget />;
    case 'contratos':     return <ContratosWidget />;

    // acepta singular y plural
    case 'deficiencias':
    case 'deficiencia':   return <DeficienciaWidget />;

    default:
      return <div className="p-4">Widget no encontrado</div>;
  }
}
