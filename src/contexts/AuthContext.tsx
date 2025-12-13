import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { User } from '@/backend/banco/usuarios'
import { EventRole } from '@/backend/banco/permissoes'
import { AuthService } from '@/backend/services/auth.service'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  getEventRole: (eventId: string) => EventRole | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('ge_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user session', error)
        localStorage.removeItem('ge_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = await AuthService.login(email, password)

      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem('ge_user', JSON.stringify(foundUser))
        return true
      }

      return false
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ge_user')
    toast.info('Você saiu do sistema')
  }

  const hasPermission = (permission: string): boolean => {
    return AuthService.hasGlobalPermission(user, permission)
  }

  const getEventRole = (eventId: string): EventRole | null => {
    return AuthService.getEventRole(user, eventId)
  }

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        getEventRole
      },
    },
    children,
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
