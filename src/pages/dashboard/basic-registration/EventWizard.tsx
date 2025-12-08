import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, ChevronRight, Layout, List, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import EventForm from './EventForm'
import AssociateModalities from '../event-config/AssociateModalities'
import ApplyVisualIdentity from '../event-config/ApplyVisualIdentity'

const steps = [
    {
        id: 1,
        title: 'Informações',
        description: 'Dados gerais',
        icon: Settings,
    },
    {
        id: 2,
        title: 'Modalidades',
        description: 'Categorias',
        icon: List,
    },
    {
        id: 3,
        title: 'Identidade',
        description: 'Aparência',
        icon: Layout,
    },
]

export default function EventWizard() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const currentStep = Number(searchParams.get('step')) || 1
    const eventId = searchParams.get('eventId') || undefined
    const [localEventId, setLocalEventId] = useState<string | undefined>(eventId)

    // Sync local state with URL param
    useEffect(() => {
        if (eventId) setLocalEventId(eventId)
    }, [eventId])

    const handleNextStep = (id?: string) => {
        const nextId = id || localEventId
        const nextStep = Math.min(currentStep + 1, steps.length)

        if (nextId) setLocalEventId(nextId)

        const params: any = { step: nextStep.toString() }
        if (nextId) params.eventId = nextId
        setSearchParams(params)
    }

    const handlePrevStep = () => {
        const prevStep = Math.max(currentStep - 1, 1)

        const params: any = { step: prevStep.toString() }
        if (localEventId) params.eventId = localEventId
        setSearchParams(params)
    }

    const handleFinish = () => {
        navigate('/area-do-produtor/evento')
    }

    return (
        <div className="max-w-full mx-auto h-[calc(100vh-10rem)] flex flex-col bg-background/50 rounded-lg border shadow-sm overflow-hidden">
            {/* Minimal Stepper Header */}
            {/* Wizard Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 shrink-0">
                <div className="container mx-auto py-4 px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Title Section */}
                        <div className="min-w-[240px]">
                            <h2 className="text-2xl font-bold tracking-tight">
                                {currentStep === 1 && (eventId ? "Editar Evento" : "Cadastrar Evento")}
                                {currentStep === 2 && "Associar Modalidades"}
                                {currentStep === 3 && "Identidade Visual"}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {currentStep === 1 && "Dados gerais do evento."}
                                {currentStep === 2 && "Selecione as modalidades."}
                                {currentStep === 3 && "Personalize a aparência."}
                            </p>
                        </div>

                        {/* Separator */}
                        <div className="hidden md:block h-10 w-px bg-border" />

                        {/* Progress Bar */}
                        <div className="flex-1 max-w-xl">
                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 rounded-full" />

                                {/* Steps */}
                                <ol className="relative z-10 flex justify-between w-full">
                                    {steps.map((step) => {
                                        const isActive = step.id === currentStep
                                        const isCompleted = step.id < currentStep

                                        return (
                                            <li key={step.id} className="flex flex-col items-center bg-background px-2">
                                                <div
                                                    className={cn(
                                                        'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                                                        isActive && 'border-primary bg-primary text-primary-foreground scale-110 shadow-md',
                                                        isCompleted && 'border-primary bg-primary text-primary-foreground',
                                                        !isActive && !isCompleted && 'border-muted-foreground/30 bg-background text-muted-foreground'
                                                    )}
                                                >
                                                    {isCompleted ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <step.icon className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <span
                                                    className={cn(
                                                        "text-[10px] mt-1 font-medium uppercase tracking-wider transition-colors duration-200",
                                                        isActive ? "text-primary" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {step.title}
                                                </span>
                                            </li>
                                        )
                                    })}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Content - Full Height */}
            <div className="flex-1 overflow-y-auto">
                {currentStep === 1 && (
                    <div className="h-full animate-in fade-in zoom-in-95 duration-300">
                        <EventForm
                            isWizard={true}
                            eventId={localEventId}
                            onNext={handleNextStep}
                        />
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="h-full animate-in fade-in zoom-in-95 duration-300">
                        <AssociateModalities
                            isWizard={true}
                            eventId={localEventId}
                            onNext={() => handleNextStep()}
                            onBack={handlePrevStep}
                        />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="h-full animate-in fade-in zoom-in-95 duration-300">
                        <ApplyVisualIdentity
                            isWizard={true}
                            eventId={localEventId}
                            onFinish={handleFinish}
                            onBack={handlePrevStep}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
