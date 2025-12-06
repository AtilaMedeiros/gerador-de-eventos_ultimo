import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, ArrowLeft, X, Save, Layers } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
      navigate('/area-do-produtor/evento')
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

      if (isWizard && onNext) {
        onNext()
      } else if (!paramEventId) {
        navigate('/area-do-produtor/evento')
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
    <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
          {!isWizard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/area-do-produtor/evento')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Associar Modalidades
            </h2>
            <p className="text-muted-foreground text-sm">
              Selecione as modalidades que farão parte do evento.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isWizard && (
            <Button
              variant="outline"
              onClick={() => navigate('/area-do-produtor/evento')}
            >
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
          )}

          {isWizard && onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          )}

          <Button onClick={handleSave} disabled={!eventId}>
            {isWizard ? (
              <>Próximo <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Salvar Associações</>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6 pb-6">

        {/* Left Column: List */}
        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 rounded-xl border shadow-sm shrink-0">
            <div className="relative w-full flex-1">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
              <Input
                placeholder="Buscar modalidades..."
                className="bg-background pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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

          {/* List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
            <div className="grid gap-3 pb-2">
              {filteredModalities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border rounded-xl bg-muted/20 border-dashed">
                  <Filter className="h-10 w-10 opacity-20 mb-2" />
                  <p>Nenhuma modalidade encontrada.</p>
                  <Button
                    variant="link"
                    onClick={() =>
                      navigate('/area-do-produtor/modalidades/nova')
                    }
                  >
                    Criar nova modalidade
                  </Button>
                </div>
              ) : (
                filteredModalities.map((mod) => (
                  <div
                    key={mod.id}
                    className={cn(
                      "flex items-center space-x-4 rounded-xl border p-4 transition-all duration-200 cursor-pointer group",
                      selected.includes(mod.id)
                        ? "bg-primary/5 border-primary/50 shadow-sm ring-1 ring-primary/20"
                        : "bg-card hover:bg-accent/50 hover:border-primary/30"
                    )}
                    onClick={() => toggle(mod.id)}
                  >
                    <Checkbox
                      checked={selected.includes(mod.id)}
                      onCheckedChange={() => toggle(mod.id)}
                      id={`mod-${mod.id}`}
                      className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className={cn("font-bold leading-none", selected.includes(mod.id) && "text-primary")}>
                          {mod.name}
                        </p>
                        <Badge
                          variant={mod.type === 'coletiva' ? 'default' : 'secondary'}
                          className="text-[10px] h-5 px-2 uppercase tracking-wider"
                        >
                          {mod.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{mod.gender}</span>
                        <span className="text-muted-foreground/40">•</span>
                        <span>{mod.minAge}-{mod.maxAge} anos</span>
                        {mod.eventCategory && (
                          <>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="italic">{mod.eventCategory}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="w-80 shrink-0 hidden lg:flex flex-col gap-4">
          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-6 h-full flex flex-col">
            <div>
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Layers className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Resumo</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Você selecionou <strong className="text-foreground">{selected.length}</strong> modalidades.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin rounded-lg bg-muted/20 border p-3">
              {selected.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground text-center px-4">
                  Nenhuma modalidade selecionada.
                </div>
              ) : (
                <ul className="space-y-2">
                  {selected.map((id) => {
                    const mod = modalities.find((m) => m.id === id)
                    if (!mod) return null
                    return (
                      <li key={id} className="text-sm flex items-start gap-2 p-2 rounded-md bg-background border shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                        <span className="leading-tight">{mod.name}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
