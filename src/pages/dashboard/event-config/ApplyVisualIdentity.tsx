import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom'
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
import { Search, Palette, Check, ArrowLeft, Save, Layout, Eye, Rocket, X, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { EventPreview } from '@/components/EventPreview'
import VisualIdentityForm from '../basic-registration/VisualIdentityForm'

export default function ApplyVisualIdentity({
  eventId: propEventId,
  isWizard = false,
  onFinish,
  onBack,
}: {
  eventId?: string
  isWizard?: boolean
  onFinish?: () => void
  onBack?: () => void
}) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { eventId: paramEventId } = useParams()

  const urlEventId = propEventId || paramEventId || searchParams.get('eventId')

  const { events, updateEvent, getEventById } = useEvent()
  const { themes, deleteTheme } = useTheme()

  const [selectedEventId, setSelectedEventId] = useState<string>(
    urlEventId || '',
  )
  const [selectedThemeId, setSelectedThemeId] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null)

  // Sync URL param with state and set default theme
  useEffect(() => {
    if (urlEventId) {
      setSelectedEventId(urlEventId)
      const event = getEventById(urlEventId)
      if (event && event.themeId) {
        setSelectedThemeId(event.themeId)
        return
      }
    }

    // Set default theme if none selected
    if (!selectedThemeId && themes.length > 0) {
      const defaultTheme = themes.find((t) =>
        t.name.toLowerCase().includes('institucional'),
      )
      if (defaultTheme) {
        setSelectedThemeId(defaultTheme.id)
      } else {
        setSelectedThemeId(themes[0].id)
      }
    }
  }, [urlEventId, getEventById, themes, selectedThemeId])

  const handleEventSelect = (value: string) => {
    setSelectedEventId(value)
    if (!paramEventId) {
      setSearchParams({ eventId: value })
    }
    const event = getEventById(value)
    if (event && event.themeId) {
      setSelectedThemeId(event.themeId)
    } else {
      const defaultTheme = themes.find((t) =>
        t.name.toLowerCase().includes('institucional'),
      )
      if (defaultTheme) {
        setSelectedThemeId(defaultTheme.id)
      } else {
        setSelectedThemeId('')
      }
    }
  }

  const handleSave = () => {
    if (!selectedEventId) return

    if (!selectedThemeId) {
      toast.error('Por favor, selecione um tema para aplicar.')
      return
    }

    updateEvent(selectedEventId, { themeId: selectedThemeId, status: 'published' })
    toast.success('Evento publicado com sucesso!')

    if (isWizard && onFinish) {
      onFinish()
    }
  }

  const handleDraft = () => {
    if (!selectedEventId) return
    updateEvent(selectedEventId, { themeId: selectedThemeId, status: 'draft' })
    toast.success('Rascunho salvo com sucesso!')
  }

  const handlePreview = () => {
    if (!selectedEventId) return
    setShowPreview(true)
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId)
  const currentTheme = themes.find((t) => t.id === selectedThemeId)



  return (
    <div className={cn("w-full max-w-[1600px] mx-auto flex flex-col pt-6 px-4 lg:px-8", isWizard ? "h-full" : "h-[calc(100vh-5rem)]")}>
      {/* Header */}
      {!isWizard && (
        <div className="flex items-center justify-between mb-8 shrink-0 px-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/area-do-produtor/evento')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Identidade Visual
                {selectedEvent && <span className="text-muted-foreground font-light px-2 border-l ml-2 text-xl">{selectedEvent.name}</span>}
              </h2>
              <p className="text-muted-foreground text-sm">
                Escolha um tema para personalizar a página pública do evento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-2 lg:pr-4 scrollbar-thin pb-24">

        {/* Left Column: Theme Selection */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="flex flex-col shadow-md border bg-card rounded-xl overflow-hidden">
            <CardHeader className="shrink-0 pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Temas Disponíveis
              </CardTitle>
              <CardDescription>
                Selecione um tema abaixo para visualizar.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 grid gap-4 max-h-[600px] overflow-y-auto scrollbar-thin">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:border-primary/50 relative overflow-hidden',
                    selectedThemeId === theme.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-transparent bg-card shadow-sm hover:translate-x-1',
                  )}
                  onClick={() => setSelectedThemeId(theme.id)}
                >
                  <div className="flex items-start justify-between mb-2 min-h-[24px]">
                    <span className="font-semibold pt-0.5 pr-8 leading-tight">{theme.name}</span>

                    {selectedThemeId === theme.id && (
                      <Badge className="bg-primary text-primary-foreground absolute top-0 right-0 rounded-none rounded-bl-xl px-3 shadow-sm z-10">
                        <Check className="h-3 w-3 mr-1" /> Ativo
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {theme.description || 'Sem descrição.'}
                  </p>

                  <div className="flex items-end justify-between mt-auto">
                    {/* Colors - Bottom Left */}
                    <div className="flex items-center pl-1">
                      <div
                        className="h-5 w-5 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primária"
                      />
                      <div
                        className="h-5 w-5 rounded-full border-2 border-background shadow-sm -ml-2"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secundária"
                      />
                      <div
                        className="h-5 w-5 rounded-full border-2 border-background shadow-sm -ml-2"
                        style={{ backgroundColor: theme.colors.background }}
                        title="Fundo"
                      />
                      <div
                        className="h-5 w-5 rounded-full border-2 border-background shadow-sm -ml-2"
                        style={{ backgroundColor: theme.colors.text }}
                        title="Texto"
                      />
                    </div>

                    {/* Actions - Bottom Right */}
                    <div className="flex items-center justify-end gap-1 -mr-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingThemeId(theme.id)
                          setShowThemeModal(true)
                        }}
                        title="Editar"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Tem certeza que deseja excluir este tema?')) {
                            deleteTheme(theme.id)
                          }
                        }}
                        title="Excluir"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="shrink-0 pt-2 border-t bg-muted/20">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-primary"
                onClick={() =>
                  navigate(
                    `/area-do-produtor/identidade-visual-2/novo?returnTo=${encodeURIComponent(
                      location.pathname + location.search,
                    )}`,
                  )
                }
              >
                + Criar Novo Tema
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8 flex flex-col bg-background/50 rounded-xl border shadow-sm p-1">
          <div className="rounded-lg overflow-hidden relative bg-muted/10">
            {currentTheme ? (
              <div>
                <ThemePreview values={currentTheme} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <div className="bg-muted/30 p-6 rounded-full mb-4">
                  <Palette className="h-12 w-12 opacity-30" />
                </div>
                <p className="text-lg font-medium">Selecione um tema</p>
                <p className="text-sm opacity-70">para visualizar o resultado.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 right-0 p-4 border-t bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-end gap-2 w-full lg:w-[calc(100%-16rem)] transition-all duration-300">
        {!isWizard && (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedEventId('')
              setSearchParams({})
              setSelectedThemeId('')
            }}
          >
            <X className="mr-2 h-4 w-4" /> Trocar Evento
          </Button>
        )}

        {isWizard && onBack && (
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        )}

        <Button
          variant="outline"
          onClick={handleDraft}
          disabled={!selectedThemeId}
        >
          <Save className="mr-2 h-4 w-4" /> Rascunho
        </Button>

        <Button
          variant="secondary"
          onClick={handlePreview}
          disabled={!selectedThemeId}
        >
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>

        <Button
          onClick={handleSave}
          disabled={!selectedThemeId}
          className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
        >
          {isWizard ? (
            <>Publicar <Rocket className="ml-2 h-4 w-4" /></>
          ) : (
            <><Rocket className="mr-2 h-4 w-4" /> Publicar</>
          )}
        </Button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden bg-background">
          {selectedEvent && (
            <EventPreview
              data={selectedEvent}
              onClose={() => setShowPreview(false)}
              onPublish={() => {
                setShowPreview(false)
                handleSave()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showThemeModal} onOpenChange={setShowThemeModal}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <div className="flex-1 overflow-hidden p-1">
            <VisualIdentityForm
              isModal
              themeId={editingThemeId || undefined}
              onSuccess={() => {
                setShowThemeModal(false)
                setEditingThemeId(null)
                // Optionally refresh themes or select the updated one
              }}
              onCancel={() => {
                setShowThemeModal(false)
                setEditingThemeId(null)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

