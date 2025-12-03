import { useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, AlertTriangle, Info, Play } from 'lucide-react'
import { ThemeValues } from '@/contexts/ThemeContext'

interface ThemePreviewProps {
  values: ThemeValues
}

export function ThemePreview({ values }: ThemePreviewProps) {
  // Dynamically load fonts from Google Fonts
  useEffect(() => {
    const titleFont = values.typography.titleFont
    const bodyFont = values.typography.bodyFont

    if (!titleFont || !bodyFont) return

    const linkId = 'dynamic-theme-fonts'
    let link = document.getElementById(linkId) as HTMLLinkElement

    if (!link) {
      link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }

    const fonts = [titleFont, bodyFont]
      .map((f) => f.replace(/\s+/g, '+'))
      .join('&family=')
    link.href = `https://fonts.googleapis.com/css2?family=${fonts}:wght@400;500;600;700&display=swap`
  }, [values.typography.titleFont, values.typography.bodyFont])

  // Calculate derived styles
  const previewStyles = useMemo(() => {
    const { colors, typography, spacing, style } = values

    const getRadius = (r: string) => {
      switch (r) {
        case 'none':
          return '0px'
        case 'small':
          return '4px'
        case 'medium':
          return '8px'
        case 'large':
          return '16px'
        case 'full':
          return '9999px'
        default:
          return '8px'
      }
    }

    const getShadow = (s: string) => {
      switch (s) {
        case 'none':
          return 'none'
        case 'light':
          return '0 2px 4px rgba(0,0,0,0.05)'
        case 'medium':
          return '0 4px 8px rgba(0,0,0,0.1)'
        case 'strong':
          return '0 8px 16px rgba(0,0,0,0.15)'
        case 'heavy':
          return '0 12px 24px rgba(0,0,0,0.2)'
        default:
          return 'none'
      }
    }

    return {
      '--preview-primary': colors.primary,
      '--preview-secondary': colors.secondary,
      '--preview-bg': colors.background,
      '--preview-text': colors.text,
      '--preview-success': colors.success,
      '--preview-warning': colors.warning,
      '--preview-font-title': values.typography.titleFont,
      '--preview-font-body': values.typography.bodyFont,
      '--preview-base-size': `${typography.baseSize}px`,
      '--preview-line-height': typography.lineHeight,
      '--preview-spacing': `${spacing.baseUnit}px`,
      '--preview-radius': getRadius(style.borderRadius),
      '--preview-border': `${style.borderThickness}px`,
      '--preview-shadow': getShadow(style.shadow),
    } as React.CSSProperties
  }, [values])

  return (
    <div className="h-full flex flex-col border rounded-xl overflow-hidden bg-gray-50/50 shadow-inner">
      <div className="p-3 border-b bg-white flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          Preview ao Vivo
        </span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div
          className="p-6 min-h-full transition-all duration-300 ease-in-out"
          style={{
            ...previewStyles,
            backgroundColor: 'var(--preview-bg)',
            color: 'var(--preview-text)',
            fontFamily: 'var(--preview-font-body)',
            fontSize: 'var(--preview-base-size)',
            lineHeight: 'var(--preview-line-height)',
          }}
        >
          {/* Hero Section Mockup */}
          <div
            className="mb-8 p-8 rounded-[var(--preview-radius)] text-white flex flex-col items-center text-center gap-4 transition-all"
            style={{
              backgroundColor: 'var(--preview-primary)',
              boxShadow: 'var(--preview-shadow)',
            }}
          >
            <Badge
              className="bg-white/20 hover:bg-white/30 text-white border-0 mb-2"
              style={{ borderRadius: 'var(--preview-radius)' }}
            >
              Edição 2025
            </Badge>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: 'var(--preview-font-title)' }}
            >
              Título do Evento
            </h1>
            <p className="opacity-90 max-w-md">
              Este é um exemplo de como o cabeçalho do seu evento ficará com as
              configurações atuais de cor e tipografia.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                className="px-6 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: 'var(--preview-secondary)',
                  color: 'var(--preview-text)',
                  borderRadius: 'var(--preview-radius)',
                  border: 'var(--preview-border) solid rgba(0,0,0,0.1)',
                }}
              >
                Inscreva-se
              </button>
              <button
                className="px-6 py-2 font-medium transition-opacity hover:opacity-90 bg-transparent border border-white/40"
                style={{ borderRadius: 'var(--preview-radius)' }}
              >
                Saiba Mais
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6">
            <Card
              className="border-0 transition-all"
              style={{
                borderRadius: 'var(--preview-radius)',
                boxShadow: 'var(--preview-shadow)',
                border: 'var(--preview-border) solid rgba(0,0,0,0.1)',
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{ fontFamily: 'var(--preview-font-title)' }}
                  className="flex items-center gap-2"
                >
                  <Info
                    className="h-5 w-5"
                    style={{ color: 'var(--preview-primary)' }}
                  />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm opacity-80">
                  A tipografia do corpo do texto utiliza a fonte{' '}
                  <strong>{values.typography.bodyFont}</strong>. O espaçamento
                  base está definido em{' '}
                  <strong>{values.spacing.baseUnit}px</strong>.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: 'var(--preview-primary)',
                      color: 'var(--preview-primary)',
                      borderRadius: 'var(--preview-radius)',
                    }}
                  >
                    Tag Primária
                  </Badge>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: 'var(--preview-secondary)',
                      color: 'var(--preview-secondary)',
                      borderRadius: 'var(--preview-radius)',
                    }}
                  >
                    Tag Secundária
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Alert Examples */}
            <div className="space-y-3">
              <div
                className="p-4 rounded-[var(--preview-radius)] border-l-4 flex items-center gap-3"
                style={{
                  backgroundColor: `${values.colors.success}15`,
                  borderLeftColor: values.colors.success,
                }}
              >
                <CheckCircle
                  className="h-5 w-5"
                  style={{ color: values.colors.success }}
                />
                <span className="text-sm font-medium">
                  Operação realizada com sucesso!
                </span>
              </div>
              <div
                className="p-4 rounded-[var(--preview-radius)] border-l-4 flex items-center gap-3"
                style={{
                  backgroundColor: `${values.colors.warning}15`,
                  borderLeftColor: values.colors.warning,
                }}
              >
                <AlertTriangle
                  className="h-5 w-5"
                  style={{ color: values.colors.warning }}
                />
                <span className="text-sm font-medium">
                  Atenção: Verifique os dados.
                </span>
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="w-full"
                style={{
                  backgroundColor: 'var(--preview-primary)',
                  borderRadius: 'var(--preview-radius)',
                  boxShadow: 'var(--preview-shadow)',
                }}
              >
                <Play className="mr-2 h-4 w-4" /> Ação Primária
              </Button>
              <Button
                className="w-full"
                style={{
                  backgroundColor: 'var(--preview-secondary)',
                  color: 'var(--preview-text)',
                  borderRadius: 'var(--preview-radius)',
                  boxShadow: 'var(--preview-shadow)',
                }}
              >
                Ação Secundária
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
