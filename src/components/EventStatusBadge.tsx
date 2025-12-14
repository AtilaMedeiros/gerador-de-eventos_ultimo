
import { cn } from '@/lib/utils'

interface EventStatusBadgeProps {
    adminStatus: string
    className?: string
}

export function EventStatusBadge({
    adminStatus,
    className,
}: EventStatusBadgeProps) {
    // Normalize input
    const admin = adminStatus?.toUpperCase() || 'RASCUNHO'

    // Determine Color Configuration
    let dotColor = 'bg-gray-400'
    let label = 'Rascunho'

    // 1. DESATIVADO
    if (admin === 'DESATIVADO') {
        dotColor = 'bg-red-500'
        label = 'Desativado'
    }
    // 2. RASCUNHO
    else if (admin === 'RASCUNHO') {
        dotColor = 'bg-orange-400'
        label = 'Rascunho'
    }
    // 3. PUBLICADO
    else if (admin === 'PUBLICADO') {
        dotColor = 'bg-blue-600 dark:bg-blue-500'
        label = 'Publicado'
    }

    return (
        <div className={cn('flex items-center gap-1.5 text-[11px]', className)}>
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
            <span className="text-muted-foreground font-medium uppercase tracking-wide">
                {label}
            </span>
        </div>
    )
}
