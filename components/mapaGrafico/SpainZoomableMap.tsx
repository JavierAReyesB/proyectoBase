"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature, mesh } from "topojson-client";
import type {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "geojson";

type Level = "regions" | "provinces" | "municipalities";
type ClickBehavior = "select" | "zoom-drill"; // compat (no controla el flujo)

export type SpainMapProps = {
  dataUrl?: string | string[];
  provincesUrl?: string | string[];
  municipalitiesUrl?: string | string[];
  initialClickBehavior?: ClickBehavior; // compat
  showToolbar?: boolean;
  enableMunicipalLevel?: boolean;
  width?: number;
  height?: number;
  fillByName?: Record<string, number>;
  onRegionClick?: (name: string, f?: Feature) => void;
  showCanaryInset?: boolean;
  selectedName?: string;
  onModeChange?: (mode: ClickBehavior) => void; // compat
  /** Colores del área seleccionada (opcional) */
  selectedFill?: string;
  selectedStroke?: string;
};

export default function SpainZoomableMap({
  dataUrl = "https://unpkg.com/es-atlas/es/autonomous_regions.json",
  provincesUrl = "https://unpkg.com/es-atlas/es/provinces.json",
  municipalitiesUrl = "https://unpkg.com/es-atlas/es/municipalities.json",
  showToolbar = true,
  enableMunicipalLevel: enableMunicipalLevelProp = false,
  width: mapWidth = 975,
  height: mapHeight = 610,
  fillByName,
  onRegionClick,
  showCanaryInset = true,
  selectedName,
  selectedFill = "#f59e0b", // Amber-500
  selectedStroke = "#0f172a", // Slate-900
}: SpainMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Estado UI
  const [municipalEnabled, setMunicipalEnabled] = useState<boolean>(
    enableMunicipalLevelProp
  );
  const [uiLevel, _setUiLevel] = useState<Level>("regions");
  const uiLevelRef = useRef<Level>("regions");
  const setLevel = (lvl: Level) => {
    uiLevelRef.current = lvl;
    _setUiLevel(lvl);
  };

  /** stack[0] = CCAA actual; stack[1] = provincia actual (si hay) */
  const backStackRef = useRef<Feature[]>([]);
  const shapesRef = useRef<
    d3.Selection<SVGPathElement, Feature, SVGGElement, unknown> | null
  >(null);
  const topoCache = useRef<Map<string, any>>(new Map());

  // Props inestables en ref para no re-montar
  const onRegionClickRef = useRef(onRegionClick);
  onRegionClickRef.current = onRegionClick;

  // Exponer la acción de volver para el botón
  const goBackRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3
      .select(svgEl)
      .attr("viewBox", `0 0 ${mapWidth} ${mapHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "block")
      .style("cursor", "pointer")
      .style("user-select", "none")
      .style("touch-action", "manipulation"); // evita gestos raros en móviles

    // limpiar
    svg.selectAll("*").remove();

    // Fondo (sirve para “volver” un nivel)
    const bg = svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", mapWidth)
      .attr("height", mapHeight)
      .attr("fill", "#f8fafc");

    const gRoot = svg.append("g");
    const gMain = gRoot.append("g");
    const gInset = svg.append("g");

    // Zoom/Pan (reservamos dblclick para drill-down)
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .filter((event: any) => event.type !== "dblclick")
      .on("zoom", (event) => {
        const { transform } = event;
        gRoot.attr("transform", transform.toString());
        gRoot.attr("stroke-width", String(1 / transform.k));
      });

    svg.call(zoom as unknown as any);
    svg.on("dblclick.zoom", null); // desactiva zoom por dblclick

    // ------- utils -------
    const loadTopo = async (urls: string | string[]) => {
      const list = Array.isArray(urls) ? urls : [urls];
      for (const u of list) {
        if (topoCache.current.has(u)) return topoCache.current.get(u);
        try {
          svg.style("cursor", "progress");
          // eslint-disable-next-line no-await-in-loop
          const topo = await d3.json(u);
          if (topo) {
            topoCache.current.set(u, topo);
            svg.style("cursor", "pointer");
            return topo;
          }
        } catch {
          /* try next */
        } finally {
          svg.style("cursor", "pointer");
        }
      }
      return null;
    };

    const toFC = (
      topo: any,
      prefer?: "autonomous_regions" | "provinces" | "municipalities"
    ): { topo: any; fc: FeatureCollection; layer: any } => {
      const objects = topo.objects || {};
      const layer =
        (prefer && (objects as any)[prefer]) ||
        objects.autonomous_regions ||
        objects.provinces ||
        (objects as any).municipalities ||
        Object.values(objects)[0];

      const geo = feature(topo as any, layer as any) as
        | Feature
        | FeatureCollection<Geometry, GeoJsonProperties>;

      const fc: FeatureCollection =
        (geo as FeatureCollection).features
          ? (geo as FeatureCollection)
          : ({
              type: "FeatureCollection",
              features: [geo as Feature],
            } as FeatureCollection);

      return { topo, fc, layer };
    };

    // Filtrado optimizado: intenta por propiedad, si falla usa geografía (caro)
    const filterChildrenInside = (parent: Feature, children: Feature[]) => {
      const pName = (parent.properties?.name as string) || "";
      const propKeys = [
        "province",
        "province_name",
        "provincia",
        "parent",
        "region",
        "ccaa",
        "autonomous_region",
      ];
      for (const key of propKeys) {
        const matches = children.filter((ch) => {
          const v = (ch.properties as any)?.[key];
          return v && String(v).toLowerCase() === pName.toLowerCase();
        });
        if (matches.length) return matches;
      }
      const parentGeom = parent as any;
      return children.filter((ch) =>
        d3.geoContains(parentGeom, d3.geoCentroid(ch as any) as [number, number])
      );
    };

    function resetZoom() {
      (svg.transition() as any).duration(500).call(
        (d3.zoom() as any).transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node() as Element).invert([mapWidth / 2, mapHeight / 2])
      );
    }

    // --------- DRAW (recibe el topo original para mesh) ---------
    const draw = (
      topo: any,
      fc: FeatureCollection,
      layer: any,
      level: Level
    ) => {
      gMain.selectAll("*").remove();
      gInset.selectAll("*").remove();

      const projection = d3.geoConicConformal();
      // Ajustamos la proyección al conjunto visible actual (acompaña el drill)
      projection.fitSize([mapWidth, mapHeight], fc);
      const path = d3.geoPath(projection);

      // Bandera para cancelar el click si hubo dblclick (sin meter latencia)
      let dblFlag = false;
      let dblResetTimer: number | null = null;

      const handleSingleClick = (event: any, d: Feature) => {
        if (dblFlag) return; // si fue dblclick, ignora single
        const name = (d.properties?.name as string) ?? "";
        onRegionClickRef.current?.(name, d);

        // mini-highlight
        shapesRef.current?.attr("opacity", 1);
        d3.select<SVGPathElement, Feature>(event.currentTarget)
          .interrupt()
          .attr("opacity", 0.9);
      };

      const handleDoubleClick = async (event: any, d: Feature) => {
        // marca ventana breve para anular single
        dblFlag = true;
        if (dblResetTimer) window.clearTimeout(dblResetTimer);
        dblResetTimer = window.setTimeout(() => {
          dblFlag = false;
          dblResetTimer = null;
        }, 200);

        // Evita bubbling a fondo
        event.stopPropagation();
        event.preventDefault();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }

        // Drill según nivel actual
        if (level === "regions") {
          const topoProv = await loadTopo(provincesUrl!);
          if (!topoProv) return;
          const { topo: tProv, fc: fcProv, layer: layerProv } = toFC(
            topoProv,
            "provinces"
          );
          const inside = filterChildrenInside(d, fcProv.features as Feature[]);
          setLevel("provinces");
          backStackRef.current = [d];
          draw(
            tProv,
            { type: "FeatureCollection", features: inside } as FeatureCollection,
            layerProv,
            "provinces"
          );
          return;
        }

        if (level === "provinces" && municipalEnabled) {
          const topoMun = await loadTopo(municipalitiesUrl!);
          if (!topoMun) return;
          const { topo: tMun, fc: fcMun, layer: layerMun } = toFC(
            topoMun,
            "municipalities"
          );
          const inside = filterChildrenInside(d, fcMun.features as Feature[]);
          setLevel("municipalities");
          const region = backStackRef.current[0] ?? null;
          backStackRef.current = region ? [region, d] : [d];
          draw(
            tMun,
            { type: "FeatureCollection", features: inside } as FeatureCollection,
            layerMun,
            "municipalities"
          );
          return;
        }
      };

      const shapes = gMain
        .append("g")
        .attr("fill", "#444")
        .attr("cursor", "pointer")
        .selectAll<SVGPathElement, Feature>("path")
        .data(fc.features)
        .join("path")
        .attr("d", path as any)
        .attr("data-name", (d: any) => d.properties?.name ?? "")
        // El color final lo controla el efecto reactivo de más abajo
        .style("fill", "#444")
        .on("click", function (event: any, d: Feature) {
          event.stopPropagation();
          handleSingleClick(event, d); // inmediato, sin timeout
        })
        .on("dblclick", function (event: any, d: Feature) {
          handleDoubleClick(event, d);
        });

      shapes.append("title").text((d: any) => d.properties?.name ?? "");
      shapesRef.current = shapes;

      // Bordes
      const borders = d3
        .geoPath(projection)(
          mesh(topo as any, layer as any, (a: any, b: any) => a !== b) as any
        ) as string | null;

      if (borders) {
        gMain
          .append("path")
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-linejoin", "round")
          .attr("d", borders);
      }

      // Inset Canarias (solo en niveles no municipales)
      if (showCanaryInset && level !== "municipalities") {
        const isCanary = (f: Feature) => {
          const n = (f.properties?.name as string) ?? "";
          return (
            n === "Canarias" ||
            n.includes("Las Palmas") ||
            n.includes("Santa Cruz")
          );
        };
        const canary = fc.features.filter(isCanary);
        if (canary.length) {
          const insetW = 160;
          const insetH = 120;
          const insetPadding = 10;
          const insetX = mapWidth - insetW - 12;
          const insetY = mapHeight - insetH - 12;

          const insetBg = gInset
            .append("g")
            .attr("transform", `translate(${insetX},${insetY})`);

          insetBg
            .append("rect")
            .attr("width", insetW)
            .attr("height", insetH)
            .attr("fill", "white")
            .attr("stroke", "#334155")
            .attr("stroke-dasharray", "4 4")
            .attr("rx", 6);

          const projCanary = d3.geoMercator();
          projCanary.fitExtent(
            [
              [insetPadding, insetPadding],
              [insetW - insetPadding, insetH - insetPadding],
            ],
            { type: "FeatureCollection", features: canary } as FeatureCollection
          );

          const pathC = d3.geoPath(projCanary);
          let insetDblFlag = false;
          let insetTimer: number | null = null;

          insetBg
            .append("g")
            .attr("fill", "#444")
            .attr("cursor", "pointer")
            .selectAll<SVGPathElement, Feature>("path")
            .data(canary)
            .join("path")
            .attr("d", pathC as any)
            .attr("data-name", (d: any) => d.properties?.name ?? "")
            .on("click", (event: any, d: Feature) => {
              if (insetDblFlag) return;
              const name = (d.properties?.name as string) ?? "";
              onRegionClickRef.current?.(name, d);
              event.stopPropagation();
              event.preventDefault();
              if (typeof (event as any).stopImmediatePropagation === "function") {
                (event as any).stopImmediatePropagation();
              }
            })
            .on("dblclick", async (event: any, d: Feature) => {
              insetDblFlag = true;
              if (insetTimer) window.clearTimeout(insetTimer);
              insetTimer = window.setTimeout(() => {
                insetDblFlag = false;
                insetTimer = null;
              }, 200);

              if (uiLevelRef.current === "regions") {
                const topoProv = await loadTopo(provincesUrl!);
                if (!topoProv) return;
                const { topo: tProv, fc: fcProv, layer: layerProv } = toFC(
                  topoProv,
                  "provinces"
                );
                const inside = filterChildrenInside(
                  d,
                  fcProv.features as Feature[]
                );
                setLevel("provinces");
                backStackRef.current = [d];
                draw(
                  tProv,
                  {
                    type: "FeatureCollection",
                    features: inside,
                  } as FeatureCollection,
                  layerProv,
                  "provinces"
                );
              }
              event.stopPropagation();
              event.preventDefault();
              if (typeof (event as any).stopImmediatePropagation === "function") {
                (event as any).stopImmediatePropagation();
              }
            });

          insetBg
            .append("text")
            .attr("x", insetPadding)
            .attr("y", 14)
            .attr("fill", "#334155")
            .style("font", "12px sans-serif")
            .text("Canarias");
        }
      }

      // --- Acción de volver (fondo y botón usan esto) ---
      const goBack = async () => {
        const levelNow = uiLevelRef.current;

        if (levelNow === "municipalities") {
          const region = backStackRef.current[0];
          if (!region) return;
          const topoProv = await loadTopo(provincesUrl!);
          if (!topoProv) return;
          const { topo: tProv, fc: fcProv, layer: layerProv } = toFC(
            topoProv,
            "provinces"
          );
          const inside = filterChildrenInside(region, fcProv.features as Feature[]);
          setLevel("provinces");
          backStackRef.current = [region];
          draw(
            tProv,
            { type: "FeatureCollection", features: inside } as FeatureCollection,
            layerProv,
            "provinces"
          );
          return;
        }

        if (levelNow === "provinces") {
          const topoReg = await loadTopo(dataUrl!);
          if (!topoReg) return;
          const { topo: tReg, fc, layer } = toFC(topoReg, "autonomous_regions");
          setLevel("regions");
          backStackRef.current = [];
          draw(tReg, fc, layer, "regions");
          return;
        }

        // en regiones: reset solo de zoom/pan (no cambia nivel)
        resetZoom();
      };

      // guardar referencia para el botón y enganchar fondo
      goBackRef.current = goBack;
      bg.on("click", goBack as any);
    };

    // --------- inicio ---------- (dibuja regiones)
    (async () => {
      const topo = await loadTopo(dataUrl);
      if (!topo) return;
      const { topo: tReg, fc, layer } = toFC(topo, "autonomous_regions");
      setLevel("regions");
      backStackRef.current = [];
      draw(tReg, fc, layer, "regions");
    })();

    return () => {
      d3.select(svgRef.current).on(".zoom", null);
      goBackRef.current = null;
    };
  }, [
    dataUrl,
    provincesUrl,
    municipalitiesUrl,
    mapWidth,
    mapHeight,
    showCanaryInset,
    municipalEnabled, // si cambias el toggle, se vuelve a montar (intencional)
  ]);

  // Relleno + borde reactivo para seleccionado y heatmap
  useEffect(() => {
    const shapes = shapesRef.current;
    if (!shapes) return;

    // Recalcular escala para fillByName en cada cambio relevante
    let scale: d3.ScaleSequential<string> | null = null;
    if (fillByName && Object.keys(fillByName).length) {
      const values = Object.values(fillByName);
      const [min, max] = d3.extent(values) as [number, number];
      scale = d3.scaleSequential(d3.interpolateBlues).domain([min, max]);
    }

    // 1) Relleno: si está seleccionado, manda selectedFill.
    shapes.style("fill", (d: any) => {
      const isSelected = selectedName && d.properties?.name === selectedName;
      if (isSelected) return selectedFill;
      if (!scale || !fillByName) return "#444";
      const v = fillByName[d.properties?.name as string];
      return v == null ? "#444" : scale(v);
    });

    // 2) Borde: aplica selectedStroke al seleccionado, quita al resto.
    shapes
      .attr("stroke", (d: any) =>
        selectedName && d.properties?.name === selectedName ? selectedStroke : null
      )
      .attr("stroke-width", (d: any) =>
        selectedName && d.properties?.name === selectedName ? 2 : null
      );

    // 3) Asegura que el seleccionado quede encima
    if (selectedName) {
      shapes.filter((d: any) => d.properties?.name === selectedName).raise();
    }
  }, [selectedName, selectedFill, selectedStroke, fillByName]);

  // Toolbar interna (opcional)
  const Toolbar = () =>
    !showToolbar ? null : (
      <div className="absolute right-2 top-2 z-10 flex items-center gap-3 rounded bg-white/90 border shadow px-3 py-2">
        <div className="text-xs text-slate-700">
          <div>
            <strong>Clic</strong> = ver datos
          </div>
          <div>
            <strong>Doble clic</strong> = profundizar
          </div>
          <div>
            <strong>Fondo</strong> o <strong>Volver</strong> = subir nivel
          </div>
        </div>
        <div className="flex items-center gap-1">
          <input
            id="muni-toggle"
            type="checkbox"
            className="h-3 w-3"
            checked={municipalEnabled}
            onChange={(e) => setMunicipalEnabled(e.target.checked)}
            title="Permitir nivel de municipios (doble clic en provincia)"
          />
          <label htmlFor="muni-toggle" className="text-xs text-slate-700">
            Municipios
          </label>
        </div>
      </div>
    );

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: `${mapWidth} / ${mapHeight}` }}
    >
      {/* Botón Volver */}
      <button
        type="button"
        onClick={() => goBackRef.current?.()}
        disabled={uiLevel === "regions"}
        className={`absolute left-2 top-2 z-10 rounded border px-2 py-1 text-xs ${
          uiLevel === "regions"
            ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed"
            : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
        }`}
        title={
          uiLevel === "regions"
            ? "Ya estás en el nivel superior"
            : "Volver al nivel anterior"
        }
      >
        Volver
      </button>

      <Toolbar />
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
