'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { DashboardHeader } from '@/components/DashboardHeader'

export default function ProducerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/')
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
