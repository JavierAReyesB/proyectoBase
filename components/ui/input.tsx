import * as React from "react"
import { cn } from "@/lib/utils"


/* ---------- Tipos ---------- */
type BaseProps = {
  error?: boolean
  errorMessage?: string
  leftIcon?: React.ReactNode      // ⬅ icono a la izquierda
  rightIcon?: React.ReactNode     // ⬅ icono a la derecha
  as?: "input" | "textarea"
  className?: string
}

/* Variante input ⬇ */
type InputVariant = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & { as?: "input" }

/* Variante textarea ⬇ */
type TextareaVariant = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" }

type InputProps = InputVariant | TextareaVariant

/* ---------- Componente ---------- */
const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ error, errorMessage, leftIcon, rightIcon, as = "input", className, ...rest }, ref) => {
    /* estilos base */
    const base = cn(
      "block w-full rounded-md border bg-background px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      error
        ? "border-destructive focus-visible:ring-destructive"
        : "border-input focus-visible:ring-ring",
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      className
    )

    /* field según variante */
    const field =
      as === "textarea"
        ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={base}
              {...(rest as TextareaVariant)}
            />
          )
        : (
            /* se extrae type de los props de input, con default */
            (() => {
              const { type = "text", ...inputRest } = rest as InputVariant
              return (
                <input
                  ref={ref as React.Ref<HTMLInputElement>}
                  type={type}
                  className={base}
                  {...inputRest}
                />
              )
            })()
          )

    return (
      <div className="space-y-1">
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </span>
          )}

          {field}

          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export { Input }
