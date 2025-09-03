import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useId,
} from "react";

// ---------------- helpers ----------------
const prettyBytes = (n: number) => {
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = n, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  const dec = v >= 10 || i === 0 ? 0 : 1;
  return `${v.toFixed(dec)} ${units[i]}`;
};
const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;
const normalizeAccept = (accept?: string | string[]) =>
  !accept ? undefined : (Array.isArray(accept) ? accept : accept.split(","))
    .map(t => t.trim().toLowerCase()).filter(Boolean);
const getFileExt = (name: string) => {
  const i = name.lastIndexOf("."); return i >= 0 ? name.slice(i).toLowerCase() : "";
};
const matchesMimeWildcard = (mime: string, pattern: string) => {
  const i = pattern.indexOf("/"); if (i === -1) return false;
  const [type, subtype] = [pattern.slice(0,i), pattern.slice(i+1)];
  return subtype === "*" && mime.toLowerCase().startsWith(`${type.toLowerCase()}/`);
};
const fileMatchesAccept = (file: File, accepts?: string[]) => {
  if (!accepts || accepts.length === 0) return true;
  const mime = (file.type || "").toLowerCase();
  const ext = getFileExt(file.name);
  for (const a of accepts) {
    if (!a) continue;
    if (a.startsWith(".")) { if (ext === a) return true; }
    else if (a.endsWith("/*")) { if (matchesMimeWildcard(mime, a)) return true; }
    else if (a.includes("/")) { if (mime === a) return true; }
    else if (mime.startsWith(`${a}/`)) { return true; }
  }
  return false;
};

// Abrir archivo en nueva pestaña con fallback y revoke diferido
const openFileInNewTab = (file: File) => {
  const url = URL.createObjectURL(file);
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

// --------------- tipos de props (sin exports extra) ---------------
export interface FilePickerTexts {
  dropLabel?: string;
  buttonLabel?: string;
  helperText?: string;
  emptyText?: string;
  clearAllText?: string;
  removeText?: string;
  countFormatter?: (count: number, totalBytes: number) => string;
}
type ErrorCode = "accept" | "maxFiles" | "maxFileSize" | "maxTotalSize";

export interface FilePickerProps {
  multiple?: boolean;
  accept?: string | string[];
  maxFiles?: number;
  maxFileSize?: number;
  maxTotalSize?: number;
  value?: File[];
  defaultValue?: File[];
  onChange?: (files: File[]) => void;

  /** Si lo omites, el componente muestra error inline automáticamente */
  onError?: (error: { code: ErrorCode; message: string; file?: File }) => void;

  /** Personaliza mensajes de error (si no usas onError) */
  errorMessages?: Partial<Record<ErrorCode, string>>;

  disabled?: boolean;
  id?: string;
  name?: string;
  capture?: boolean | "environment" | "user";
  directory?: boolean;
  renderFile?: (file: File, remove: () => void) => React.ReactNode;
  className?: string;
  texts?: FilePickerTexts;
  showClearAll?: boolean;
  showCounts?: boolean;
  /** Mostrar/ocultar el error inline cuando no hay onError */
  showInlineErrors?: boolean;

  /** Número de columnas para el listado: 1, 2, 3 o 4 */
  columns?: 1 | 2 | 3 | 4;

  /** NUEVO: comportamiento al hacer click sobre un archivo */
  onFileClick?: (file: File) => void;

  /** NUEVO: si true (por defecto), abre el archivo al click/Enter/Espacio */
  openOnClick?: boolean;
}

// --------------- componente ---------------
export const FilePicker = forwardRef<HTMLDivElement, FilePickerProps>(
  (
    {
      multiple = true,
      accept,
      maxFiles,
      maxFileSize,
      maxTotalSize,
      value,
      defaultValue,
      onChange,
      onError,
      errorMessages,
      disabled,
      id,
      name,
      capture,
      directory,
      renderFile,
      className,
      texts,
      showClearAll = true,
      showCounts = true,
      showInlineErrors = true,
      columns = 1,
      onFileClick,
      openOnClick = true,
    },
    ref
  ) => {
    const accepts = useMemo(() => normalizeAccept(accept), [accept]);
    const isControlled = value !== undefined;

    const [inner, setInner] = useState<File[]>(defaultValue ?? []);
    const files = isControlled ? (value as File[]) : inner;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [lastInlineError, setLastInlineError] = useState<string | null>(null);
    const errorId = useId();

    const totalBytes = useMemo(
      () => files.reduce((sum, f) => sum + (f?.size || 0), 0),
      [files]
    );

    const emit = useCallback((next: File[]) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    }, [isControlled, onChange]);

    const defaultErrorMap: Record<ErrorCode, string> = {
      accept: "Tipo de archivo no permitido",
      maxFiles: "Se alcanzó el máximo de archivos",
      maxFileSize: "Archivo supera el tamaño permitido",
      maxTotalSize: "Tamaño total excede el máximo",
    };
    const errText = (code: ErrorCode) => errorMessages?.[code] ?? defaultErrorMap[code];

    const reportError = useCallback((code: ErrorCode, file?: File) => {
      const message = errText(code);
      if (onError) onError({ code, message, file });
      else if (showInlineErrors) setLastInlineError(`${message}${file ? ` (${file.name})` : ""}`);
    }, [onError, showInlineErrors, errorMessages]);

    const validateAndReport = useCallback((
      current: File[],
      incoming: File[]
    ): { accepted: File[]; rejected: File[] } => {
      const accepted: File[] = [];
      const rejected: File[] = [];

      const room = maxFiles ? Math.max(0, maxFiles - current.length) : Infinity;
      let remaining = room;

      for (const f of incoming) {
        if (remaining <= 0) { reportError("maxFiles", f); rejected.push(f); continue; }
        if (!fileMatchesAccept(f, accepts)) { reportError("accept", f); rejected.push(f); continue; }
        if (maxFileSize && f.size > maxFileSize) { reportError("maxFileSize", f); rejected.push(f); continue; }
        accepted.push(f); remaining--;
      }

      if (maxTotalSize) {
        let running = current.reduce((a, b) => a + b.size, 0);
        const stillAccepted: File[] = [];
        for (const f of accepted) {
          if (running + f.size > maxTotalSize) { reportError("maxTotalSize", f); rejected.push(f); }
          else { stillAccepted.push(f); running += f.size; }
        }
        return { accepted: stillAccepted, rejected };
      }
      return { accepted, rejected };
    }, [accepts, maxFiles, maxFileSize, maxTotalSize, reportError]);

    const addFiles = useCallback((list?: FileList | File[] | null) => {
      if (!list) return;
      const incoming = Array.from(list);
      const map = new Map<string, File>();
      files.forEach(f => map.set(fileKey(f), f));
      const { accepted, rejected } = validateAndReport(files, incoming);
      accepted.forEach(f => { const k = fileKey(f); if (!map.has(k)) map.set(k, f); });
      emit(Array.from(map.values()));

      // feedback: si hubo rechazos, mostramos el último mensaje que haya dejado reportError
      // si no hubo rechazos y sí aceptados, limpiamos el error anterior
      if (rejected.length === 0 && accepted.length > 0 && showInlineErrors && !onError) {
        setLastInlineError(null);
      }
      // (si hubo rechazados, reportError ya se encargó de setear el mensaje)
    }, [files, emit, validateAndReport, showInlineErrors, onError]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      e.currentTarget.value = "";
    }, [addFiles]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); e.stopPropagation(); setIsDragging(false);
      if (!disabled) addFiles(e.dataTransfer?.files);
    }, [addFiles, disabled]);

    const removeAt = useCallback((key: string) => {
      emit(files.filter(f => fileKey(f) !== key));
    }, [files, emit]);

    const clearAll = useCallback(() => emit([]), [emit]);

    const {
      dropLabel = "Arrastra y suelta archivos",
      buttonLabel = "Añadir archivos",
      helperText = "",
      emptyText = "No hay registros para mostrar.",
      clearAllText = "Vaciar lista",
      removeText = "Quitar",
      countFormatter = ((count: number, bytes: number) =>
        `${count} seleccionado${count === 1 ? "" : "s"} · ${prettyBytes(bytes)}`) as NonNullable<FilePickerTexts["countFormatter"]>,
    } = texts || {};

    const inputAccept = useMemo(() => {
      if (!accept) return undefined;
      return Array.isArray(accept) ? accept.join(",") : accept;
    }, [accept]);

    useEffect(() => {
      if (!multiple && files.length > 1) emit([files[0]]);
    }, [multiple, files, emit]);

    const hasInlineError = showInlineErrors && !!lastInlineError;

    // NUEVO: acción de click en item
    const handleItemClick = useCallback((f: File) => {
      if (onFileClick) onFileClick(f);
      else openFileInNewTab(f);
    }, [onFileClick]);

    // clases para listado en 1..4 columnas (todas explícitas para que Tailwind las incluya)
    const listWrapperClass =
      columns === 1
        ? "space-y-2"
        : columns === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-2"
        : columns === 3
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2";

    return (
      <div
        ref={ref}
        className={[
          "space-y-2",
          disabled ? "opacity-60 pointer-events-none" : "",
          className || "",
        ].join(" ")}
      >
        <input
          ref={fileInputRef}
          id={id}
          name={name}
          type="file"
          multiple={multiple}
          accept={inputAccept}
          onChange={handleInputChange}
          capture={capture as any}
          {...(directory ? ({ webkitdirectory: true } as any) : {})}
          className="sr-only"
        />

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); }
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          aria-label={dropLabel}
          aria-invalid={hasInlineError || undefined}
          aria-describedby={hasInlineError ? errorId : undefined}
          className={[
            "flex flex-col items-center justify-center gap-2",
            "w-full max-w-xl rounded-2xl border-2 border-dashed px-4 py-8 text-center",
            "cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-black/50",
            isDragging ? "border-black/60 bg-black/[0.03]" : "border-muted-foreground/30 hover:bg-muted/40",
            hasInlineError ? "border-red-500 bg-red-50/40" : "",
          ].join(" ")}
        >
          <div className="text-sm">{dropLabel}</div>
          <div className="text-xs text-muted-foreground">o</div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="inline-flex items-center rounded-xl bg-black px-3 py-1.5 text-xs text-white hover:bg-black/90 active:translate-y-px"
          >
            {buttonLabel}
          </button>

          {helperText && (
            <div className="mt-2 text-[11px] text-muted-foreground">{helperText}</div>
          )}

          {hasInlineError && (
            <div
              id={errorId}
              className="mt-2 text-[11px] text-red-600"
              role="status"
              aria-live="assertive"
            >
              {lastInlineError}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs">
          {showCounts && (
            <span className="text-muted-foreground">
              {countFormatter(files.length, totalBytes)}
            </span>
          )}
          {showClearAll && files.length > 0 && (
            <button type="button" onClick={clearAll} className="text-red-600 hover:underline">
              {clearAllText}
            </button>
          )}
        </div>

        <div className="border rounded-lg p-3 text-sm">
          {files.length === 0 ? (
            <span>{emptyText}</span>
          ) : (
            <ul className={listWrapperClass}>
              {files.map((f) => {
                const k = fileKey(f);

                const node = renderFile ? (
                  renderFile(f, () => removeAt(k))
                ) : (
                  <li
                    key={k}
                    onClick={() => { if (openOnClick) handleItemClick(f); }}
                    onKeyDown={(e) => {
                      if (openOnClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleItemClick(f);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Abrir ${f.name}`}
                    title={f.name}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/50"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(f.type || "bin").toLowerCase()} · {prettyBytes(f.size)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeAt(k); }}
                      className="text-xs text-red-600 hover:underline"
                      aria-label={`${removeText} ${f.name}`}
                      title={removeText}
                    >
                      {removeText}
                    </button>
                  </li>
                );
                return node;
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
);
FilePicker.displayName = "FilePicker";