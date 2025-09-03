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

// NAMESPACE nuevo para evitar pisadas
const STORAGE_KEY = 'avanzadi/dashboard-widgets.v1';

export function useDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [widgetsModalOpen, setWidgetsModalOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [maxZ, setMaxZ] = useState(1);
  const [selectedWidgets, setSelectedWidgets] = useState<WidgetType[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // flags/refs
  const loadedRef = useRef(false);                 // ya intentamos cargar
  const lastSavedRef = useRef<string | null>(null); // última string guardada

  /* ---------- Migración desde claves viejas (una vez) ---------- */
  useEffect(() => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (!current) {
        const legacyV1 = localStorage.getItem('dashboard-widgets.v1');
        const legacyV0 = localStorage.getItem('dashboard-widgets');
        const legacy = legacyV1 ?? legacyV0;
        if (legacy) {
          // Copiamos a la clave nueva...
          localStorage.setItem(STORAGE_KEY, legacy);
          // ...y eliminamos las legacy para que no se vuelvan a re-migrar.
          localStorage.removeItem('dashboard-widgets.v1');
          localStorage.removeItem('dashboard-widgets');
        }
      }
    } catch {}
  }, []);

  /* ---------- CARGA ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // Si alguien guardó explícitamente '[]', tratamos como vacío
        if (raw === '[]') {
          setWidgets([]);
          lastSavedRef.current = '[]';
        } else {
          const parsed = JSON.parse(raw) as Widget[];
          if (Array.isArray(parsed)) {
            setWidgets(parsed);
            const max = Math.max(0, ...parsed.map((w) => w.zIndex));
            setMaxZ(max + 1);
            lastSavedRef.current = raw; // evita re-guardar igual
          }
        }
      }
    } catch (e) {
      console.warn('[dashboard] error leyendo localStorage', e);
    } finally {
      loadedRef.current = true;
    }
  }, []);

  /* ---------- GUARDA con soporte de borrado intencional ---------- */
  useEffect(() => {
    if (!loadedRef.current) return;

    try {
      // Caso 1: el usuario dejó el dashboard vacío => limpieza total
      if (widgets.length === 0) {
        // Borramos la clave principal y también las legacy, para evitar “revivals”
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('dashboard-widgets.v1');
        localStorage.removeItem('dashboard-widgets');

        // Recordamos que lo último guardado es vacío
        lastSavedRef.current = '[]';
        return;
      }

      // Caso 2: hay widgets => persistimos normalmente si cambió
      const next = JSON.stringify(widgets);
      if (next === lastSavedRef.current) return;

      localStorage.setItem(STORAGE_KEY, next);
      lastSavedRef.current = next;
    } catch (e) {
      console.warn('[dashboard] error guardando localStorage', e);
    }
  }, [widgets]);

  /* ---------- Sincroniza si otra pestaña/código toca la clave ---------- */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;

      // Si otra pestaña eliminó la clave o escribió '[]', reflejamos vacío
      if (e.newValue == null || e.newValue === '[]') {
        if (lastSavedRef.current !== '[]' || widgets.length !== 0) {
          setWidgets([]);
          lastSavedRef.current = '[]';
          setMaxZ(1);
        }
        return;
      }

      // Si el valor es exactamente el que ya tenemos, ignoramos
      if (e.newValue === lastSavedRef.current) return;

      try {
        const parsed = JSON.parse(e.newValue) as Widget[];
        if (Array.isArray(parsed)) {
          setWidgets(parsed);
          const max = Math.max(0, ...parsed.map((w) => w.zIndex));
          setMaxZ(max + 1);
          lastSavedRef.current = e.newValue;
        }
      } catch {}
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [widgets.length]);

  // Vacía selección al cerrar el modal (no toca widgets)
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
      const last = widgets.at(-1);
      if (last) return { x: last.position.x + 30, y: last.position.y + 30 };
      return { x: margin, y: margin };
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

  const removeWidget = (id: string) =>
    setWidgets((p) => p.filter((w) => w.id !== id));

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
  const startResize = (e: React.MouseEvent, widget: Widget) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const { width, height } = widget.size;

    const move = (ev: MouseEvent) => {
      const w = Math.max(200, width + (ev.clientX - startX));
      const h = Math.max(150, height + (ev.clientY - startY));
      setWidgets((prev) =>
        prev.map((x) =>
          x.id === widget.id ? { ...x, size: { width: w, height: h } } : x
        )
      );
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  /* ---------- (Opcional) Reset explícito ---------- */
  const resetDashboard = useCallback(() => {
    setWidgets([]); // disparará el efecto que limpia localStorage y legacies
  }, []);

  /* ---------- API pública ---------- */
  return {
    widgets,
    widgetsModalOpen,
    draggedId,
    canvasRef,
    setWidgetsModalOpen,
    addWidget,
    removeWidget,
    bringToFront,
    handleMouseDown,
    startResize,
    selectedWidgets,
    setSelectedWidgets,
    resetDashboard, // opcional
  };
}
