'use client';

import { Plus, GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { PageWrapper } from '@/app/(client)/layout/PageWrapper';
import {
  ResizableCard,
  ResizableCardHeader,
  ResizableCardContent,
} from '@/components/ui/ResizableCard';
import { AVAILABLE_WIDGETS } from './availableWidgets';
import { useDashboard } from './useDashboard';
import { renderWidgetContent } from './widgets/renderWidgetContent';
import { cn } from '@/lib/utils';

export default function DashboardClient() {
  const dash = useDashboard(); // todo el estado y handlers

  return (
    <>
      {/* ───────── Modal de selección ───────── */}
      <Modal
        title="Widgets disponibles"
        description="Añade o quita widgets a tu dashboard"
        open={dash.widgetsModalOpen}
        onOpenChange={dash.setWidgetsModalOpen}
        size="full"
      >
        {/* ---------- Grid de selección múltiple ---------- */}
        <div
          className="mx-auto max-w-5xl grid gap-4 p-4
                  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {AVAILABLE_WIDGETS.map(({ type, icon: Icon, title, description }) => {
            const selected = dash.selectedWidgets.includes(type);
            return (
              <Button
                key={type}
                variant={selected ? 'default' : 'outline'}
                className={`w-full h-auto justify-start p-4 ${
                  selected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  if (selected) {
                    dash.setSelectedWidgets(
                      dash.selectedWidgets.filter((t) => t !== type),
                    );
                  } else {
                    dash.setSelectedWidgets([...dash.selectedWidgets, type]);
                  }
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{title}</div>
                  <div className="text-xs text-muted-foreground">
                    {description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* ---------- Botones de acción ---------- */}
        <div className="flex justify-end mt-6 gap-2">
          <Button
            variant="secondary"
            onClick={() => dash.setWidgetsModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            disabled={dash.selectedWidgets.length === 0}
            onClick={() => {
              dash.selectedWidgets.forEach((type) => dash.addWidget(type));
              dash.setWidgetsModalOpen(false);
              dash.setSelectedWidgets([]);
            }}
          >
            Agregar Widgets Seleccionados
          </Button>
        </div>
      </Modal>

      {/* ───────── Layout principal ───────── */}
      <div className="flex min-h-screen bg-background overflow-auto">
        <div className="flex-1 flex flex-col min-h-screen">
          <PageWrapper title="" description="">
            {/* Sin widgets todavía */}
            {dash.widgets.length === 0 ? (
              <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">No hay widgets</h3>
                  <p className="text-muted-foreground mb-4">
                    Añade widgets desde el panel lateral para comenzar
                  </p>
                  <Button onClick={() => dash.setWidgetsModalOpen(true)}>
                    Abrir Panel de Widgets
                  </Button>
                </div>
              </div>
            ) : (
              // ───────── Canvas con widgets ─────────
              <div
                ref={dash.canvasRef}
                className="relative w-full min-h-[1200px] overflow-auto"
                style={{ userSelect: dash.draggedId ? 'none' : 'auto' }}
              >
                {dash.widgets.map((w) => (
                  <div
                    key={w.id}
                    className={cn(
                      'absolute transition-shadow duration-200',
                      dash.draggedId === w.id && 'shadow-2xl',
                    )}
                    style={{
                      left: w.position.x,
                      top: w.position.y,
                      width: w.size.width,
                      height: w.size.height,
                      zIndex: w.zIndex,
                      cursor: dash.draggedId === w.id ? 'grabbing' : 'default',
                    }}
                    onMouseDown={() => dash.bringToFront(w.id)}
                  >
                    {/* ───── Tarjeta redimensionable ───── */}
                    {/* isolate crea un stacking context local:
                        el header (z-20) quedará SIEMPRE por encima del contenido (z-10),
                        aunque dentro del contenido haya elementos con z-index muy alto
                        (p.ej. la tabla con z-[7000]). */}
                    <ResizableCard className="h-full w-full relative isolate">
                      <ResizableCardHeader
                        className="relative z-[20] flex flex-row items-center justify-between pb-2 cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => dash.handleMouseDown(e, w.id)}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-sm font-medium">
                            {w.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            dash.removeWidget(w.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </ResizableCardHeader>

                      <ResizableCardContent className="relative z-[10]">
                        {/* Wrapper relativo para overlays internos del widget */}
                        <div className="relative h-full">
                          {renderWidgetContent(w.type)}
                        </div>
                      </ResizableCardContent>
                    </ResizableCard>

                    {/* ───── Handle de resize ───── */}
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
                      style={{
                        background:
                          'linear-gradient(-45deg,transparent 30%,#666 30%,#666 40%,transparent 40%,transparent 60%,#666 60%,#666 70%,transparent 70%)',
                      }}
                      onMouseDown={(e) => dash.startResize(e, w)}
                    />
                  </div>
                ))}
              </div>
            )}
          </PageWrapper>
        </div>
      </div>
    </>
  );
}
