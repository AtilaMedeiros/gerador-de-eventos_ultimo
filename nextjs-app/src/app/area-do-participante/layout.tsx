'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { ParticipantSidebar } from '@/components/ParticipantSidebar'
import { ParticipantHeader } from '@/components/ParticipantHeader'

export default function ParticipantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading, isAuthenticated } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    // Rotas públicas do participante
    const isPublicRoute =
        pathname === '/area-do-participante/login' ||
        pathname === '/area-do-participante/cadastro' ||
        pathname?.includes('/imprimir')

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !isPublicRoute) {
            router.push('/area-do-participante/login')
        }
    }, [isLoading, isAuthenticated, isPublicRoute, router])

    if (isLoading && !isPublicRoute) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated && !isPublicRoute) {
        return null
    }

    // Para rotas públicas (login/cadastro), não mostrar sidebar/header
    if (isPublicRoute) {
        return <div className="min-h-screen">{children}</div>
    }

    return (
        <div className="flex min-h-screen">
            <ParticipantSidebar />
            <div className="flex-1 flex flex-col">
                <ParticipantHeader />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
