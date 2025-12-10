'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex gap-4">
                        {Array.from({ length: columns }).map((_, i) => (
                            <Skeleton key={i} className="h-4 flex-1" />
                        ))}
                    </div>

                    {/* Rows */}
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <div key={rowIndex} className="flex gap-4">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <Skeleton key={colIndex} className="h-8 flex-1" />
                            ))}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function CardSkeleton() {
    return (
        <Card>
            <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
    )
}

export function FormSkeleton() {
    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
                <Skeleton className="h-10 w-32 ml-auto" />
            </CardContent>
        </Card>
    )
}
