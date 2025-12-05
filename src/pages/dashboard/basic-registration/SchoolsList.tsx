import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Search, Download, Plus, Edit, Trash2, School } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const MOCK_SCHOOLS = [
    {
        id: 1,
        name: 'Escola Municipal de Esportes',
        city: 'São Paulo',
        state: 'SP',
        responsible: 'João Silva',
        athletes: 45,
    },
    {
        id: 2,
        name: 'Colégio Estadual do Saber',
        city: 'Rio de Janeiro',
        state: 'RJ',
        responsible: 'Maria Santos',
        athletes: 32,
    },
    {
        id: 3,
        name: 'Instituto Atlético',
        city: 'Belo Horizonte',
        state: 'MG',
        responsible: 'Pedro Costa',
        athletes: 60,
    },
]

export default function SchoolsList() {
    const navigate = useNavigate()

    const handleAction = (action: string) => {
        toast.info(`Ação ${action} simulada com sucesso.`)
    }

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Background Gradients */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Escolas
                    </h2>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Gerencie as escolas e instituições cadastradas.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction('Exportar')}
                        className="backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
                    >
                        <Download className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Button
                        onClick={() => handleAction('Nova Escola')}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nova Escola
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                    <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                    placeholder="Pesquisar por nome, cidade ou responsável..."
                    className="pl-10 h-12 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left"
                />
            </div>

            <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-primary/5">
                        <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
                            <TableHead className="font-semibold text-primary/80 h-12">Nome</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Cidade/UF</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Responsável</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Atletas</TableHead>
                            <TableHead className="text-right font-semibold text-primary/80 h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_SCHOOLS.map((school) => (
                            <TableRow
                                key={school.id}
                                className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                            >
                                <TableCell className="font-medium h-12 py-0">
                                    <div className="flex items-center h-full">
                                        <School className="mr-2 h-4 w-4 text-primary/50" />
                                        <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                                            {school.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="h-12 py-0">
                                    <div className="flex items-center h-full text-muted-foreground">
                                        {school.city}/{school.state}
                                    </div>
                                </TableCell>
                                <TableCell className="h-12 py-0">
                                    <div className="flex items-center h-full text-muted-foreground">
                                        {school.responsible}
                                    </div>
                                </TableCell>
                                <TableCell className="h-12 py-0">
                                    <div className="flex items-center h-full font-mono text-muted-foreground">
                                        {school.athletes}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right h-12 py-0">
                                    <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity h-full items-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                                            onClick={() => handleAction('Editar')}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                            onClick={() => handleAction('Excluir')}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
