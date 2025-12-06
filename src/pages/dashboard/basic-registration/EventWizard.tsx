import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Layout, List, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import EventForm from './EventForm'
import AssociateModalities from '../event-config/AssociateModalities'
import ApplyVisualIdentity from '../event-config/ApplyVisualIdentity'
import { Button } from '@/components/ui/button'

const steps = [
    {
        id: 1,
        title: 'Informações Básicas',
        description: 'Dados gerais do evento',
        icon: Settings,
    },
    {
        id: 2,
        title: 'Modalidades',
        description: 'Defina as competições',
        icon: List,
    },
    {
        id: 3,
        title: 'Identidade Visual',
        description: 'Personalize a aparência',
        icon: Layout,
    },
]

export default function EventWizard() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [eventId, setEventId] = useState<string | undefined>(undefined)
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

    const handleNextStep = (id?: string) => {
        if (id) setEventId(id)
        setDirection('forward')
        setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }

    const handlePrevStep = () => {
        setDirection('backward')
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleFinish = () => {
        navigate('/area-do-produtor/evento')
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Criar Novo Evento
                </h1>
                <p className="text-muted-foreground">
                    Siga os passos para configurar seu evento completo.
                </p>
            </div>

            {/* Stepper */}
            <div className="mb-8">
                <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-muted">
                    <ol className="relative z-10 flex justify-between text-sm font-medium text-muted-foreground">
                        {steps.map((step, index) => {
                            const isActive = step.id === currentStep
                            const isCompleted = step.id < currentStep
                            const isLast = index === steps.length - 1

                            return (
                                <li
                                    key={step.id}
                                    className={cn(
                                        'flex items-center gap-2 bg-background p-2',
                                        isActive && 'text-primary',
                                        isCompleted && 'text-primary',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors',
                                            isActive && 'border-primary bg-primary text-primary-foreground',
                                            isCompleted &&
                                            'border-primary bg-primary text-primary-foreground',
                                            !isActive && !isCompleted && 'border-muted bg-background',
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <span>{step.id}</span>
                                        )}
                                    </span>
                                    <span className="hidden sm:inline-block">
                                        <span className="block font-bold">{step.title}</span>
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            {step.description}
                                        </span>
                                    </span>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>

            {/* Content */}
            <div className="bg-card border rounded-xl shadow-sm p-6 min-h-[600px]">
                {currentStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <EventForm
                            isWizard={true}
                            eventId={eventId}
                            onNext={handleNextStep}
                        />
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <AssociateModalities
                            isWizard={true}
                            eventId={eventId}
                            onNext={() => handleNextStep()}
                            onBack={handlePrevStep}
                        />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <ApplyVisualIdentity
                            isWizard={true}
                            eventId={eventId}
                            onFinish={handleFinish}
                            onBack={handlePrevStep}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
