import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
    ArrowLeft,
    UserPlus,
    Search,
    Trash2,
    Shield,
    Users,
    School,
    Trophy,
    CheckCircle2,
    X,
    AlertCircle
} from 'lucide-react'

import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { SchoolService } from '@/backend/services/school.service'
import { TechnicianLinkService, SchoolTechnician } from '@/backend/services/technician-link.service'
import { getStoredUsers, User } from '@/backend/banco/usuarios'
import { INITIAL_SCHOOLS } from '@/backend/banco/escolas'

export default function SchoolTechnicians() {
    const { id: schoolId } = useParams()
    const navigate = useNavigate()
    const { events, getEventModalities } = useEvent()
    const { modalities } = useModality()

    const [school, setSchool] = useState<any>(null)
    const [technicians, setTechnicians] = useState<SchoolTechnician[]>([])
    const [users, setUsers] = useState<User[]>([])

    // Modal & Selection State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUser, setSelectedUser] = useState<(User & { isLinked?: boolean }) | null>(null)
    const [selectedModalities, setSelectedModalities] = useState<string[]>([])

    // Filter & Sort State
    const [filters, setFilters] = useState<any[]>([])
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(50)

    const loadTechnicians = () => {
        if (!schoolId) return
        const links = TechnicianLinkService.getTechniciansBySchool(schoolId)
        setTechnicians(links)
    }

    // Computed: Available Modalities based on School's Linked Events
    const availableModalitiesByEvent = useMemo(() => {
        if (!school) return []

        // Normalize linked events: prefer eventIds, fallback to eventId (legacy), or empty array
        let linkedIds: string[] = Array.isArray(school.eventIds) ? school.eventIds : []

        // Add legacy ID if not present
        if (school.eventId && !linkedIds.includes(school.eventId)) {
            linkedIds = [...linkedIds, school.eventId]
        }

        if (linkedIds.length === 0) return []

        const result = []

        // Iterate over all linked events
        for (const eventId of linkedIds) {
            const event = events.find(e => e.id === eventId)
            if (!event) continue

            const modIds = getEventModalities(eventId)
            const eventMods = modalities.filter(m => modIds.includes(m.id))

            if (eventMods.length > 0) {
                result.push({
                    event,
                    modalities: eventMods
                })
            }
        }
        return result
    }, [school, events, getEventModalities, modalities])

    // Load Initial Data
    useEffect(() => {
        if (!schoolId) return

        // Load School
        const stored = localStorage.getItem('ge_schools_list')
        let allSchools = stored ? JSON.parse(stored) : []

        if (allSchools.length === 0) {
            allSchools = INITIAL_SCHOOLS
            localStorage.setItem('ge_schools_list', JSON.stringify(INITIAL_SCHOOLS))
        }

        const foundSchool = allSchools.find((s: any) => s.id === schoolId)

        if (foundSchool) {
            setSchool(foundSchool)
        } else {
            // Check if it is a legacy id case or data issue, try to find by string loose match if needed or just redirect
            toast.error('Escola não encontrada')
            navigate('/area-do-produtor/escolas')
            return
        }

        // Load Technicians
        loadTechnicians()

        // Load Users (Global List)
        setUsers(getStoredUsers())

    }, [schoolId, navigate])

    // Actions
    const handleAddTechnician = () => {
        if (!selectedUser || !schoolId) return

        try {
            TechnicianLinkService.addTechnician(schoolId, selectedUser.id, selectedModalities)
            toast.success('Técnico vinculado / atualizado com sucesso!')
            resetForm()
            loadTechnicians()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleRemoveTechnician = (linkId: string) => {
        // Find technician name for better confirm message
        const tech = technicians.find(t => t.id === linkId)
        const userName = users.find(u => u.id === tech?.userId)?.name || 'Técnico'

        if (confirm(`Tem certeza que deseja remover ${userName} desta escola?`)) {
            TechnicianLinkService.removeTechnician(linkId)
            toast.success('Técnico removido.')
            loadTechnicians()
        }
    }

    const handleEditTechnician = (tech: SchoolTechnician) => {
        const user = users.find(u => u.id === tech.userId)
        if (user) {
            setSelectedUser({ ...user, isLinked: true }) // Mark as linked for UI context
            setSelectedModalities(tech.allowedModalityIds)
            // Scroll to top or focus form if needed
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const resetForm = () => {
        setSelectedUser(null)
        setSelectedModalities([])
        setSearchTerm('')
    }


    // Helper to enrich all users with link status
    const allUsersWithStatus = useMemo(() => {
        return users.map(user => {
            const link = technicians.find(t => t.userId === user.id)
            return {
                ...user,
                isLinked: !!link,
                linkId: link?.id,
                allowedModalities: link?.allowedModalityIds || []
            }
        })
    }, [users, technicians])

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return allUsersWithStatus.filter((user) => {
            // Global Search
            const searchLower = searchTerm.toLowerCase()
            const matchesSearch =
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)

            if (!matchesSearch) return false

            if (filters.length === 0) return true

            // Apply filters (extensible)
            return true
        })
    }, [allUsersWithStatus, searchTerm, filters])

    // Sort Logic
    const sortedUsers = useMemo(() => {
        if (!sortConfig) return filteredUsers
        return [...filteredUsers].sort((a, b) => {
            const { key, direction } = sortConfig
            const aVal = a[key as keyof typeof a] || ''
            const bVal = b[key as keyof typeof b] || ''
            if (aVal < bVal) return direction === 'asc' ? -1 : 1
            if (aVal > bVal) return direction === 'asc' ? 1 : -1
            return 0
        })
    }, [filteredUsers, sortConfig])

    // Pagination
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
    const currentUsers = sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Helper to enrich ONLY LINKED technicians for the right table
    const linkedTechniciansList = useMemo(() => {
        return technicians.map(tech => {
            const user = users.find(u => u.id === tech.userId)
            return {
                ...tech,
                user,
                modalityCount: tech.allowedModalityIds.length
            }
        })
    }, [technicians, users])

    // Filter Users for the "Add New" search
    const filteredUsersToSelect = useMemo(() => {
        if (!searchTerm) return []
        const lowerTerm = searchTerm.toLowerCase()
        return users
            .filter(u =>
                !technicians.some(t => t.userId === u.id) && // Only show users NOT yet linked
                (
                    u.name.toLowerCase().includes(lowerTerm) ||
                    u.email.toLowerCase().includes(lowerTerm) ||
                    (u.cpf && u.cpf.includes(lowerTerm)) ||
                    (u.phone && u.phone.includes(lowerTerm))
                )
            )
            .slice(0, 5)
    }, [users, technicians, searchTerm])


    if (!school) return null

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/area-do-produtor/escolas')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gerenciar Técnicos da Escola
                        </h2>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                            <School className="h-4 w-4" />
                            <span className="font-semibold text-foreground">{school.name}</span>
                            <span className="text-border">|</span>
                            <span>{school.municipality} - {school.type}</span>
                        </div>
                    </div>
                </div>
                <Badge variant="secondary" className="hidden md:flex text-sm px-3 py-1 h-auto gap-2">
                    <Users className="h-3 w-3" />
                    Total Vinculados: {technicians.length}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="border-primary/20 shadow-md sticky top-6">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                {selectedUser ? (
                                    selectedUser.isLinked
                                        ? <><Badge className="bg-amber-500 hover:bg-amber-600 mr-1">Editando</Badge> {selectedUser.name}</>
                                        : <><UserPlus className="h-5 w-5" /> Vincular: {selectedUser.name}</>
                                ) : (
                                    <><UserPlus className="h-5 w-5" /> Vincular Novo Técnico</>
                                )}
                            </CardTitle>
                            {selectedUser && (
                                <CardDescription className="flex items-center justify-between">
                                    <span>{selectedUser.email}</span>
                                    <Button variant="ghost" size="sm" onClick={resetForm} className="h-6 text-xs text-muted-foreground hover:text-foreground">
                                        <X className="h-3 w-3 mr-1" /> Cancelar
                                    </Button>
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">

                            {/* User Selection (Only if none selected) */}
                            {!selectedUser && (
                                <div className="space-y-3">
                                    <Label>Buscar Usuário</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Nome, CPF, Email, WhatsApp"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>

                                    {searchTerm && (
                                        <div className="border rounded-md divide-y overflow-hidden shadow-sm">
                                            {filteredUsersToSelect.length === 0 ? (
                                                <div className="p-3 text-sm text-muted-foreground text-center bg-muted/20">
                                                    Nenhum usuário disponível encontrado.
                                                </div>
                                            ) : (
                                                filteredUsersToSelect.map(user => (
                                                    <div
                                                        key={user.id}
                                                        className="p-3 hover:bg-muted/50 cursor-pointer flex items-center justify-between group transition-colors"
                                                        onClick={() => setSelectedUser(user)}
                                                    >
                                                        <div>
                                                            <div className="font-medium text-sm">{user.name}</div>
                                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 h-7 text-xs">
                                                            Selecionar
                                                        </Button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                    {!searchTerm && (
                                        <p className="text-xs text-muted-foreground">
                                            Busque por Nome, CPF, Email ou WhatsApp para vincular.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Modality Selection (If user selected) */}
                            {selectedUser && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center justify-between">
                                            <span>Permissões de Modalidade</span>
                                            <span className="text-xs font-normal text-muted-foreground">
                                                {selectedModalities.length} selecionada(s)
                                            </span>
                                        </Label>

                                        <ScrollArea className="h-[300px] border rounded-md p-3 bg-muted/10">
                                            {availableModalitiesByEvent.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-4 text-center">
                                                    <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                                                    <p>Nenhum evento/modalidade vinculado a esta escola.</p>
                                                </div>
                                            ) : (
                                                availableModalitiesByEvent.map(({ event, modalities }) => (
                                                    <div key={event.id} className="mb-4 last:mb-0">
                                                        <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 px-1 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur py-1 z-10 border-b">
                                                            <Badge variant="outline" className="text-[10px] h-4 px-1">{event.computedTimeStatus}</Badge>
                                                            {event.name}
                                                        </div>
                                                        <div className="space-y-1">
                                                            {modalities.map(mod => {
                                                                const isSelected = selectedModalities.includes(mod.id)
                                                                return (
                                                                    <div
                                                                        key={mod.id}
                                                                        className={`
                                                                            flex items-start gap-3 p-2 rounded-md transition-colors cursor-pointer border border-transparent
                                                                            ${isSelected ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted'}
                                                                        `}
                                                                        onClick={() => {
                                                                            if (isSelected) {
                                                                                setSelectedModalities(prev => prev.filter(id => id !== mod.id))
                                                                            } else {
                                                                                setSelectedModalities(prev => [...prev, mod.id])
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            id={`mod-${mod.id}`}
                                                                            checked={isSelected}
                                                                            onCheckedChange={() => { }} // Handled by parent div
                                                                            className="mt-0.5"
                                                                        />
                                                                        <div className="grid gap-0.5 leading-none">
                                                                            <label className="text-sm font-medium cursor-pointer">
                                                                                {mod.name}
                                                                            </label>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {mod.gender}, {mod.type}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </ScrollArea>
                                    </div>

                                    <Button
                                        onClick={handleAddTechnician}
                                        className="w-full"
                                        disabled={selectedModalities.length === 0}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        {selectedUser.isLinked ? 'Atualizar Permissões' : 'Confirmar Vínculo'}
                                    </Button>

                                    <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-xs flex gap-2 border border-blue-100">
                                        <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                                        <p>
                                            As modalidades listadas são aquelas vinculadas ao evento e à escola. O técnico terá acesso para gerenciar atletas apenas nas seleções acima.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!selectedUser && (
                                <div className="bg-muted/30 p-4 rounded-lg border border-dashed flex flex-col items-center justify-center text-center text-sm text-muted-foreground min-h-[200px]">
                                    <Users className="h-8 w-8 mb-2 opacity-20" />
                                    <p>Busque e selecione um usuário para iniciar o vínculo.</p>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: List */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="h-full border-none shadow-none bg-transparent">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold tracking-tight">
                                Técnicos Vinculados
                            </h3>
                            <p className="text-muted-foreground">
                                Lista de profissionais habilitados a gerenciar inscrições desta escola.
                            </p>
                        </div>

                        <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/40 font-semibold border-b">
                                    <tr>
                                        <th className="px-4 py-3">Profissional</th>
                                        <th className="px-4 py-3 text-center">Modalidades</th>
                                        <th className="px-4 py-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {linkedTechniciansList.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="h-32 text-center text-muted-foreground">
                                                Nenhum técnico vinculado até o momento.
                                            </td>
                                        </tr>
                                    ) : (
                                        linkedTechniciansList.map((tech) => (
                                            <tr key={tech.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-background">
                                                            {tech.user?.name.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-foreground">{tech.user?.name || 'Desconhecido'}</div>
                                                            <div className="text-xs text-muted-foreground">{tech.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant="secondary" className="font-normal">
                                                        {tech.modalityCount} modalidades
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                            onClick={() => handleEditTechnician(tech)}
                                                            title="Editar Permissões"
                                                        >
                                                            <div className="h-4 w-4">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                                            </div>
                                                        </Button>
                                                        <Separator orientation="vertical" className="h-4 mx-1" />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleRemoveTechnician(tech.id)}
                                                            title="Remover Acesso"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
