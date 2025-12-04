import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Link as LinkIcon, Filter, ArrowLeft } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function AssociateModalities({
  eventId: propEventId,
  isWizard = false,
  onNext,
  onBack,
}: {
  eventId?: string
  isWizard?: boolean
  onNext?: () => void
  onBack?: () => void
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { eventId: paramEventId } = useParams()

  // Priority to prop, then route param, fallback to search param
  const eventId = propEventId || paramEventId || searchParams.get('eventId')

  const [selected, setSelected] = useState<string[]>([])
  const { getEventById, getEventModalities, setEventModalities } = useEvent()
  const { modalities } = useModality()
  const [searchTerm, setSearchTerm] = useState('')

  const event = eventId ? getEventById(eventId) : undefined

  useEffect(() => {
    if (!eventId) {
      toast.warning('Nenhum evento selecionado.', {
        description: 'Retornando para a lista de eventos.',
      })
      navigate('/area-do-produtor/cadastro-basico/evento')
    } else {
      // Load existing associations
      const existing = getEventModalities(eventId)
      if (existing.length > 0) {
        setSelected(existing)
      }
    }
  }, [eventId, getEventModalities, navigate])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const toggleAll = (select: boolean) => {
    setSelected(select ? filteredModalities.map((m) => m.id) : [])
  }

  const handleSave = () => {
    if (eventId) {
      setEventModalities(eventId, selected)
      toast.success('Modalidades associadas com sucesso!', {
        description: `Foram vinculadas ${selected.length} modalidades ao evento ${event?.name || 'Selecionado'}.`,
      })
      // Determine where to navigate back based on context
      if (isWizard && onNext) {
        onNext()
      } else if (paramEventId) {
        // Inside Event Panel
        // Just toast, stay on page or maybe refresh?
        // Let's stay for now or reload to reflect changes if needed.
      } else {
        navigate('/area-do-produtor/cadastro-basico/evento')
      }
    }
  }

  const filteredModalities = useMemo(() => {
    return modalities.filter(
      (mod) =>
        mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [modalities, searchTerm])

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">
      {!isWizard && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <LinkIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Associar Modalidades
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Selecione as modalidades que farão parte do evento. As modalidades
              criadas no cadastro básico aparecem aqui automaticamente.
            </p>
          </div>
          {event && (
            <div className="bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-lg font-medium text-sm border border-secondary flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              Evento: {event.name}
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Selection List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 flex-1 w-full">
              <div className="relative w-full">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                <Input
                  placeholder="Buscar modalidades..."
                  className="bg-background pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAll(true)}
                className="flex-1 sm:flex-none"
              >
                Todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAll(false)}
                className="flex-1 sm:flex-none"
              >
                Nenhuma
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[500px] rounded-md border bg-card shadow-inner">
            <div className="p-4 grid gap-3">
              {filteredModalities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <Filter className="h-10 w-10 opacity-20 mb-2" />
                  <p>Nenhuma modalidade encontrada.</p>
                  <Button
                    variant="link"
                    onClick={() =>
                      navigate(
                        '/area-do-produtor/cadastro-basico/modalidades/nova',
                      )
                    }
                  >
                    Criar nova modalidade
                  </Button>
                </div>
              ) : (
                filteredModalities.map((mod) => (
                  <div
                    key={mod.id}
                    className={`flex items-center space-x-4 rounded-lg border p-4 transition-all duration-200 cursor-pointer group ${selected.includes(mod.id)
                      ? 'bg-primary/5 border-primary/50 shadow-sm'
                      : 'bg-card hover:bg-accent/50 hover:border-primary/20'
                      }`}
                    onClick={() => toggle(mod.id)}
                  >
                    <Checkbox
                      checked={selected.includes(mod.id)}
                      onCheckedChange={() => toggle(mod.id)}
                      id={`mod-${mod.id}`}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-bold leading-none ${selected.includes(mod.id) ? 'text-primary' : ''}`}
                        >
                          {mod.name}
                        </p>
                        <Badge
                          variant={
                            mod.type === 'coletiva' ? 'default' : 'secondary'
                          }
                          className="text-[10px] h-5 px-2"
                        >
                          {mod.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{mod.gender}</span>
                        <span>•</span>
                        <span>
                          {mod.minAge}-{mod.maxAge} anos
                        </span>
                        {mod.eventCategory && (
                          <>
                            <span>•</span>
                            <span className="italic">{mod.eventCategory}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-card border rounded-lg shadow-sm p-6 sticky top-4 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Resumo da Seleção</h3>
            <p className="text-sm text-muted-foreground">
              Você selecionou{' '}
              <strong className="text-foreground">{selected.length}</strong>{' '}
              modalidades para este evento.
            </p>
          </div>

          {selected.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Selecionadas Recentemente
              </p>
              <ul className="space-y-2">
                {selected.slice(-5).map((id) => {
                  const mod = modalities.find((m) => m.id === id)
                  if (!mod) return null
                  return (
                    <li key={id} className="text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="truncate">{mod.name}</span>
                    </li>
                  )
                })}
                {selected.length > 5 && (
                  <li className="text-xs text-muted-foreground pl-3.5">
                    + {selected.length - 5} outras...
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t">
            {!isWizard && (
              <Button
                onClick={handleSave}
                className="w-full bg-success hover:bg-success/90 font-semibold shadow-sm"
              >
                Salvar Associações
              </Button>
            )}
            {!isWizard && !paramEventId && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  navigate('/area-do-produtor/cadastro-basico/evento')
                }
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </div>

      {isWizard && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t p-4 z-40 shadow-lg md:pl-72">
          <div className="container max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              className="w-full md:w-auto hover:text-destructive"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 md:flex-none min-w-[160px]"
            >
              Próximo <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
