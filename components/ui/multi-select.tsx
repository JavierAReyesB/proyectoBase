"use client"

import * as React from "react"
import { Check, ChevronDown, X, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

type Option = { value: string; label: string; disabled?: boolean }

export interface MultiSelectProps {
    options: Option[]
    value: string[]
    onChange: (next: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    maxSelected?: number
    className?: string
    disabled?: boolean
    renderValue?: (selected: Option[]) => React.ReactNode
    portalSelector?: string
    sideOffset?: number
    multiColumn?: boolean
    columnThreshold?: number
    columnCount?: number
    columnGapClass?: string
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Selecciona opciones…",
    searchPlaceholder = "Buscar…",
    emptyMessage = "Sin resultados",
    maxSelected,
    className,
    disabled,
    renderValue,
    portalSelector = "[data-drawer-portal]",
    sideOffset = 6,
    multiColumn = true,
    columnThreshold = 5,
    columnCount = 2,
    columnGapClass = "gap-1.5",
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const optionMap = React.useMemo(() => new Map(options.map(o => [o.value, o] as const)), [options])
    const selectedOptions = React.useMemo(
        () => value.map(v => optionMap.get(v)).filter(Boolean) as Option[],
        [value, optionMap]
    )

    const container = typeof window !== "undefined"
        ? (document.querySelector(portalSelector) as HTMLElement | null)
        : null

    const toggle = (val: string) => {
        const isSelected = value.includes(val)
        if (isSelected) onChange(value.filter(v => v !== val))
        else {
            if (maxSelected && value.length >= maxSelected) return
            onChange([...value, val])
        }
    }

    const clear = (e?: React.MouseEvent | React.KeyboardEvent) => {
        e?.stopPropagation?.()
        onChange([])
    }
    const removeOne = (val: string, e?: React.MouseEvent | React.KeyboardEvent) => {
        e?.stopPropagation?.()
        onChange(value.filter(v => v !== val))
    }
    const reachLimit = maxSelected ? value.length >= maxSelected : false

    // Helpers de accesibilidad para spans "clicables"
    const asButtonProps = (onActivate: (e: any) => void) => ({
        role: "button" as const,
        tabIndex: 0,
        onClick: onActivate,
        onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") onActivate(e)
        },
    })

    const triggerContent = (() => {
        if (selectedOptions.length === 0)
            return <span className="text-muted-foreground">{placeholder}</span>

        if (renderValue) return renderValue(selectedOptions)

        const maxChips = 2
        const extra = selectedOptions.length - maxChips
        return (
            <div className="flex items-center gap-1 flex-wrap">
                {selectedOptions.slice(0, maxChips).map(opt => (
                    <Badge
                        key={opt.value}
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {opt.label}
                        <span
                            aria-label={`Quitar ${opt.label}`}
                            className="ml-1 hover:opacity-80"
                            {...asButtonProps((e) => removeOne(opt.value, e))}
                        >
                            <X className="h-3 w-3" />
                        </span>
                    </Badge>
                ))}
                {extra > 0 && <Badge variant="outline">+{extra}</Badge>}
            </div>
        )
    })()

    const isMultiColumn = multiColumn && options.length > columnThreshold
    const baseItemWidth = 260
    const contentStyle = isMultiColumn ? { minWidth: baseItemWidth * columnCount } : undefined
    const gridColsClass =
        isMultiColumn
            ? (columnCount === 3
                ? "grid grid-cols-3"
                : columnCount === 4
                    ? "grid grid-cols-4"
                    : "grid grid-cols-2")
            : ""

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
            <PopoverPrimitive.Trigger asChild>
                {/* Button externo = <button>. Evitamos anidar más <button> dentro */}
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "h-10 w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        className
                    )}
                >
                    <div className="min-w-0 flex-1 overflow-hidden text-left">
                        <div className="truncate">{triggerContent}</div>
                    </div>

                    <div className="ml-2 flex items-center gap-2">
                        {value.length > 0 && (
                            // 🔧 antes era <button> -> provoca button dentro de button
                            <span
                                aria-label="Limpiar selección"
                                className="rounded hover:bg-muted p-1"
                                {...asButtonProps(clear)}
                            >
                                <XCircle className="h-4 w-4 opacity-70" />
                            </span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                </Button>
            </PopoverPrimitive.Trigger>

            <PopoverPrimitive.Portal container={container ?? undefined}>
                <PopoverPrimitive.Content
                    side="bottom"
                    align="start"
                    sideOffset={sideOffset}
                    style={contentStyle}
                    className={cn(
                        "z-[6000] w-[--radix-popover-trigger-width] min-w-[260px] overflow-hidden",
                        "rounded-md border bg-popover text-popover-foreground shadow-md",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                    )}
                >
                    <Command shouldFilter>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList className="max-h-64">
                            <CommandEmpty>{emptyMessage}</CommandEmpty>

                            <CommandGroup
                                className={cn(
                                    // 👇 Aplicamos grid al contenedor interno de cmdk
                                    isMultiColumn && "[&_[cmdk-group-items]]:grid",
                                    isMultiColumn && (columnCount === 3
                                        ? "[&_[cmdk-group-items]]:grid-cols-3"
                                        : columnCount === 4
                                            ? "[&_[cmdk-group-items]]:grid-cols-4"
                                            : "[&_[cmdk-group-items]]:grid-cols-2"),
                                    isMultiColumn && "[&_[cmdk-group-items]]:gap-1.5",
                                )}
                            >
                                {options.map((opt) => {
                                    const checked = value.includes(opt.value)
                                    const disabledItem = opt.disabled || (!checked && reachLimit)
                                    return (
                                        <CommandItem
                                            key={opt.value}
                                            value={opt.label}
                                            disabled={disabledItem}
                                            className={cn(
                                                "flex items-center gap-2 px-2 py-2", // ❌ quitamos w-full
                                                disabledItem && "opacity-50 cursor-not-allowed"
                                            )}
                                            onSelect={() => !disabledItem && toggle(opt.value)}
                                        >
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={() => !disabledItem && toggle(opt.value)}
                                                className="mr-1"
                                                disabled={disabledItem}
                                                aria-label={opt.label}
                                            />
                                            <span className="flex-1">{opt.label}</span>
                                            {checked && <Check className="h-4 w-4 opacity-70" />}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>

                        <div className="flex items-center justify-between border-t px-2 py-2">
                            <div className="text-xs text-muted-foreground">
                                {maxSelected ? `${value.length}/${maxSelected} seleccionadas` : `${value.length} seleccionadas`}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => clear(e)}
                                    disabled={value.length === 0}
                                >
                                    Limpiar
                                </Button>
                                <Button type="button" size="sm" onClick={() => setOpen(false)}>
                                    Listo
                                </Button>
                            </div>
                        </div>
                    </Command>
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    )
}
