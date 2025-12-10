'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className
}: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    // Mostrar apenas algumas páginas ao redor da atual
    const visiblePages = pages.filter(page => {
        if (totalPages <= 7) return true
        if (page === 1 || page === totalPages) return true
        if (Math.abs(page - currentPage) <= 1) return true
        return false
    })

    return (
        <div className={cn('flex items-center justify-center gap-2', className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
                Anterior
            </Button>

            {visiblePages.map((page, index) => {
                const prevPage = visiblePages[index - 1]
                const showEllipsis = prevPage && page - prevPage > 1

                return (
                    <div key={page} className="flex items-center gap-2">
                        {showEllipsis && <span className="px-2">...</span>}
                        <Button
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Button>
                    </div>
                )
            })}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Próxima
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
