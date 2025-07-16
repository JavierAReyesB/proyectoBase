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
  | 'contratos';

export function renderWidgetContent(kind: WidgetKind) {
  switch (kind) {
    case 'analytics':  return <AnalyticsWidget />
     case 'calendar':   return <CalendarWidget />
     case 'clock':      return <ClockWidget />
     case 'notes':      return <NotesWidget />
     case 'gallery':    return <GalleryWidget />
     case 'chat':       return <ChatWidget />
     case 'chart':      return <ChartWidget />
     case 'team':       return <TeamWidget />
     case 'contratos':  return <ContratosWidget />
     
    default:
      return <div className="p-4">Widget no encontrado</div>;
  }
}
