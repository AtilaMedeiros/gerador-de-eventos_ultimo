import { useFormContext } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Info, Users, Contact } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import type { EventFormValues } from '@/app/area-do-produtor/eventos/novo/schemas'

interface DateFieldProps {
    name: keyof EventFormValues
    label: string
}

const RegistrationDateField = ({ name, label }: DateFieldProps) => {
    const { control } = useFormContext<EventFormValues>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const castName = name as any; // Type assertion to bypass strict key check if necessary

    return (
        <FormField
            control={control}
            name={castName}
            render={({ field }) => (
                <FormItem className="col-span-2">
                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">
                        {label}
                    </FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal h-10',
                                        !field.value && 'text-muted-foreground',
                                    )}
                                >
                                    {field.value instanceof Date ? (
                                        format(field.value, 'P', { locale: ptBR })
                                    ) : (
                                        <span>Selecione</span>
                                    )}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={field.value as Date}
                                onSelect={field.onChange}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

const RegistrationTimeField = ({ name }: { name: keyof EventFormValues }) => {
    const { control } = useFormContext<EventFormValues>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const castName = name as any;

    return (
        <FormField
            control={control}
            name={castName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">
                        Hora
                    </FormLabel>
                    <FormControl>
                        <Input type="time" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export function EventRegistrationFields() {
    return (
        <div className="space-y-8 mt-4">
            <div className="flex gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm">
                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                    Defina os períodos de inscrição. O sistema bloqueará automaticamente
                    as inscrições após a data de término.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Collective Registration */}
                <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                    <div className="bg-muted/30 px-6 py-4 border-b flex justify-between items-center">
                        <h4 className="font-bold flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Inscrição Coletiva
                        </h4>
                        <span className="text-[10px] font-bold uppercase bg-background px-2 py-1 rounded border">
                            Equipes
                        </span>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <RegistrationDateField
                                name="inscricaoColetivaInicio"
                                label="Início das Inscrições"
                            />
                            <RegistrationTimeField name="inscricaoColetivaHoraInicio" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <RegistrationDateField
                                name="inscricaoColetivaFim"
                                label="Fim das Inscrições"
                            />
                            <RegistrationTimeField name="inscricaoColetivaHoraFim" />
                        </div>
                    </div>
                </div>

                {/* Individual Registration */}
                <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                    <div className="bg-muted/30 px-6 py-4 border-b flex justify-between items-center">
                        <h4 className="font-bold flex items-center gap-2">
                            <Contact className="h-4 w-4 text-primary" />
                            Inscrição Individual
                        </h4>
                        <span className="text-[10px] font-bold uppercase bg-background px-2 py-1 rounded border">
                            Atletas
                        </span>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <RegistrationDateField
                                name="inscricaoIndividualInicio"
                                label="Início das Inscrições"
                            />
                            <RegistrationTimeField name="inscricaoIndividualHoraInicio" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <RegistrationDateField
                                name="inscricaoIndividualFim"
                                label="Fim das Inscrições"
                            />
                            <RegistrationTimeField name="inscricaoIndividualHoraFim" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
