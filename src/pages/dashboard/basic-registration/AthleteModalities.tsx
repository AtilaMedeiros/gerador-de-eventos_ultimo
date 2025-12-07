import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Trash2, Trophy } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// Mock Data for Selects
const MODALITY_TYPES = ['Coletiva', 'Individual'] as const

const MODALITIES = {
    Coletiva: ['Futebol', 'Futsal', 'Vôlei', 'Basquete', 'Handebol'],
    Individual: ['Atletismo', 'Natação', 'Xadrez', 'Tênis de Mesa', 'Judô'],
}

const PROVAS = {
    Natação: ['Nado Livre', 'Nado Costas', 'Nado Peito', 'Borboleta'],
    Atletismo: ['100m Rasos', 'Salto em Distância', 'Arremesso de Peso'],
    Judô: ['Leve', 'Médio', 'Pesado'],
}

// Mock Data for List
const MOCK_LINKED_MODALITIES = [
    {
        id: 1,
        type: 'Coletiva',
        modality: 'Futebol',
        prova: '-',
        sex: 'Feminino',
        ageRange: '12 a 14',
    },
    {
        id: 2,
        type: 'Individual',
        modality: 'Natação',
        prova: 'Nado Costas',
        sex: 'Feminino',
        ageRange: '12 a 14',
    },
    {
        id: 3,
        type: 'Individual',
        modality: 'Natação',
        prova: 'Nado Livre',
        sex: 'Feminino',
        ageRange: '12 a 14',
    },
]

const formSchema = z.object({
    type: z.enum(['Coletiva', 'Individual']),
    modality: z.string().min(1, 'Selecione uma modalidade'),
    prova: z.string().optional(),
})

export default function AthleteModalities() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [linkedModalities, setLinkedModalities] = useState(MOCK_LINKED_MODALITIES)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modality: '',
            prova: '',
        },
    })

    const selectedType = form.watch('type')
    const selectedModality = form.watch('modality')

    // Reset fields when parent selection changes
    const onTypeChange = (value: string) => {
        form.setValue('type', value as any)
        form.setValue('modality', '')
        form.setValue('prova', '')
    }

    const availableModalities = selectedType ? MODALITIES[selectedType] : []
    const availableProvas = selectedModality && selectedModality in PROVAS
        ? PROVAS[selectedModality as keyof typeof PROVAS]
        : []

    // Logic to show "Prova" field: if manual HTML logic had "display: none", we simulate logic here.
    // Usually individual sports have provas.
    const showProva = availableProvas.length > 0

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // Simulate adding
        const newModality = {
            id: Math.random(),
            type: values.type,
            modality: values.modality,
            prova: values.prova || '-',
            sex: 'Feminino', // Should come from athlete data
            ageRange: '12 a 14', // Should come from athlete/category
        }

        setLinkedModalities([...linkedModalities, newModality])
        toast.success('Modalidade vinculada com sucesso!')
        form.reset({
            type: values.type, // Keep type for easier multiple entries? Or reset all. Let's reset relevant.
            modality: '',
            prova: ''
        })
    }

    const handleDelete = (id: number) => {
        setLinkedModalities(linkedModalities.filter(m => m.id !== id))
        toast.success('Vinculação removida com sucesso.')
    }

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Background Gradients */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/area-do-produtor/atletas')}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Vincular Modalidade</h2>
                    <p className="text-muted-foreground text-lg">Gerencie as modalidades deste atleta.</p>
                </div>
            </div>

            <Card className="border-blue-100/50 dark:border-blue-900/30 bg-white/40 dark:bg-black/40 backdrop-blur-xl transition-all duration-300">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2 text-primary">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        Adicionar Nova Modalidade
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select
                                            onValueChange={onTypeChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white/50 dark:bg-black/20 border-blue-200/60 dark:border-blue-800/60 focus:ring-primary/20 h-11">
                                                    <SelectValue placeholder="Escolha um Tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {MODALITY_TYPES.map(type => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="modality"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Modalidade</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!selectedType}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-white/50 dark:bg-black/20 border-blue-200/60 dark:border-blue-800/60 focus:ring-primary/20 h-11">
                                                    <SelectValue placeholder={selectedType ? "Selecione a modalidade" : "Escolha primeiro um Tipo"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableModalities.map(modality => (
                                                    <SelectItem key={modality} value={modality}>
                                                        {modality}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {showProva && (
                                <FormField
                                    control={form.control}
                                    name="prova"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prova</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a prova" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableProvas.map(prova => (
                                                        <SelectItem key={prova} value={prova}>
                                                            {prova}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="pt-2">
                                <Button type="submit" className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]">
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar Vinculação
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="border-blue-100/50 dark:border-blue-900/30 bg-white/40 dark:bg-black/40 backdrop-blur-xl mt-8 overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex flex-col">
                        <CardTitle className="text-xl text-primary">Modalidades Cadastradas</CardTitle>
                        <CardDescription>Relação de Modalidades alocadas do Atleta</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden overflow-x-auto">
                        <Table style={{ tableLayout: 'fixed', minWidth: '100%' }}>
                            <TableHeader className="bg-primary/5">
                                <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
                                    <TableHead className="font-semibold text-primary/80 h-12 w-[120px]">Tipo</TableHead>
                                    <TableHead className="font-semibold text-primary/80 h-12 w-[200px]">Modalidade</TableHead>
                                    <TableHead className="font-semibold text-primary/80 h-12 w-[200px]">Prova</TableHead>
                                    <TableHead className="font-semibold text-primary/80 h-12 w-[120px] text-center">Naipe</TableHead>
                                    <TableHead className="font-semibold text-primary/80 h-12 w-[140px] text-center">Faixa de Idade</TableHead>
                                    <TableHead className="text-right font-semibold text-primary/80 h-12 w-[80px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {linkedModalities.length > 0 ? (
                                    linkedModalities.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group">
                                            <TableCell className="font-medium h-12 py-0">
                                                <div className="flex items-center h-full">
                                                    <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                                                        {item.type}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="h-12 py-0">
                                                <div className="flex items-center h-full text-muted-foreground font-medium">
                                                    {item.modality}
                                                </div>
                                            </TableCell>
                                            <TableCell className="h-12 py-0">
                                                <div className="flex items-center h-full text-muted-foreground">
                                                    {item.prova}
                                                </div>
                                            </TableCell>
                                            <TableCell className="h-12 py-0 text-center">
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    {item.sex}
                                                </div>
                                            </TableCell>
                                            <TableCell className="h-12 py-0 text-center">
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    {item.ageRange}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right h-12 py-0">
                                                <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity h-full items-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                        onClick={() => handleDelete(item.id)}
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-lg">
                                            Nenhuma modalidade vinculada a este atleta.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
