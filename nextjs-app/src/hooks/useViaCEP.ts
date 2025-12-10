'use client'

import { useState, useEffect } from 'react'

interface ViaCEPResponse {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    erro?: boolean
}

export interface AddressData {
    street: string
    neighborhood: string
    city: string
    state: string
}

export function useViaCEP() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const validateCEP = (cep: string): boolean => {
        const cleanCEP = cep.replace(/\D/g, '')
        return cleanCEP.length === 8
    }

    const fetchAddress = async (cep: string): Promise<AddressData | null> => {
        const cleanCEP = cep.replace(/\D/g, '')

        if (!validateCEP(cep)) {
            setError('CEP inválido. Digite 8 dígitos.')
            return null
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)

            if (!response.ok) {
                throw new Error('Erro ao buscar CEP')
            }

            const data: ViaCEPResponse = await response.json()

            if (data.erro) {
                setError('CEP não encontrado')
                return null
            }

            return {
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
            }
        } catch (err) {
            setError('Erro ao buscar CEP. Tente novamente.')
            return null
        } finally {
            setLoading(false)
        }
    }

    const formatCEP = (value: string): string => {
        const clean = value.replace(/\D/g, '')
        if (clean.length <= 5) return clean
        return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`
    }

    return {
        fetchAddress,
        validateCEP,
        formatCEP,
        loading,
        error,
    }
}
