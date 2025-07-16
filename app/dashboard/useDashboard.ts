'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AVAILABLE_WIDGETS } from './availableWidgets';

export type WidgetType = (typeof AVAILABLE_WIDGETS)[number]['type'];

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export function useDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [widgetsModalOpen, setWidgetsModalOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [maxZ, setMaxZ] = useState(1);
    const [selectedWidgets, setSelectedWidgets] = useState<WidgetType[]>([]);

  

  const canvasRef = useRef<HTMLDivElement>(null);

  /* ---------- persistencia local ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-widgets');
    if (saved) {
      const parsed = JSON.parse(saved) as Widget[];
      setWidgets(parsed);
      setMaxZ(Math.max(...parsed.map((w) => w.zIndex), 0) + 1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);

   // AGREGAR AQUÍ:
  useEffect(() => {
    if (!widgetsModalOpen) setSelectedWidgets([]);
  }, [widgetsModalOpen]);

  /* ---------- helpers ---------- */
  const bringToFront = (id: string) => {
    const newZ = maxZ + 1;
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w)));
    setMaxZ(newZ);
  };

  const findFreePos = useCallback(
    (size: { width: number; height: number }) => {
      const margin = 20;
      const cw = canvasRef.current?.clientWidth ?? 1200;
      const ch = canvasRef.current?.clientHeight ?? 800;

      for (let y = margin; y < ch - size.height; y += 50) {
        for (let x = margin; x < cw - size.width; x += 50) {
          const overlaps = widgets.some(
            (w) =>
              x < w.position.x + w.size.width &&
              x + size.width > w.position.x &&
              y < w.position.y + w.size.height &&
              y + size.height > w.position.y
          );
          if (!overlaps) return { x, y };
        }
      }
      const last = widgets.at(-1)!;
      return { x: last.position.x + 30, y: last.position.y + 30 };
    },
    [widgets]
  );

  const addWidget = (type: WidgetType) => {
    const cfg = AVAILABLE_WIDGETS.find((w) => w.type === type)!;
    const pos = findFreePos(cfg.defaultSize);
    const newWidget: Widget = {
      id: `w-${Date.now()}-${Math.random()}`,
      type,
      title: cfg.title,
      position: pos,
      size: cfg.defaultSize,
      zIndex: maxZ + 1,
    };
    setWidgets((p) => [...p, newWidget]);
    setMaxZ((z) => z + 1);
  };

  const removeWidget = (id: string) => setWidgets((p) => p.filter((w) => w.id !== id));

  /* ---------- drag ---------- */
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDraggedId(id);
  };

  const handleMouseUp = () => setDraggedId(null);

  useEffect(() => {
    if (!draggedId) return;

    const move = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      setWidgets((prev) =>
        prev.map((w) =>
          w.id === draggedId
            ? {
                ...w,
                position: {
                  x: Math.max(0, Math.min(newX, rect.width - w.size.width)),
                  y: Math.max(0, Math.min(newY, rect.height - w.size.height)),
                },
              }
            : w
        )
      );
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedId, dragOffset]);

  /* ---------- resize ---------- */
  const startResize = (
    e: React.MouseEvent,
    widget: Widget
  ) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const { width, height } = widget.size;

    const move = (ev: MouseEvent) => {
      const w = Math.max(200, width + (ev.clientX - startX));
      const h = Math.max(150, height + (ev.clientY - startY));
      setWidgets((prev) =>
        prev.map((x) => (x.id === widget.id ? { ...x, size: { width: w, height: h } } : x))
      );
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  /* ---------- API pública ---------- */
  return {
    /* estado */
    widgets,
    widgetsModalOpen,
    draggedId,

    /* refs */
    canvasRef,

    /* handlers */
    setWidgetsModalOpen,
    addWidget,
    removeWidget,
    bringToFront,
    handleMouseDown,
    startResize,
    selectedWidgets,
    setSelectedWidgets,
  };
}
