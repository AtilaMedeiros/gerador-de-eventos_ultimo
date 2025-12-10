'use client'

import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useViaCEP } from '@/hooks/useViaCEP'
import { Loader2 } from 'lucide-react'

interface CEPInputProps {
    form: UseFormReturn<any>
    name?: string
    label?: string
    onAddressFetched?: (address: {
        street: string
        neighborhood: string
        city: string
        state: string
    }) => void
}

export function CEPInput({
    form,
    name = 'cep',
    label = 'CEP',
    onAddressFetched
}: CEPInputProps) {
    const { fetchAddress, formatCEP, loading, error } = useViaCEP()
    const cepValue = form.watch(name)

    useEffect(() => {
        const cleanCEP = cepValue?.replace(/\D/g, '')

        if (cleanCEP?.length === 8) {
            fetchAddress(cleanCEP).then((address) => {
                if (address && onAddressFetched) {
                    onAddressFetched(address)
                }
            })
        }
    }, [cepValue])

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                {...field}
                                placeholder="00000-000"
                                maxLength={9}
                                onChange={(e) => {
                                    const formatted = formatCEP(e.target.value)
                                    field.onChange(formatted)
                                }}
                            />
                            {loading && (
                                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                        </div>
                    </FormControl>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
