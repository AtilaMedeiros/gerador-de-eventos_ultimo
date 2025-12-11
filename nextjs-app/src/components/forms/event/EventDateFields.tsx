import { useFormContext } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
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

export function EventDateFields() {
    const { control, getValues } = useFormContext<EventFormValues>()

    return (
        <div className="space-y-8 mt-4">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Start Date Block */}
                <div className="space-y-4 bg-green-50/50 border border-green-100 p-6 rounded-xl transition-all hover:shadow-md">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <h4 className="font-bold text-lg">Início do Evento</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={control}
                            name="dataInicio"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Data de Início</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal h-11 bg-white hover:bg-green-50/50',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'P', { locale: ptBR })
                                                    ) : (
                                                        <span>Selecione a data</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="horaInicio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Horário</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            className="h-11 bg-white hover:bg-green-50/50"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* End Date Block */}
                <div className="space-y-4 bg-red-50/50 border border-red-100 p-6 rounded-xl transition-all hover:shadow-md">
                    <div className="flex items-center gap-2 text-red-700 mb-2">
                        <div className="h-2 w-2 bg-red-500 rounded-full" />
                        <h4 className="font-bold text-lg">Término do Evento</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={control}
                            name="dataFim"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Data de Fim</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal h-11 bg-white hover:bg-red-50/50',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'P', { locale: ptBR })
                                                    ) : (
                                                        <span>Selecione a data</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    getValues('dataInicio')
                                                        ? date < getValues('dataInicio')
                                                        : false
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="horaFim"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Horário</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            className="h-11 bg-white hover:bg-red-50/50"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
