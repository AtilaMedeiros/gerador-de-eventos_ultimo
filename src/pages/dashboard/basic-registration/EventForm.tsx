import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  Save,
  Rocket,
  AlertTriangle,
  ExternalLink,
  Globe,
  Copy,
  Image as ImageIcon,
  CalendarDays,
  Users,
  Contact,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { EventPreview } from '@/components/EventPreview'
import { useAuth } from '@/contexts/AuthContext'
import AccessDenied from '@/pages/AccessDenied'
import { useEvent } from '@/contexts/EventContext'
import { eventFormSchema, type EventFormValues } from './schemas'

// Import sub-components
import { EventBasicInfo } from './components/EventBasicInfo'
import { EventDateFields } from './components/EventDateFields'
import { EventRegistrationFields } from './components/EventRegistrationFields'
import { EventProducerFields } from './components/EventProducerFields'

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function EventForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, hasPermission } = useAuth()
  const { addEvent, updateEvent, getEventById } = useEvent()

  const isEditing = id && id !== 'novo'
  const isCreating = id === 'novo'

  const [activeAccordion, setActiveAccordion] = useState('item-1')
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      textoInstitucional: '',
      nomeProdutor: user?.name || 'Produtor',
      descricaoProdutor: '',
      status: 'draft',
      horaInicio: '08:00',
      horaFim: '18:00',
      inscricaoColetivaHoraInicio: '00:00',
      inscricaoColetivaHoraFim: '23:59',
      inscricaoIndividualHoraInicio: '00:00',
      inscricaoIndividualHoraFim: '23:59',
      imagem: [],
      logoEvento: [],
      logosRealizadores: [],
      logosApoiadores: [],
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      const event = getEventById(id)
      if (event) {
        form.reset({
          name: event.name,
          textoInstitucional: event.description || '',
          nomeProdutor: event.producerName || user?.name || 'Produtor',
          descricaoProdutor: event.producerDescription || '',
          status: event.status as any,
          dataInicio: event.startDate,
          horaInicio: event.startTime || '08:00',
          dataFim: event.endDate,
          horaFim: event.endTime || '18:00',
          inscricaoColetivaInicio:
            event.registrationCollectiveStart || new Date(),
          inscricaoColetivaFim: event.registrationCollectiveEnd || new Date(),
          inscricaoColetivaHoraInicio: '00:00',
          inscricaoColetivaHoraFim: '23:59',
          inscricaoIndividualInicio:
            event.registrationIndividualStart || new Date(),
          inscricaoIndividualFim: event.registrationIndividualEnd || new Date(),
          inscricaoIndividualHoraInicio: '00:00',
          inscricaoIndividualHoraFim: '23:59',
          imagem: [],
          logoEvento: [],
          logosRealizadores: [],
          logosApoiadores: [],
        })
      } else {
        toast.error('Evento não encontrado.')
        navigate('/area-do-produtor/cadastro-basico/evento')
      }
    }
  }, [isEditing, id, getEventById, navigate, user, form])

  useEffect(() => {
    if (isCreating && user?.name) {
      form.setValue('nomeProdutor', user.name)
    }
  }, [user, form, isCreating])

  const watchedValues = form.watch()
  const progress = useMemo(() => {
    const requiredFields: (keyof EventFormValues)[] = [
      'name',
      'textoInstitucional',
      'dataInicio',
      'horaInicio',
      'dataFim',
      'horaFim',
      'inscricaoColetivaInicio',
      'inscricaoColetivaFim',
      'inscricaoIndividualInicio',
      'inscricaoIndividualFim',
    ]
    const filled = requiredFields.filter((key) => {
      const val = watchedValues[key]
      return val !== undefined && val !== '' && val !== null
    }).length
    return Math.min(100, Math.round((filled / requiredFields.length) * 100))
  }, [watchedValues])

  if (isCreating && !hasPermission('criar_evento')) return <AccessDenied />
  if (isEditing && !hasPermission('editar_evento')) return <AccessDenied />

  const getSectionStatus = (fields: (keyof EventFormValues)[]) => {
    const { errors } = form.formState
    const hasError = fields.some((field) => !!errors[field])
    if (hasError) return 'error'
    const isComplete = fields.every((field) => {
      const val = watchedValues[field]
      if (Array.isArray(val)) return true
      return val !== undefined && val !== '' && val !== null
    })
    return isComplete ? 'complete' : 'incomplete'
  }

  const renderSectionIcon = (status: 'error' | 'complete' | 'incomplete') => {
    if (status === 'error')
      return (
        <div className="bg-red-100 p-1 rounded-full">
          <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
        </div>
      )
    if (status === 'complete')
      return (
        <div className="bg-green-100 p-1 rounded-full">
          <CheckCircle2 className="h-4 w-4 text-success" />
        </div>
      )
    return <Circle className="h-6 w-6 text-muted-foreground/30" />
  }

  const processSubmit = async (
    data: EventFormValues,
    status: 'draft' | 'published',
  ) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const eventData = {
      name: data.name,
      startDate: data.dataInicio,
      endDate: data.dataFim,
      startTime: data.horaInicio,
      endTime: data.horaFim,
      location: 'Local a definir',
      registrations: 0,
      capacity: 1000,
      status: status,
      description: data.textoInstitucional,
      producerName: data.nomeProdutor,
      producerDescription: data.descricaoProdutor,
      registrationCollectiveStart: data.inscricaoColetivaInicio,
      registrationCollectiveEnd: data.inscricaoColetivaFim,
      registrationIndividualStart: data.inscricaoIndividualInicio,
      registrationIndividualEnd: data.inscricaoIndividualFim,
    }
    if (isEditing && id) updateEvent(id, eventData)
    else addEvent(eventData)
    setIsSubmitting(false)
    navigate('/area-do-produtor/cadastro-basico/evento')
  }

  const onInvalid = (errors: any) => {
    toast.error('Verifique os campos destacados.')
    if (errors.name || errors.textoInstitucional) setActiveAccordion('item-1')
    else if (errors.dataInicio || errors.dataFim) setActiveAccordion('item-2')
    else if (errors.inscricaoColetivaFim) setActiveAccordion('item-3')
  }

  const publicUrl =
    isEditing && watchedValues.name
      ? `${window.location.origin}/evento/${generateSlug(watchedValues.name)}/${id}`
      : ''

  return (
    <div className="max-w-5xl mx-auto pb-28 relative animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 -ml-2 text-muted-foreground mb-2"
            onClick={() => navigate('/area-do-produtor/cadastro-basico/evento')}
          >
            <ArrowLeft className="h-3 w-3 mr-1" /> Voltar
          </Button>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {isEditing ? 'Editar Evento' : 'Criar Novo Evento'}
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure datas, inscrições e detalhes do evento.
          </p>
        </div>
        <div className="bg-card border p-4 rounded-xl shadow-subtle flex items-center gap-4 min-w-[200px]">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/30"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={cn(
                  'transition-all duration-1000',
                  progress === 100 ? 'text-success' : 'text-primary',
                )}
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold">{progress}%</span>
          </div>
          <div>
            <p className="text-sm font-medium">Completude</p>
            <p className="text-xs text-muted-foreground">do formulário</p>
          </div>
        </div>
      </div>

      {publicUrl && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden w-full">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full shrink-0">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-blue-600 uppercase mb-0.5">
                Link Público
              </p>
              <a
                href={publicUrl}
                target="_blank"
                className="text-sm font-medium hover:underline truncate block flex items-center gap-1 group"
              >
                {publicUrl}
                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
              </a>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(publicUrl)
              toast.success('Link copiado!')
            }}
            className="shrink-0 gap-2"
          >
            <Copy className="h-4 w-4" /> Copiar
          </Button>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            (data) => processSubmit(data, 'published'),
            onInvalid,
          )}
          className="space-y-6"
        >
          <Accordion
            type="single"
            collapsible
            value={activeAccordion}
            onValueChange={setActiveAccordion}
            className="w-full space-y-6"
          >
            {/* Identity Section */}
            <AccordionItem
              value="item-1"
              className="border rounded-xl bg-card shadow-card px-1"
            >
              <AccordionTrigger className="hover:no-underline py-5 px-5">
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg">Informações Básicas</div>
                    <p className="text-sm text-muted-foreground font-normal">
                      Nome, logos e descrição.
                    </p>
                  </div>
                  <div className="mr-4">
                    {renderSectionIcon(
                      getSectionStatus(['name', 'textoInstitucional']),
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-8 pt-2 border-t border-dashed mx-2">
                <EventBasicInfo />
              </AccordionContent>
            </AccordionItem>

            {/* Dates Section */}
            <AccordionItem
              value="item-2"
              className="border rounded-xl bg-card shadow-card px-1"
            >
              <AccordionTrigger className="hover:no-underline py-5 px-5">
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg">Datas e Horários</div>
                    <p className="text-sm text-muted-foreground font-normal">
                      Início e fim do evento.
                    </p>
                  </div>
                  <div className="mr-4">
                    {renderSectionIcon(
                      getSectionStatus(['dataInicio', 'dataFim']),
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-8 pt-2 border-t border-dashed mx-2">
                <EventDateFields />
              </AccordionContent>
            </AccordionItem>

            {/* Registration Section */}
            <AccordionItem
              value="item-3"
              className="border rounded-xl bg-card shadow-card px-1"
            >
              <AccordionTrigger className="hover:no-underline py-5 px-5">
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg">
                      Períodos de Inscrição
                    </div>
                    <p className="text-sm text-muted-foreground font-normal">
                      Configuração de datas para inscrições.
                    </p>
                  </div>
                  <div className="mr-4">
                    {renderSectionIcon(
                      getSectionStatus([
                        'inscricaoColetivaFim',
                        'inscricaoIndividualFim',
                      ]),
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-8 pt-2 border-t border-dashed mx-2">
                <EventRegistrationFields />
              </AccordionContent>
            </AccordionItem>

            {/* Producer Section */}
            <AccordionItem
              value="item-4"
              className="border rounded-xl bg-card shadow-card px-1"
            >
              <AccordionTrigger className="hover:no-underline py-5 px-5">
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <Contact className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg">Contato & Produtor</div>
                    <p className="text-sm text-muted-foreground font-normal">
                      Informações de contato.
                    </p>
                  </div>
                  <div className="mr-4">
                    {renderSectionIcon(
                      watchedValues.descricaoProdutor
                        ? 'complete'
                        : 'incomplete',
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-8 pt-2 border-t border-dashed mx-2">
                <EventProducerFields />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t p-4 z-40 shadow-lg md:pl-72">
            <div className="container max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                className="w-full md:w-auto hover:text-destructive"
                onClick={() =>
                  navigate('/area-do-produtor/cadastro-basico/evento')
                }
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 md:flex-none"
                  onClick={async () => {
                    const isValid = await form.trigger(['name'])
                    if (isValid) processSubmit(form.getValues(), 'draft')
                    else toast.error('Preencha o nome para salvar rascunho.')
                  }}
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" /> Rascunho
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 md:flex-none"
                  onClick={async () => {
                    if (await form.trigger()) setShowPreview(true)
                    else onInvalid(form.formState.errors)
                  }}
                  disabled={isSubmitting}
                >
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
                <Button
                  type="submit"
                  className="flex-1 md:flex-none min-w-[160px]"
                  disabled={isSubmitting}
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Processando...' : 'Publicar'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0 bg-transparent border-none shadow-none">
          <EventPreview
            data={form.getValues()}
            onClose={() => setShowPreview(false)}
            onPublish={() => {
              setShowPreview(false)
              form.handleSubmit((d) => processSubmit(d, 'published'))()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
