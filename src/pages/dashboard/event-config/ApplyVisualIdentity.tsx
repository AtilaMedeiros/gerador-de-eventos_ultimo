import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import { useEvent } from '@/contexts/EventContext'
import { useTheme, Theme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemePreview } from '@/components/ThemePreview'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Palette, Check, ArrowLeft, Save, Layout } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ApplyVisualIdentity() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { eventId: paramEventId } = useParams()

  const urlEventId = paramEventId || searchParams.get('eventId')

  const { events, updateEvent, getEventById } = useEvent()
  const { themes } = useTheme()

  const [selectedEventId, setSelectedEventId] = useState<string>(
    urlEventId || '',
  )
  const [selectedThemeId, setSelectedThemeId] = useState<string>('')

  // Sync URL param with state
  useEffect(() => {
    if (urlEventId) {
      setSelectedEventId(urlEventId)
      const event = getEventById(urlEventId)
      if (event && event.themeId) {
        setSelectedThemeId(event.themeId)
      }
    }
  }, [urlEventId, getEventById])

  const handleEventSelect = (value: string) => {
    setSelectedEventId(value)
    if (!paramEventId) {
      setSearchParams({ eventId: value })
    }
    const event = getEventById(value)
    if (event && event.themeId) {
      setSelectedThemeId(event.themeId)
    } else {
      setSelectedThemeId('')
    }
  }

  const handleSave = () => {
    if (!selectedEventId) return

    if (!selectedThemeId) {
      toast.error('Por favor, selecione um tema para aplicar.')
      return
    }

    updateEvent(selectedEventId, { themeId: selectedThemeId })
    toast.success('Tema aplicado ao evento com sucesso!')
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId)
  const currentTheme = themes.find((t) => t.id === selectedThemeId)

  if (!selectedEventId) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
        <div className="space-y-2 text-center pt-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Configuração de Identidade Visual
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Selecione um evento para aplicar e visualizar um tema personalizado.
          </p>
        </div>

        <Card className="max-w-md mx-auto shadow-md">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Selecione o Evento
              </label>
              <Select onValueChange={handleEventSelect}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} (
                      {format(event.startDate, 'dd/MM/yyyy', { locale: ptBR })})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground flex gap-3 items-start">
              <Search className="h-5 w-5 shrink-0 mt-0.5" />
              <p>As opções de temas serão exibidas após a seleção do evento.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          {!paramEventId && (
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2 text-muted-foreground"
              onClick={() =>
                navigate('/area-do-produtor/cadastro-basico/evento')
              }
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para Eventos
            </Button>
          )}
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Identidade Visual:{' '}
            <span className="text-primary">{selectedEvent?.name}</span>
          </h2>
          <p className="text-muted-foreground">
            Escolha um tema para personalizar a página pública do evento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!paramEventId && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedEventId('')
                setSearchParams({})
                setSelectedThemeId('')
              }}
            >
              Trocar Evento
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!selectedThemeId}
            className="gap-2"
          >
            <Save className="h-4 w-4" /> Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-12 gap-6 h-full overflow-hidden pb-6">
        {/* Left Column: Theme Selection */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Temas Disponíveis
              </CardTitle>
              <CardDescription>
                Selecione um tema abaixo para visualizar.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={cn(
                    'cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50',
                    selectedThemeId === theme.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-transparent bg-muted/40',
                  )}
                  onClick={() => setSelectedThemeId(theme.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{theme.name}</span>
                    {selectedThemeId === theme.id && (
                      <Badge className="bg-primary text-primary-foreground">
                        Selecionado
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {theme.description || 'Sem descrição.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border shadow-sm"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primária"
                    />
                    <div
                      className="h-4 w-4 rounded-full border shadow-sm"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secundária"
                    />
                    <div
                      className="h-4 w-4 rounded-full border shadow-sm"
                      style={{ backgroundColor: theme.colors.background }}
                      title="Fundo"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  navigate(
                    '/area-do-produtor/cadastro-basico/identidade-visual/novo',
                  )
                }
              >
                Criar Novo Tema
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8 h-full flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Visualização em Tempo Real
            </h3>
            {currentTheme && (
              <span className="text-xs text-muted-foreground">
                Exibindo: <strong>{currentTheme.name}</strong>
              </span>
            )}
          </div>

          <div className="flex-1 border rounded-xl overflow-hidden bg-background shadow-sm relative">
            {currentTheme ? (
              <ThemePreview values={currentTheme} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                <Palette className="h-12 w-12 mb-4 opacity-20" />
                <p>Selecione um tema para visualizar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
