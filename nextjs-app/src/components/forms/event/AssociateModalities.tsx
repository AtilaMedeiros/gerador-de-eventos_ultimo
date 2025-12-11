'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, ArrowLeft, Plus, Edit, Copy, Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import ModalityForm from '@/components/forms/modality/ModalityForm'

export default function AssociateModalities({
    eventId: propEventId,
    isWizard = false,
    onNext,
    onBack,
}: {
    eventId?: string
    isWizard?: boolean
    onNext?: () => void
    onBack?: () => void
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams()


    const paramEventId = typeof params?.id === 'string' ? params.id : undefined;

    const eventId = propEventId || paramEventId || searchParams.get('eventId')

    const [selected, setSelected] = useState<string[]>([])
    const [showNewModalityModal, setShowNewModalityModal] = useState(false)
    const [editingModalityId, setEditingModalityId] = useState<string | null>(null)
    const { getEventById, getEventModalities, setEventModalities } = useEvent()
    const { modalities, deleteModality, createModality } = useModality() // Using createModality instead of addModality

    // Filtering & Sorting State
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(50)

    const event = eventId ? getEventById(eventId) : undefined

    const handleDuplicate = async (modality: any) => {
        const { id: _, ...rest } = modality
        await createModality({ ...rest, name: `${rest.name} (Cópia)` })
        toast.success("Modalidade duplicada com sucesso!")
    }

    useEffect(() => {
        if (!eventId) {
            if (isWizard) {
                // If wizard, maybe we are just initializing
            } else {
                toast.warning('Nenhum evento selecionado.', {
                    description: 'Retornando para a lista de eventos.',
                })
                router.push('/area-do-produtor/eventos')
            }
        } else {
            const existing = getEventModalities(eventId)
            if (existing && existing.length > 0) {
                setSelected(existing)
            }
        }
    }, [eventId, getEventModalities, router, isWizard])

    const toggle = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        )
    }

    const filteredModalities = useMemo(() => {
        return modalities.filter((mod) => {
            // Global Search
            const searchLower = searchTerm.toLowerCase()
            const matchesSearch =
                mod.name.toLowerCase().includes(searchLower) ||
                (mod.type || '').toLowerCase().includes(searchLower) ||
                mod.gender.toLowerCase().includes(searchLower)

            if (!matchesSearch) return false
            return true
        })
    }, [modalities, searchTerm])

    const sortedModalities = useMemo(() => {
        if (!sortConfig) return filteredModalities
        return [...filteredModalities].sort((a, b) => {
            const { key, direction } = sortConfig
            let aValue: any = a[key as keyof typeof a]
            let bValue: any = b[key as keyof typeof b]
            if (aValue < bValue) return direction === 'asc' ? -1 : 1
            if (aValue > bValue) return direction === 'asc' ? 1 : -1
            return 0
        })
    }, [filteredModalities, sortConfig])

    // Pagination Logic
    const totalPages = Math.ceil(sortedModalities.length / itemsPerPage)
    const currentModalities = sortedModalities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const toggleAll = (select: boolean) => {
        if (select) {
            const visibleIds = filteredModalities.map(m => m.id)
            setSelected(prev => Array.from(new Set([...prev, ...visibleIds])))
        } else {
            const visibleIds = filteredModalities.map(m => m.id)
            setSelected(prev => prev.filter(id => !visibleIds.includes(id)))
        }
    }

    const areAllVisibleSelected = filteredModalities.length > 0 && filteredModalities.every(m => selected.includes(m.id))

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
        }
        return sortConfig.direction === 'asc' ?
            <ArrowUp className="ml-2 h-4 w-4 text-primary" /> :
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    }

    const handleSave = () => {
        if (eventId) {
            setEventModalities(eventId, selected)

            if (!isWizard) {
                toast.success('Modalidades associadas com sucesso!', {
                    description: `Foram vinculadas ${selected.length} modalidades ao evento ${event?.name || 'Selecionado'}.`,
                })
            }

            if (isWizard && onNext) {
                onNext()
            } else if (!paramEventId) {
                router.push('/area-do-produtor/eventos')
            }
        }
    }

    return (
        <div className={cn("w-full max-w-[1200px] mx-auto flex flex-col pt-6", isWizard ? "h-full" : "h-[calc(100vh-5rem)]")}>
            {/* Header */}
            {!isWizard && (
                <div className="flex items-center justify-between mb-10 shrink-0 px-1">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/area-do-produtor/eventos')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                Associar Modalidades
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Selecione as modalidades que farão parte do evento.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 pb-24 flex flex-col lg:flex-row gap-6">

                {/* Left Column: List */}
                <Card className="flex-1 flex flex-col shadow-md border bg-card">
                    <CardContent className="flex-1 flex flex-col p-4 space-y-4">
                        <div className="flex justify-end">
                            <Button
                                className="bg-primary hover:bg-primary/90 shadow-md"
                                onClick={() => setShowNewModalityModal(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
                            </Button>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
                            <div className="flex items-center gap-3 flex-1 min-w-[200px] relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                                    <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    placeholder="Pesquisar por nome, tipo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-10 bg-white dark:bg-black/20"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1">
                                <div className="rounded-md border bg-card overflow-hidden overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="w-[50px]">
                                                    <Checkbox
                                                        checked={areAllVisibleSelected}
                                                        onCheckedChange={(checked) => toggleAll(!!checked)}
                                                    />
                                                </TableHead>
                                                <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                                                    <div className="flex items-center gap-2">Nome {getSortIcon('name')}</div>
                                                </TableHead>
                                                <TableHead className="cursor-pointer text-center" onClick={() => requestSort('type')}>
                                                    <div className="flex items-center justify-center gap-2">Tipo {getSortIcon('type')}</div>
                                                </TableHead>
                                                <TableHead className="cursor-pointer text-center" onClick={() => requestSort('gender')}>
                                                    <div className="flex items-center justify-center gap-2">Gênero {getSortIcon('gender')}</div>
                                                </TableHead>
                                                <TableHead className="text-center">Idade</TableHead>
                                                <TableHead className="text-center">Equipes</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentModalities.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                        Nenhuma modalidade encontrada.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                currentModalities.map((mod) => {
                                                    const isSelected = selected.includes(mod.id);
                                                    return (
                                                        <TableRow
                                                            key={mod.id}
                                                            className={cn(
                                                                "transition-colors hover:bg-muted/50",
                                                                isSelected && "bg-primary/5 hover:bg-primary/10"
                                                            )}
                                                        >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => toggle(mod.id)}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                <div className="flex flex-col">
                                                                    <span className={cn(isSelected && "text-primary font-bold")}>{mod.name}</span>
                                                                    {mod.category && <span className="text-xs text-muted-foreground">{mod.category}</span>}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-center capitalize">{mod.type || '-'}</TableCell>
                                                            <TableCell className="text-center capitalize">{mod.gender}</TableCell>
                                                            <TableCell className="text-center">{mod.minAge ?? '?'} - {mod.maxAge ?? '?'} anos</TableCell>
                                                            <TableCell className="text-center">{mod.maxTeams && mod.maxTeams > 0 ? mod.maxTeams : '∞'}</TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-1">
                                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                                        setEditingModalityId(mod.id);
                                                                        setShowNewModalityModal(true);
                                                                    }}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(mod)}>
                                                                        <Copy className="h-4 w-4" />
                                                                    </Button>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Excluir modalidade?</AlertDialogTitle>
                                                                                <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction className="bg-destructive" onClick={() => deleteModality(mod.id)}>Excluir</AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            {/* Pagination Footer in Table */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground pt-4 shrink-0">
                                <div className="flex items-center gap-2">
                                    <span>Página {currentPage} de {totalPages || 1}</span>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <Dialog open={showNewModalityModal} onOpenChange={(open) => {
                setShowNewModalityModal(open);
                if (!open) setEditingModalityId(null);
            }}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto w-full">
                    <ModalityForm
                        isModal
                        modalityId={editingModalityId}
                        onSuccess={() => {
                            setShowNewModalityModal(false)
                            setEditingModalityId(null)
                            toast.success(editingModalityId ? "Modalidade atualizada!" : "Modalidade criada!")
                        }}
                        onCancel={() => {
                            setShowNewModalityModal(false)
                            setEditingModalityId(null)
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Footer Actions */}
            <div className="fixed bottom-0 right-0 p-4 border-t bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-end gap-2 w-full lg:w-[calc(100%-16rem)] transition-all duration-300">
                {!isWizard && (
                    <Button
                        variant="outline"
                        onClick={() => router.push('/area-do-produtor/eventos')}
                    >
                        Cancelar
                    </Button>
                )}

                {isWizard && onBack && (
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                )}

                <Button onClick={handleSave} disabled={!eventId} className="min-w-[120px]">
                    {/* If strict Next.js logic, ensure we don't save duplicates on multiple clicks */}
                    {isWizard ? (
                        <>Próximo <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></>
                    ) : (
                        <><Edit className="mr-2 h-4 w-4" /> Salvar</>
                    )}
                </Button>
            </div>
        </div>
    )
}
