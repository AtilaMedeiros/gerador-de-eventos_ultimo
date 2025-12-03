import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'producer' | 'school_admin' | 'technician'
  permissions: string[]
  schoolId?: string // Link to school if school_admin or technician
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
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
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation logic
    if (password === 'error' || password.length < 6 || !email.includes('@')) {
      return false
    }

    let mockUser: User

    // Mock different users based on email
    if (email.includes('admin')) {
      mockUser = {
        id: '1',
        name: 'João Produtor',
        email: email,
        role: 'producer',
        permissions: ['criar_evento', 'editar_evento', 'ver_relatorios'],
      }
    } else if (email.includes('escola')) {
      mockUser = {
        id: '2',
        name: 'Diretor da Escola',
        email: email,
        role: 'school_admin',
        permissions: ['gerir_escola', 'gerir_atletas', 'gerir_tecnicos'],
        schoolId: 'school-1',
      }
    } else if (email.includes('tecnico')) {
      mockUser = {
        id: '3',
        name: 'Técnico Esportivo',
        email: email,
        role: 'technician',
        permissions: ['ver_atletas'],
        schoolId: 'school-1',
      }
    } else {
      // Default fallback for demo
      mockUser = {
        id: '2',
        name: 'Diretor da Escola',
        email: email,
        role: 'school_admin',
        permissions: ['gerir_escola', 'gerir_atletas', 'gerir_tecnicos'],
        schoolId: 'school-1',
      }
    }

    setUser(mockUser)
    localStorage.setItem('ge_user', JSON.stringify(mockUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ge_user')
    toast.info('Você saiu do sistema')
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'school_admin' && permission.startsWith('gerir_'))
      return true
    return user.permissions.includes(permission)
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
