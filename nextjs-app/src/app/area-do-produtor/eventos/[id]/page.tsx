'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useParams } from 'next/navigation'
import {
    ArrowLeft,
    Eye,
    Save,
    Rocket,
    ExternalLink,
    Globe,
    Copy,
    ImageIcon,
    CalendarDays,
    Users,
    Contact,
    X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { EventPreview } from '@/components/EventPreview'
import { useAuth } from '@/contexts/AuthContext'
import { useEvent } from '@/contexts/EventContext'
import { eventFormSchema, type EventFormValues } from '@/components/forms/event/schemas'

// Import sub-components
import { EventBasicInfo } from '@/components/forms/event/EventBasicInfo'
import { EventDateFields } from '@/components/forms/event/EventDateFields'
import { EventRegistrationFields } from '@/components/forms/event/EventRegistrationFields'
import { EventProducerFields } from '@/components/forms/event/EventProducerFields'

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })
}

const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

export default function EventForm({
    isWizard = false,
    onNext,
    eventIdProp,
}: {
    isWizard?: boolean
    onNext?: (id: string) => void
    eventIdProp?: string
}) {
    const router = useRouter()
    const params = useParams()
    const paramId = params?.id as string | undefined
    const { user, hasPermission } = useAuth()
    const { createEvent, updateEvent, getEventById } = useEvent()

    // Prioritize prop eventId, then paramId
    const id = eventIdProp || paramId
    const isEditing = !!id && id !== 'novo'
    const isCreating = !id || id === 'novo'

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

    // Hook específico para lidar com hidratação do form apenas no cliente
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (isClient && isEditing && id) {
            const event = getEventById(id)
            if (event) {
                // Safe date parsing helper
                const parseDate = (dateVal: string | Date | undefined) => {
                    if (!dateVal) return new Date();
                    return new Date(dateVal);
                };

                form.reset({
                    name: event.name,
                    textoInstitucional: event.description || '',
                    nomeProdutor: event.producerName || user?.name || 'Produtor',
                    descricaoProdutor: event.producerDescription || '',
                    status: (event.status as 'draft' | 'published' | 'paused' | 'ended' | 'deleted') || 'draft',
                    dataInicio: parseDate(event.startDate),
                    horaInicio: event.startTime || '08:00',
                    dataFim: parseDate(event.endDate),
                    horaFim: event.endTime || '18:00',
                    inscricaoColetivaInicio:
                        parseDate(event.registrationCollectiveStart),
                    inscricaoColetivaFim: parseDate(event.registrationCollectiveEnd),
                    inscricaoColetivaHoraInicio: '00:00',
                    inscricaoColetivaHoraFim: '23:59',
                    inscricaoIndividualInicio:
                        parseDate(event.registrationIndividualStart),
                    inscricaoIndividualFim: parseDate(event.registrationIndividualEnd),
                    inscricaoIndividualHoraInicio: '00:00',
                    inscricaoIndividualHoraFim: '23:59',
                    imagem: [], // Reset to empty to match File expects. If user doesn't upload new, keep old.
                    logoEvento: [],
                    logosRealizadores: [],
                    logosApoiadores: [],
                })
            } else {
                toast.error('Evento não encontrado.')
                router.push('/area-do-produtor/eventos')
            }
        }
    }, [isClient, isEditing, id, getEventById, router, user, form])

    useEffect(() => {
        if (isClient && isCreating && user?.name) {
            // Only set if not already dirty to avoid overwriting user input
            if (!form.getFieldState('nomeProdutor').isDirty) {
                form.setValue('nomeProdutor', user.name)
            }
        }
    }, [isClient, user, form, isCreating])

    const watchedValues = form.watch()

    if (isClient && isCreating && !hasPermission('criar_evento')) {
        return <div className="p-8 text-center text-red-500">Acesso Negado: Você não tem permissão para criar eventos.</div>
    }
    if (isClient && isEditing && !hasPermission('editar_evento')) {
        return <div className="p-8 text-center text-red-500">Acesso Negado: Você não tem permissão para editar eventos.</div>
    }

    const processSubmit = async (
        data: EventFormValues,
        status: 'draft' | 'published',
    ) => {
        setIsSubmitting(true)
        const currentEvent = isEditing && id ? getEventById(id) : null;

        let coverImage = currentEvent?.coverImage;
        if (data.imagem && data.imagem.length > 0) {
            try {
                coverImage = await convertFileToBase64(data.imagem[0] as File)
            } catch (error) {
                console.error('Error converting image to base64', error)
                toast.error('Erro ao processar imagem de capa.')
            }
        }

        let realizerLogos = currentEvent?.realizerLogos || [];
        if (data.logosRealizadores && data.logosRealizadores.length > 0) {
            try {
                const promises = data.logosRealizadores.map((file: File | string) => {
                    if (typeof file === 'string') return file;
                    return convertFileToBase64(file);
                });
                realizerLogos = await Promise.all(promises);
            } catch (error) {
                console.error('Error converting realizer logos', error)
            }
        }

        let supporterLogos = currentEvent?.supporterLogos || [];
        if (data.logosApoiadores && data.logosApoiadores.length > 0) {
            try {
                const promises = data.logosApoiadores.map((file: File | string) => {
                    if (typeof file === 'string') return file;
                    return convertFileToBase64(file);
                });
                supporterLogos = await Promise.all(promises);
            } catch (error) {
                console.error('Error converting supporter logos', error)
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventData: any = {
            name: data.name,
            slug: generateSlug(data.name),
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
            coverImage: coverImage,
            realizerLogos: realizerLogos,
            supporterLogos: supporterLogos,
        }
        if (isEditing && id) {
            await updateEvent(id, eventData)
            toast.success('Evento atualizado!')
            if (isWizard && onNext) {
                onNext(id)
            } else {
                router.push('/area-do-produtor/eventos')
            }
        } else {
            const newEvent = await createEvent(eventData)
            toast.success('Evento criado!')
            if (isWizard && onNext) {
                onNext(newEvent.id)
            } else {
                router.push('/area-do-produtor/eventos')
            }
        }
        setIsSubmitting(false)
    }

    const onInvalid = () => {
        toast.error('Verifique os campos destacados.')
    }

    const publicUrl =
        isEditing && watchedValues.name && typeof window !== 'undefined'
            ? `${window.location.origin}/evento/${generateSlug(watchedValues.name)}/${id}`
            : ''

    if (!isClient) {
        return <div className="flex items-center justify-center p-24"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
    }

    return (
        <div className={cn("max-w-full mx-auto flex flex-col pt-6", isWizard ? "h-full" : "h-[calc(100vh-5rem)]")}>
            {/* Header */}
            {!isWizard && (
                <div className="flex items-center justify-between mb-8 shrink-0 px-1">
                    <div className="flex items-center gap-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{isEditing ? 'Editar Evento' : 'Novo Evento'}</h2>
                            <p className="text-muted-foreground text-sm">
                                Configure datas, inscrições e detalhes do evento.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 scrollbar-thin pb-24">
                <div className="max-w-5xl mx-auto space-y-6">

                    {publicUrl && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                        <form className="space-y-6">

                            {/* Basic Info Section */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <ImageIcon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Informações Básicas</h3>
                                        <p className="text-sm text-muted-foreground">Nome, logos e descrição.</p>
                                    </div>
                                </div>
                                <EventBasicInfo />
                            </div>

                            {/* Dates Section */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <CalendarDays className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Datas e Horários</h3>
                                        <p className="text-sm text-muted-foreground">Início e fim do evento.</p>
                                    </div>
                                </div>
                                <EventDateFields />
                            </div>

                            {/* Registration Section */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Períodos de Inscrição</h3>
                                        <p className="text-sm text-muted-foreground">Configuração de datas para inscrições.</p>
                                    </div>
                                </div>
                                <EventRegistrationFields />
                            </div>

                            {/* Producer Section */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Contact className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Contato & Produtor</h3>
                                        <p className="text-sm text-muted-foreground">Informações de contato.</p>
                                    </div>
                                </div>
                                <EventProducerFields />
                            </div>

                        </form>
                    </Form>
                </div>
            </div>

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

            {/* Fixed Footer Actions */}
            <div className="fixed bottom-0 right-0 p-4 border-t bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-end gap-2 w-full lg:w-[calc(100%-16rem)] transition-all duration-300">
                <Button
                    variant="outline"
                    onClick={() => router.push('/area-do-produtor/eventos')}
                    disabled={isSubmitting}
                >
                    <X className="mr-2 h-4 w-4" /> Cancelar
                </Button>

                {/* Buttons visible ONLY if NOT Wizard */}
                {!isWizard && !isCreating && (
                    <>
                        <Button
                            variant="outline"
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
                            variant="secondary"
                            onClick={async () => {
                                const isValid = await form.trigger();
                                if (isValid) setShowPreview(true)
                                else onInvalid()
                            }}
                            disabled={isSubmitting}
                        >
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                    </>
                )}

                {/* Create Mode Buttons */}
                {!isWizard && isCreating && (
                    <Button
                        variant="secondary"
                        onClick={async () => {
                            const isValid = await form.trigger(); // Valida tudo
                            if (isValid) setShowPreview(true)
                            else onInvalid()
                        }}
                        disabled={isSubmitting}
                    >
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                )}


                <Button
                    onClick={form.handleSubmit(
                        (data) => processSubmit(data, 'published'),
                        onInvalid,
                    )}
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
                >
                    {isWizard ? (
                        <>Próximo <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></>
                    ) : (
                        <>
                            <Rocket className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Processando...' : (isEditing ? 'Atualizar Evento' : 'Publicar Evento')}
                        </>
                    )}
                </Button>
            </div>

        </div >
    )
}
