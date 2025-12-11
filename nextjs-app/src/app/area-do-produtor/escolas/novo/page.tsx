'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, School, Save, Calendar } from 'lucide-react'
import { mockEvents } from '@/mocks/events'

// Basic CEP validation/mask would go here

export default function NewSchoolPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Form state (in a real app, use React Hook Form + Zod)
    const [formData, setFormData] = useState({
        name: '',
        inep: '',
        cnpj: '',
        type: 'Publica',
        sphere: 'Municipal',
        directorName: '',
        responsibleName: '',
        cep: '',
        address: '',
        neighborhood: '',
        municipality: '',
        landline: '',
        mobile: '',
        email: '',
        eventId: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value }))
    }

    const handleSphereChange = (value: string) => {
        setFormData(prev => ({ ...prev, sphere: value }))
    }

    const handleEventChange = (value: string) => {
        setFormData(prev => ({ ...prev, eventId: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.success('Escola cadastrada com sucesso!')
        setIsLoading(false)
        router.push('/area-do-produtor/escolas')
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full hover:bg-primary/10"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Nova Escola
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Preencha os dados abaixo para cadastrar uma nova instituição.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. School Identification */}
                <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <School className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-primary/80">Identificação da Escola</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="name">Nome da Escola</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Ex: Escola Municipal do Saber"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="inep">Código INEP</Label>
                            <Input
                                id="inep"
                                name="inep"
                                placeholder="12345678"
                                value={formData.inep}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                                id="cnpj"
                                name="cnpj"
                                placeholder="00.000.000/0000-00"
                                value={formData.cnpj}
                                onChange={handleChange}
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>

                        {/* Type & Sphere */}
                        <div className="space-y-4">
                            <Label>Tipo de Escola</Label>
                            <RadioGroup
                                value={formData.type}
                                onValueChange={handleTypeChange}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Publica" id="publica" />
                                    <Label htmlFor="publica" className="cursor-pointer">Pública</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Privada" id="privada" />
                                    <Label htmlFor="privada" className="cursor-pointer">Privada</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <Label>Esfera Administrativa</Label>
                            <RadioGroup
                                value={formData.sphere}
                                onValueChange={handleSphereChange}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Municipal" id="municipal" />
                                    <Label htmlFor="municipal" className="cursor-pointer">Municipal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Estadual" id="estadual" />
                                    <Label htmlFor="estadual" className="cursor-pointer">Estadual</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Federal" id="federal" />
                                    <Label htmlFor="federal" className="cursor-pointer">Federal</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <Label>Evento Vinculado</Label>
                            <Select onValueChange={handleEventChange} value={formData.eventId}>
                                <SelectTrigger className="bg-white/60 dark:bg-black/40">
                                    <SelectValue placeholder="Selecione o evento..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockEvents.map(event => (
                                        <SelectItem key={event.id} value={event.id}>
                                            <span className="flex items-center gap-2">
                                                {event.name}
                                                <span className={`text-xs ml-2 px-1.5 py-0.5 rounded-full border ${event.status === 'published' ? 'border-green-200 text-green-600 bg-green-50' :
                                                        event.status === 'closed' ? 'border-red-200 text-red-600 bg-red-50' :
                                                            'border-yellow-200 text-yellow-600 bg-yellow-50'
                                                    }`}>
                                                    {event.status === 'published' ? 'Publicado' : event.status === 'closed' ? 'Fechado' : 'Rascunho'}
                                                </span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Selecione o evento para o qual esta escola está sendo cadastrada.</p>
                        </div>
                    </div>
                </div>

                {/* 2. Management & Contact */}
                <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <School className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-primary/80">Gestão e Contato</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="directorName">Nome do Diretor(a)</Label>
                            <Input
                                id="directorName"
                                name="directorName"
                                placeholder="Nome completo"
                                value={formData.directorName}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="responsibleName">Nome do Responsável</Label>
                            <Input
                                id="responsibleName"
                                name="responsibleName"
                                placeholder="Coordenador ou Professor"
                                value={formData.responsibleName}
                                onChange={handleChange}
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Institucional</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="escola@exemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="landline">Telefone Fixo</Label>
                            <Input
                                id="landline"
                                name="landline"
                                placeholder="(00) 0000-0000"
                                value={formData.landline}
                                onChange={handleChange}
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Celular / WhatsApp</Label>
                            <Input
                                id="mobile"
                                name="mobile"
                                placeholder="(00) 90000-0000"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Address */}
                <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <School className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-primary/80">Endereço</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input
                                id="cep"
                                name="cep"
                                placeholder="00000-000"
                                value={formData.cep}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Rua, Número, Complemento"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="neighborhood">Bairro</Label>
                            <Input
                                id="neighborhood"
                                name="neighborhood"
                                placeholder="Bairro"
                                value={formData.neighborhood}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="municipality">Município</Label>
                            <Input
                                id="municipality"
                                name="municipality"
                                placeholder="Cidade"
                                value={formData.municipality}
                                onChange={handleChange}
                                required
                                className="bg-white/60 dark:bg-black/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 min-w-[150px]"
                    >
                        {isLoading ? 'Salvando...' : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Salvar Escola
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
