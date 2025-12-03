import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface ThemeValues {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    success: string
    warning: string
    error: string
    info: string
  }
  typography: {
    titleFont: string
    bodyFont: string
    baseSize: number
    lineHeight: number
  }
  spacing: {
    baseUnit: number
  }
  style: {
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
    borderThickness: number
    shadow: 'none' | 'light' | 'medium' | 'strong' | 'heavy'
  }
}

export interface Theme extends ThemeValues {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  isDefault?: boolean
}

// Initial Mock Data
const INITIAL_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Padrão Institucional',
    description: 'Tema padrão do sistema.',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    colors: {
      primary: '#0197FF',
      secondary: '#FF6B35',
      background: '#FFFFFF',
      text: '#333333',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      info: '#17A2B8',
    },
    typography: {
      titleFont: 'Inter',
      bodyFont: 'Inter',
      baseSize: 16,
      lineHeight: 1.5,
    },
    spacing: {
      baseUnit: 4,
    },
    style: {
      borderRadius: 'medium',
      borderThickness: 1,
      shadow: 'light',
    },
  },
  {
    id: 'summer-2025',
    name: 'Verão 2025',
    description: 'Tema vibrante para eventos de verão.',
    createdAt: new Date(),
    updatedAt: new Date(),
    colors: {
      primary: '#FF5722',
      secondary: '#FFC107',
      background: '#FFF8E1',
      text: '#3E2723',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#00BCD4',
    },
    typography: {
      titleFont: 'Poppins',
      bodyFont: 'Roboto',
      baseSize: 16,
      lineHeight: 1.6,
    },
    spacing: {
      baseUnit: 5,
    },
    style: {
      borderRadius: 'large',
      borderThickness: 0,
      shadow: 'medium',
    },
  },
]

interface ThemeContextType {
  themes: Theme[]
  addTheme: (theme: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTheme: (id: string, theme: Partial<Theme>) => void
  deleteTheme: (id: string) => void
  getThemeById: (id: string) => Theme | undefined
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themes, setThemes] = useState<Theme[]>(INITIAL_THEMES)

  // Load from local storage on mount if available
  useEffect(() => {
    const stored = localStorage.getItem('ge_themes')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const restored = parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }))
        setThemes(restored)
      } catch (e) {
        console.error('Failed to load themes from storage', e)
      }
    }
  }, [])

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ge_themes', JSON.stringify(themes))
  }, [themes])

  const addTheme = (
    themeData: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const newTheme: Theme = {
      ...themeData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setThemes((prev) => [newTheme, ...prev])
    toast.success('Tema criado com sucesso!')
  }

  const updateTheme = (id: string, themeData: Partial<Theme>) => {
    setThemes((prev) =>
      prev.map((theme) =>
        theme.id === id
          ? { ...theme, ...themeData, updatedAt: new Date() }
          : theme,
      ),
    )
    toast.success('Tema atualizado com sucesso!')
  }

  const deleteTheme = (id: string) => {
    setThemes((prev) => prev.filter((theme) => theme.id !== id))
    toast.success('Tema excluído com sucesso!')
  }

  const getThemeById = (id: string) => {
    return themes.find((theme) => theme.id === id)
  }

  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        themes,
        addTheme,
        updateTheme,
        deleteTheme,
        getThemeById,
      },
    },
    children,
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
