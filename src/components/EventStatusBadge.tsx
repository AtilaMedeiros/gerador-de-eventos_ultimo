
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
    let badgeStyles = 'bg-orange-100 text-orange-700 border-orange-200'
    let label = 'Rascunho'

    // 1. DESATIVADO
    if (admin === 'DESATIVADO' || admin === 'CANCELADO') {
        badgeStyles = 'bg-red-100 text-red-700 border-red-200'
        label = 'Desativado'
    }
    // 2. RASCUNHO
    else if (admin === 'RASCUNHO') {
        badgeStyles = 'bg-orange-100 text-orange-700 border-orange-200'
        label = 'Rascunho'
    }
    // 3. PUBLICADO
    else if (admin === 'PUBLICADO') {
        badgeStyles = 'bg-blue-100 text-blue-700 border-blue-200'
        label = 'Publicado'
    }
    // 4. REABERTO
    else if (admin === 'REABERTO') {
        badgeStyles = 'bg-green-100 text-green-700 border-green-200'
        label = 'Reaberto'
    } else if (admin === 'SUSPENSO') {
        badgeStyles = 'bg-gray-100 text-gray-700 border-gray-200'
        label = 'Suspenso'
    }

    return (
        <div className={cn('flex items-center justify-center px-2.5 py-1 border rounded-[5px] text-[10px] font-bold uppercase tracking-wider shadow-sm select-none', badgeStyles, className)}>
            {label}
        </div>
    )
}
