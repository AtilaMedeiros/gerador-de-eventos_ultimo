'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EventCreationForm } from '@/components/forms/event/EventCreationForm'
import AssociateModalities from '@/components/forms/event/AssociateModalities'
import ApplyVisualIdentity from '@/components/forms/event/ApplyVisualIdentity'

import { cn } from '@/lib/utils'
import { Check, Layout, List, Settings } from 'lucide-react'

// Wizard Steps Definition
const WIZARD_STEPS = [
    { id: 'details', label: 'Informações', icon: Settings },
    { id: 'modalities', label: 'Modalidades', icon: List },
    { id: 'identity', label: 'Identidade', icon: Layout },
]

function EventWizardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentStepId = searchParams.get('step') || 'details'
    const eventId = searchParams.get('eventId')

    const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStepId)

    // Determine which component to render
    const renderStep = () => {
        switch (currentStepId) {
            case 'details':
                return (
                    <EventCreationForm
                        isWizard={true}
                        eventIdProp={eventId || undefined}
                        onNext={(createdEventId) => {
                            const params = new URLSearchParams(searchParams.toString())
                            params.set('step', 'modalities')
                            if (createdEventId) {
                                params.set('eventId', createdEventId)
                            }
                            router.push(`?${params.toString()}`)
                        }}
                    />
                )
            case 'modalities':
                return (
                    <AssociateModalities
                        isWizard={true}
                        eventId={eventId || undefined}
                        onBack={() => {
                            const params = new URLSearchParams(searchParams.toString())
                            params.set('step', 'details')
                            router.push(`?${params.toString()}`)
                        }}
                        onNext={() => {
                            const params = new URLSearchParams(searchParams.toString())
                            params.set('step', 'identity')
                            router.push(`?${params.toString()}`)
                        }}
                    />
                )
            case 'identity':
                return (
                    <ApplyVisualIdentity
                        isWizard={true}
                        eventId={eventId || undefined}
                        onBack={() => {
                            const params = new URLSearchParams(searchParams.toString())
                            params.set('step', 'modalities')
                            router.push(`?${params.toString()}`)
                        }}
                        onFinish={() => {
                            router.push('/area-do-produtor/eventos')
                        }}
                    />
                )
            default:
                return null
        }
    }

    // Handle direct navigation via steps
    const handleStepClick = (stepId: string) => {
        // Prevent skipping steps if no eventId exists yet (except going back to 'details')
        if (!eventId && stepId !== 'details') {
            return
        }

        const params = new URLSearchParams(searchParams.toString())
        params.set('step', stepId)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="max-w-full mx-auto h-[calc(100vh-10rem)] flex flex-col bg-background/50 rounded-lg border shadow-sm overflow-hidden animate-fade-in">
            {/* Wizard Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 shrink-0">
                <div className="container mx-auto py-4 px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Title Section */}
                        <div className="min-w-[240px]">
                            <h2 className="text-2xl font-bold tracking-tight">
                                {currentStepId === 'details' && (eventId ? "Editar Evento" : "Cadastrar Evento")}
                                {currentStepId === 'modalities' && "Associar Modalidades"}
                                {currentStepId === 'identity' && "Identidade Visual"}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {currentStepId === 'details' && "Dados gerais do evento."}
                                {currentStepId === 'modalities' && "Selecione as modalidades."}
                                {currentStepId === 'identity' && "Personalize a aparência."}
                            </p>
                        </div>

                        {/* Separator */}
                        <div className="hidden md:block h-10 w-px bg-border" />

                        {/* Progress Bar */}
                        <div className="flex-1 max-w-3xl">
                            <div className="relative flex items-center justify-between">
                                {/* Steps */}
                                {WIZARD_STEPS.map((step, index) => {
                                    const isActive = step.id === currentStepId
                                    const isCompleted = index < currentStepIndex
                                    const isAccessible = !!eventId || index === 0
                                    const isLastStep = index === WIZARD_STEPS.length - 1

                                    return (
                                        <div key={step.id} className="flex items-center flex-1">
                                            {/* Step Icon and Label */}
                                            <div
                                                className={cn(
                                                    "flex flex-col items-center cursor-pointer transition-opacity",
                                                    !isAccessible && "opacity-50 cursor-not-allowed pointer-events-none"
                                                )}
                                                onClick={() => isAccessible && handleStepClick(step.id)}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                                                        isActive && 'border-primary bg-primary text-primary-foreground scale-110 shadow-md',
                                                        isCompleted && 'border-primary bg-primary text-primary-foreground',
                                                        !isActive && !isCompleted && 'border-gray-300 bg-background text-muted-foreground'
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
                                                        "text-[10px] mt-1 font-medium uppercase tracking-wider transition-colors duration-200 whitespace-nowrap",
                                                        isActive ? "text-primary" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {step.label}
                                                </span>
                                            </div>

                                            {/* Connecting Line (if not last step) */}
                                            {!isLastStep && (
                                                <div className="flex-1 h-0.5 bg-muted rounded-full" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content - Full Height */}
            <div className="flex-1 overflow-y-auto">
                <div className="h-full animate-in fade-in zoom-in-95 duration-300">
                    {renderStep()}
                </div>
            </div>
        </div>
    )
}

export default function EventWizardPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Carregando wizard...</div>}>
            <EventWizardContent />
        </Suspense>
    )
}
