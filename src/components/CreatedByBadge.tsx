import { useState, useEffect } from 'react'
import { Terminal, X } from 'lucide-react'

export function CreatedByBadge() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const isClosed = localStorage.getItem('lavor-badge-closed') === 'true'
        if (!isClosed) {
            setIsVisible(true)
        }
    }, [])

    if (!isVisible) return null

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsVisible(false)
        localStorage.setItem('lavor-badge-closed', 'true')
    }

    return (
        <div className="fixed bottom-3 right-3 z-[9999] flex items-center gap-3 rounded-lg bg-black pl-3 pr-2 py-2 text-xs font-medium text-white shadow-lg border border-zinc-800 transition-colors hover:bg-zinc-900 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-500" />
                <span>Criado pelo Lavor</span>
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <button
                onClick={handleClose}
                className="rounded-full p-0.5 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                title="Ocultar selo"
            >
                <X className="h-3 w-3" />
            </button>
        </div>
    )
}
