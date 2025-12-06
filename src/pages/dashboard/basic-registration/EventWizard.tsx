import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    const [currentStep, setCurrentStep] = useState(1)
    const [eventId, setEventId] = useState<string | undefined>(undefined)

    const handleNextStep = (id?: string) => {
        if (id) setEventId(id)
        setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleFinish = () => {
        navigate('/area-do-produtor/evento')
    }

    return (
        <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col bg-background/50">
            {/* Minimal Stepper Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 shrink-0">
                <div className="max-w-3xl mx-auto py-3 px-4">
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

            {/* Content Content - Full Height */}
            <div className="flex-1 overflow-hidden">
                {currentStep === 1 && (
                    <div className="h-full animate-in fade-in zoom-in-95 duration-300">
                        <EventForm
                            isWizard={true}
                            eventId={eventId}
                            onNext={handleNextStep}
                        />
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="h-full animate-in fade-in zoom-in-95 duration-300">
                        <AssociateModalities
                            isWizard={true}
                            eventId={eventId}
                            onNext={() => handleNextStep()}
                            onBack={handlePrevStep}
                        />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="h-full animate-in fade-in zoom-in-95 duration-300">
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
