'use client'

import { X, Calendar, User, Download } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface CommunicationModalProps {
    item: any
    onClose: () => void
    getCategoryColorClass: (category: string) => string
}

export function CommunicationModal({ item, onClose, getCategoryColorClass }: CommunicationModalProps) {
    if (!item) return null

    const badgeColorClass = getCategoryColorClass(item.category)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="w-full max-w-[550px] bg-white h-[550px] flex flex-col rounded-xl text-card-foreground shadow-2xl border-2 border-orange-100 overflow-hidden text-left relative animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div className="pr-8">
                        <div className={cn("inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border mb-3 ring-1", badgeColorClass)}>
                            {item.category}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            {item.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                    >
                        <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto text-base text-muted-foreground leading-relaxed whitespace-pre-wrap p-6">
                    {item.description}
                </div>

                <div className="flex flex-col gap-3 px-6 pb-6 pt-4 border-t border-border mt-auto bg-gray-50/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-5 h-5 text-blue-600" aria-hidden="true" />
                        <span className="text-base">
                            {format(new Date(item.date), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                        </span>
                    </div>
                    {item.author && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-5 h-5 text-blue-600" aria-hidden="true" />
                            <span className="text-base">{item.author}</span>
                        </div>
                    )}
                    {item.fileName && (
                        <div className="mt-2 w-full">
                            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md w-full justify-center">
                                <Download className="w-4 h-4" />
                                Baixar {item.fileName}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
