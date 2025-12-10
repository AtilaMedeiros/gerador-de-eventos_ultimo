'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ParticipantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading, isAuthenticated } = useAuth()
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

    return (
        <div className="min-h-screen">
            {children}
        </div>
    )
}
