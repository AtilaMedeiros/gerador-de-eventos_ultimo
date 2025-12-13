
import { cn } from '@/lib/utils'

interface EventStatusBadgeProps {
    adminStatus: string
    timeStatus?: string
    className?: string
}

export function EventStatusBadge({
    adminStatus,
    timeStatus = 'AGENDADO', // Default logic fallback
    className,
}: EventStatusBadgeProps) {
    // Normalize inputs to upper case for safety
    const admin = adminStatus?.toUpperCase() || 'RASCUNHO'
    const time = timeStatus?.toUpperCase() || 'AGENDADO'

    // Determine Badge Configuration
    let badgeConfig = {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-400',
        label: 'Rascunho', // Default
    }

    // --- Logic Table ---

    // Helper to get Time Label
    const getTimeLabel = (t: string) => {
        switch (t) {
            case 'AGENDADO': return 'Agendado'
            case 'ATIVO': return 'Em Andamento'
            case 'ENCERRADO': return 'Encerrado'
            default: return 'Agendado'
        }
    }
    const timeLabel = getTimeLabel(time)

    // 1. DESATIVADO (Dominant)
    if (admin === 'DESATIVADO') {
        badgeConfig = {
            bg: 'bg-red-500/15 dark:bg-red-900/30',
            text: 'text-red-700 dark:text-red-400',
            label: `Desativado • ${timeLabel}`,
        }
    }


    // 4. RASCUNHO (Dominant over time unless completely invalid)
    else if (admin === 'RASCUNHO') {
        badgeConfig = {
            bg: 'bg-gray-400/15 dark:bg-gray-800/50',
            text: 'text-gray-600 dark:text-gray-400',
            label: `Rascunho • ${timeLabel}`,
        }
    }
    // 5. PUBLICADO (Depends on Time Status)
    else if (admin === 'PUBLICADO') {
        switch (time) {
            case 'AGENDADO':
                badgeConfig = {
                    bg: 'bg-blue-500/15 dark:bg-blue-900/30',
                    text: 'text-blue-700 dark:text-blue-400',
                    label: 'Publicado • Agendado',
                }
                break
            case 'ATIVO':
                badgeConfig = {
                    bg: 'bg-emerald-500/15 dark:bg-emerald-900/30',
                    text: 'text-emerald-700 dark:text-emerald-400',
                    label: 'Publicado • Em Andamento',
                }
                break
            case 'ENCERRADO':
                badgeConfig = {
                    bg: 'bg-slate-600/15 dark:bg-slate-800/50',
                    text: 'text-slate-700 dark:text-slate-400',
                    label: 'Publicado • Encerrado',
                }
                break
            default:
                // Fallback for valid PUBLICADO but standard time
                badgeConfig = {
                    bg: 'bg-blue-500/15 dark:bg-blue-900/30',
                    text: 'text-blue-700 dark:text-blue-400',
                    label: 'Publicado',
                }
        }
    }

    return (
        <div
            className={cn(
                'flex items-center gap-2 px-2 py-0.5 rounded-[5px] text-[10px] font-bold w-fit transition-colors',
                badgeConfig.bg,
                badgeConfig.text,
                className,
            )}
        >
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse shadow-sm" />
            <span className="uppercase tracking-wider">{badgeConfig.label}</span>
        </div>
    )
}
