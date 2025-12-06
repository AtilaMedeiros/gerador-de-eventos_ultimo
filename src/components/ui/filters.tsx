import * as React from "react"
import { X, Plus, Filter as FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type FilterType = 'text' | 'number' | 'date' | 'email' | 'url' | 'boolean' | 'multiselect' | 'select'

export interface FilterFieldConfig {
    key: string
    label: string
    icon?: React.ReactNode
    type: FilterType
    placeholder?: string
    className?: string
    options?: { label: string; value: string; icon?: React.ReactNode }[]
}

export interface Filter {
    id: string
    field: string
    operator: string
    value: any
}

export function createFilter(field: string, operator: string, value: any): Filter {
    return { id: crypto.randomUUID(), field, operator, value }
}

interface FiltersProps {
    fields: FilterFieldConfig[]
    filters: Filter[]
    onChange: (filters: Filter[]) => void
    addButton?: React.ReactNode
    className?: string
}

export function Filters({ fields, filters, onChange, addButton, className }: FiltersProps) {
    const addFilter = (fieldKey: string) => {
        const field = fields.find(f => f.key === fieldKey)
        if (!field) return
        const newFilter = createFilter(fieldKey, 'contains', '')
        onChange([...filters, newFilter])
    }

    const removeFilter = (id: string) => {
        onChange(filters.filter(f => f.id !== id))
    }

    const updateFilter = (id: string, value: any) => {
        onChange(filters.map(f => (f.id === id ? { ...f, value } : f)))
    }

    const getField = (key: string) => fields.find(f => f.key === key)

    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            {/* Active Filters */}
            {filters.map(filter => {
                const field = getField(filter.field)
                if (!field) return null
                return (
                    <div key={filter.id} className="group flex items-center gap-2 bg-white/80 backdrop-blur-md border border-primary/30 rounded-md px-3 py-1.5 text-sm shadow-sm transition-all hover:border-primary/60 hover:bg-white hover:shadow-md animate-in fade-in zoom-in-95 duration-200">
                        <span className="text-primary/70 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                            {field.icon && <span className="opacity-70">{field.icon}</span>}
                            {field.label}:
                        </span>
                        {field.type === 'text' || field.type === 'email' ? (
                            <input
                                className="bg-transparent border-none outline-none w-32 text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:w-48 transition-all duration-300"
                                value={filter.value}
                                onChange={(e) => updateFilter(filter.id, e.target.value)}
                                placeholder={field.placeholder || "Digite..."}
                                autoFocus
                            />
                        ) : field.type === 'select' ? (
                            <select
                                className="bg-transparent border-none outline-none text-foreground text-sm font-medium focus:ring-0 cursor-pointer py-0 pl-1 pr-2"
                                value={filter.value}
                                onChange={(e) => updateFilter(filter.id, e.target.value)}
                                autoFocus
                            >
                                <option value="" disabled className="text-muted-foreground bg-white dark:bg-slate-900">Selecione...</option>
                                {field.options?.map(option => (
                                    <option key={option.value} value={option.value} className="bg-white dark:bg-slate-900 text-foreground">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="font-medium text-foreground">{String(filter.value)}</span>
                        )}
                        <button
                            onClick={() => removeFilter(filter.id)}
                            className="ml-1 rounded-full p-0.5 text-primary/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )
            })}

            {/* Add Filter Button */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {addButton || (
                        <Button
                            size="sm"
                            className="h-9 gap-2 rounded-md px-4 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-dashed border-blue-200 dark:border-blue-800 text-primary hover:bg-primary/5 hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                        >
                            <FilterIcon className="h-3.5 w-3.5" />
                            Filtrar por
                        </Button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2 border-primary/20 bg-white/95 backdrop-blur-xl shadow-xl shadow-primary/10">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Campos Disponíveis
                    </div>
                    {fields.map(field => (
                        <DropdownMenuItem
                            key={field.key}
                            onClick={() => addFilter(field.key)}
                            className="gap-3 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary/50 text-muted-foreground group-hover:text-primary">
                                {field.icon || <FilterIcon className="h-4 w-4" />}
                            </span>
                            <span className="flex-1 font-medium">{field.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
