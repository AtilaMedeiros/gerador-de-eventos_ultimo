'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCurrentUser, logout as serverLogout, type User } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
    hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const loadUser = async () => {
        setIsLoading(true)
        try {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
        } catch (error) {
            console.error('Erro ao carregar usuário:', error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadUser()
    }, [])

    const logout = async () => {
        try {
            await serverLogout()
            setUser(null)

            // Redirecionar baseado no role anterior
            if (user?.role === 'participante') {
                router.push('/area-do-participante/login')
            } else {
                router.push('/')
            }

            router.refresh()
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        }
    }

    const refreshUser = async () => {
        await loadUser()
    }

    const hasPermission = (permission: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _perm = permission // Placeholder usage
        if (!user) return false
        if (user.role === 'produtor') return true
        return false // Simplificado para demo
    }

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refreshUser,
        hasPermission,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
