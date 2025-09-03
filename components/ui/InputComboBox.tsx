"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input as BaseInput } from "./input"; // ajusta ruta si hace falta

// Utilidad: normaliza acentos y minúsculas
function norm(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

// Helper por defecto: "L_CONDUCTA" -> "L Conducta"
function toTitle(s: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export type ComboOption = {
  value: string;
  label: string;
  sublabel?: string;
  keywords?: string;
  disabled?: boolean;
};

// Props genéricas para crudos T
export interface ComboInputProps<T = unknown>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onValueChange: (v: string) => void;

  /** Retrocompatible: acepta ComboOption[] o string[] */
  options?: ReadonlyArray<ComboOption | string>;

  /** NUEVO A: acepta objetos crudos + selectores-función (type-safe) */
  rawOptions?: ReadonlyArray<T>;
  getOptionValue?: (item: T) => string;     // requerido si usas rawOptions
  getOptionLabel?: (item: T) => string;     // requerido si usas rawOptions
  getOptionKeywords?: (item: T) => string;  // opcional

  /** NUEVO B: acepta objetos crudos + selectores por clave (DX simple) */
  valueKey?: string;     // ej. "id"
  labelKey?: string;     // ej. "nombre"
  keywordsKey?: string;  // ej. "codigo" (opcional)

  fetchOptions?: (query: string) => Promise<ComboOption[]>;
  onOptionSelect?: (opt: ComboOption) => void;
  freeSolo?: boolean;
  debounceMs?: number;
  maxVisible?: number;
  notFoundText?: string;
  loadingText?: string;
  minChars?: number;
  thresholdText?: string;
  className?: string;
  listClassName?: string;

  /** Derivadores cuando options sea string[] */
  deriveLabel?: (raw: string) => string;     // default: toTitle
  deriveKeywords?: (raw: string) => string;  // default: raw
}

export function ComboInput<T = unknown>({
  value,
  onValueChange,
  options = [],
  rawOptions,
  getOptionValue,
  getOptionLabel,
  getOptionKeywords,
  valueKey,
  labelKey,
  keywordsKey,
  fetchOptions,
  onOptionSelect,
  freeSolo = true,
  debounceMs = 200,
  maxVisible = 200,
  notFoundText = "Sin resultados",
  loadingText = "Buscando…",
  minChars = 3,
  thresholdText,
  className,
  listClassName,
  placeholder,
  disabled,
  deriveLabel,
  deriveKeywords,
  ...rest
}: ComboInputProps<T>) {
  const idList = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState<number>(-1);
  const [loading, setLoading] = React.useState(false);
  const [asyncOptions, setAsyncOptions] = React.useState<ComboOption[] | null>(null);

  // Normalización unificada:
  // 1) rawOptions + key selectors
  // 2) rawOptions + function selectors
  // 3) options (ComboOption[] | string[])
  const normalizedOptions = React.useMemo<ComboOption[]>(() => {
    // 1) Key selectors (DX simple)
    if (rawOptions && valueKey && labelKey) {
      return (rawOptions as ReadonlyArray<Record<string, unknown>>).map((item) => ({
        value: String(item?.[valueKey] ?? ""),
        label: String(item?.[labelKey] ?? ""),
        keywords: keywordsKey ? String(item?.[keywordsKey] ?? "") : undefined,
      }));
    }

    // 2) Function selectors (type-safe)
    if (rawOptions && getOptionValue && getOptionLabel) {
      return rawOptions.map((item) => ({
        value: getOptionValue(item),
        label: getOptionLabel(item),
        keywords: getOptionKeywords?.(item),
      }));
    }

    // 3) options
    const arr = options ?? [];
    return arr.map((o) => {
      if (typeof o === "string") {
        const label = deriveLabel ? deriveLabel(o) : toTitle(o);
        const keywords = deriveKeywords ? deriveKeywords(o) : o;
        return { value: o, label, keywords };
      }
      return o; // ya es ComboOption
    });
  }, [
    rawOptions,
    valueKey, labelKey, keywordsKey,
    getOptionValue, getOptionLabel, getOptionKeywords,
    options, deriveLabel, deriveKeywords,
  ]);

  // Debounce del texto
  const [q, setQ] = React.useState(value);
  React.useEffect(() => setQ(value), [value]);

  // Consultas remotas con minChars
  React.useEffect(() => {
    if (!fetchOptions) return;
    const handle = setTimeout(async () => {
      const query = q.trim();
      if (query.length < minChars) {
        setAsyncOptions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const out = await fetchOptions(query);
        setAsyncOptions(out);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(handle);
  }, [q, fetchOptions, debounceMs, minChars]);

  const meetsMin = norm(q).length >= minChars;

  // Lista final
  const list = React.useMemo(() => {
    if (!meetsMin) return [] as ComboOption[];
    const src = fetchOptions ? asyncOptions ?? [] : normalizedOptions;
    if (!fetchOptions) {
      const nq = norm(q);
      return src
        .filter((o) => {
          const haystack = `${o.label} ${o.sublabel ?? ""} ${o.keywords ?? ""} ${o.value}`;
          return nq ? norm(haystack).includes(nq) : true;
        })
        .slice(0, maxVisible);
    }
    return src.slice(0, maxVisible);
  }, [normalizedOptions, asyncOptions, fetchOptions, q, maxVisible, meetsMin]);

  const openMenu = React.useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const selectAt = (idx: number) => {
    const opt = list[idx];
    if (!opt || opt.disabled) return;
    onOptionSelect?.(opt);
    onValueChange(opt.label);
    setOpen(false);
    setActiveIdx(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && ["ArrowDown", "ArrowUp"].includes(e.key)) setOpen(true);
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1 < list.length ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i > 0 ? i - 1 : list.length - 1));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && list[activeIdx]) {
        e.preventDefault();
        selectAt(activeIdx);
      } else if (freeSolo) {
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  const renderOption = (o: ComboOption, i: number) => {
    const active = i === activeIdx;
    return (
      <li
        key={o.value}
        id={`${idList}-opt-${i}`}
        role="option"
        aria-selected={active}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => selectAt(i)}
        className={cn(
          "cursor-pointer select-none px-3 py-2 text-sm",
          active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
          o.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex flex-col">
          <span>{highlight(o.label, q)}</span>
          {o.sublabel ? (
            <span className="text-xs text-muted-foreground">{highlight(o.sublabel, q)}</span>
          ) : null}
        </div>
      </li>
    );
  };

  const thresholdMsg = thresholdText ?? `Escribe al menos ${minChars} caracteres`;

  return (
    <div ref={rootRef} className="relative">
      <BaseInput
        ref={inputRef}
        role="combobox"
        aria-expanded={open}
        aria-controls={idList}
        aria-activedescendant={activeIdx >= 0 ? `${idList}-opt-${activeIdx}` : undefined}
        aria-autocomplete="list"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value);
          setQ(e.target.value);
          openMenu();
        }}
        onFocus={openMenu}
        onKeyDown={onKeyDown}
        autoComplete="off"
        className={className}
        {...rest}
      />

      {open && (loading || list.length > 0 || (!loading && q)) && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
            listClassName
          )}
        >
          <ul id={idList} role="listbox" className="max-h-72 overflow-auto py-1">
            {!loading && !meetsMin && q.trim().length > 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">{thresholdMsg}</li>
            )}
            {loading && meetsMin && (
              <li className="px-3 py-2 text-sm text-muted-foreground">{loadingText}</li>
            )}
            {!loading && meetsMin && list.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">{notFoundText}</li>
            )}
            {!loading && meetsMin && list.map((o, i) => renderOption(o, i))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Resalta coincidencias simples (best-effort)
function highlight(text: string, q: string) {
  if (!q) return text;
  const ntext = norm(text);
  const nq = norm(q);
  const i = ntext.indexOf(nq);
  if (i < 0) return text;
  const end = i + nq.length;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent underline underline-offset-2">{text.slice(i, end)}</mark>
      {text.slice(end)}
    </>
  );
}