import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
    ArrowLeft, UserPlus, Search, Trash2, Shield, Users, School, Trophy, CheckCircle2, X, AlertCircle, User as UserIcon, Calendar, Speech, Cake
} from 'lucide-react'

import { TbUserPause, TbUserCheck } from 'react-icons/tb'

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

    // State
    const [school, setSchool] = useState<any>(null)
    const [technicians, setTechnicians] = useState<SchoolTechnician[]>([])
    const [users, setUsers] = useState<User[]>([])

    // Master-Detail State
    const [activeUserId, setActiveUserId] = useState<string | null>(null)
    const [draftUsers, setDraftUsers] = useState<User[]>([]) // Users added to list but not yet linked

    // Search State
    const [userSearchTerm, setUserSearchTerm] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [technicianToDelete, setTechnicianToDelete] = useState<string | null>(null)

    // Editing State (Right Panel)
    const [selectedModalities, setSelectedModalities] = useState<string[]>([])

    const loadTechnicians = () => {
        if (!schoolId) return
        const links = TechnicianLinkService.getTechniciansBySchool(schoolId)
        setTechnicians(links)
    }

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
        if (foundSchool) setSchool(foundSchool)
        else {
            toast.error('Escola não encontrada')
            navigate('/area-do-produtor/escolas')
        }

        loadTechnicians()
        setUsers(getStoredUsers())
    }, [schoolId, navigate])

    // Effect: Update selected modalities when active user changes
    useEffect(() => {
        if (!activeUserId) {
            setSelectedModalities([])
            return
        }

        // Check if user is already linked
        const link = technicians.find(t => t.userId === activeUserId)
        if (link) {
            setSelectedModalities(link.allowedModalityIds)
        } else {
            // Check if it's a draft user, maybe preserve state? For now reset.
            setSelectedModalities([])
        }
    }, [activeUserId, technicians])

    // Computed: Available Modalities
    const availableModalitiesByEvent = useMemo(() => {
        if (!school) return []
        let linkedIds: string[] = Array.isArray(school.eventIds) ? school.eventIds : []
        if (school.eventId && !linkedIds.includes(school.eventId)) linkedIds = [...linkedIds, school.eventId]
        if (linkedIds.length === 0) return []

        const result = []
        for (const eventId of linkedIds) {
            const event = events.find(e => e.id === eventId)
            if (!event) continue
            const modIds = getEventModalities(eventId)
            const eventMods = modalities.filter(m => modIds.includes(m.id))
            if (eventMods.length > 0) result.push({ event, modalities: eventMods })
        }
        return result
    }, [school, events, getEventModalities, modalities])

    // Computed: Combined List for Left Panel
    const sidebarList = useMemo(() => {
        // 1. Existing Technicians
        const existingUsers = technicians.map(t => {
            const user = users.find(u => u.id === t.userId)
            return { user, link: t, isDraft: false }
        }).filter(item => item.user !== undefined) as { user: User, link: SchoolTechnician, isDraft: boolean }[]

        // 2. Draft Users (exclude if already in existing)
        const drafts = draftUsers
            .filter(d => !existingUsers.some(e => e.user.id === d.id))
            .map(user => ({ user, link: null, isDraft: true }))

        return [...existingUsers, ...drafts]
    }, [technicians, draftUsers, users])

    // Search Logic
    const filteredSearchUsers = useMemo(() => {
        if (!userSearchTerm) return []
        const lower = userSearchTerm.toLowerCase()
        // Determine who is already in the sidebar to mark them or exclude them? 
        // Let's just filter global users matching search
        return users.filter(u =>
            (u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower) || u.cpf?.includes(lower)) &&
            // Optional: Exclude if already in sidebar? User might want to "find" them again to select.
            true
        ).slice(0, 5)
    }, [users, userSearchTerm])

    // Actions
    const handleAddUserToSidebar = (user: User) => {
        // Check if already in sidebar (linked or draft)
        const isLinked = technicians.some(t => t.userId === user.id)
        const isDraft = draftUsers.some(d => d.id === user.id)

        if (!isLinked && !isDraft) {
            setDraftUsers(prev => [user, ...prev])
        }

        setActiveUserId(user.id)
        setUserSearchTerm('')
        setIsSearchOpen(false)
    }

    const handleSave = () => {
        if (!activeUserId || !schoolId) return

        const existingLink = technicians.find(t => t.userId === activeUserId)

        try {
            if (existingLink) {
                // UPDATE
                if (existingLink.active === false) {
                    toast.error('O técnico deve estar ativo para alterar suas permissões.')
                    return
                }

                TechnicianLinkService.updateTechnicianPermissions(existingLink.id, selectedModalities)
                toast.success('Permissões atualizadas com sucesso!')
            } else {
                // CREATE
                TechnicianLinkService.addTechnician(schoolId, activeUserId, selectedModalities)
                toast.success('Técnico vinculado com sucesso!')

                // If it was a draft, it's now a link. Remove from draft.
                setDraftUsers(prev => prev.filter(u => u.id !== activeUserId))
            }

            loadTechnicians()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleToggleStatus = (userId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const link = technicians.find(t => t.userId === userId)
        if (!link) return

        try {
            const newActive = TechnicianLinkService.toggleTechnicianStatus(link.id)
            toast.success(`Técnico ${newActive ? 'ativado' : 'pausado'} com sucesso.`)
            loadTechnicians()
        } catch (error: any) {
            toast.error('Erro ao atualizar status')
        }
    }

    const handleRemoveTechnician = (userId: string) => {
        const link = technicians.find(t => t.userId === userId)
        if (link) {
            if (confirm('Remover este técnico da escola?')) {
                TechnicianLinkService.removeTechnician(link.id)
                loadTechnicians()
                if (activeUserId === userId) setActiveUserId(null)
                toast.success('Técnico removido')
            }
        } else {
            // It's a draft
            setDraftUsers(prev => prev.filter(u => u.id !== userId))
            if (activeUserId === userId) setActiveUserId(null)
            toast.success('Removido da lista')
        }
    }

    if (!school) return null

    const activeUser = users.find(u => u.id === activeUserId)

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col animate-fade-in pb-4">
            {/* Simple Header */}
            <div className="flex items-center gap-4 mb-6 shrink-0">
                <Button variant="outline" size="icon" onClick={() => navigate('/area-do-produtor/escolas')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <School className="h-5 w-5 text-primary" />
                            {school.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">Gerenciamento de Técnicos e Modalidades</p>
                    </div>

                    {availableModalitiesByEvent.length > 0 && (
                        <>
                            <div className="h-10 w-[1px] bg-muted-foreground/20" />
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground/80 truncate max-w-[500px]">
                                    {availableModalitiesByEvent.map(i => i.event.name).join(', ')}
                                </h2>
                                <p className="text-sm text-muted-foreground">Nome do evento</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden min-h-0">

                {/* LEFT PANEL: LIST & SEARCH */}
                <div className="w-[30%] flex flex-col gap-4 bg-card border rounded-xl overflow-hidden shadow-sm">
                    {/* Header with Search */}
                    <div className="p-4 border-b bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-lg tracking-tight">Técnicos</h3>
                                <p className="text-xs text-muted-foreground">Gerencie os vínculos</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={() => setIsSearchOpen(true)}>
                                <UserPlus className="h-4 w-4 text-primary" />
                            </Button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-9 bg-background/50"
                                value={userSearchTerm}
                                onClick={() => setIsSearchOpen(true)}
                                readOnly
                            />

                            {/* Search Dropdown */}
                            {isSearchOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-2">
                                        <Input
                                            autoFocus
                                            placeholder="Digite o nome..."
                                            value={userSearchTerm}
                                            onChange={(e) => setUserSearchTerm(e.target.value)}
                                            className="mb-2"
                                        />
                                        <div className="max-h-[200px] overflow-y-auto space-y-1">
                                            {filteredSearchUsers.length === 0 ? (
                                                <div className="text-center py-4 text-xs text-muted-foreground">
                                                    Nenhum usuário encontrado.
                                                </div>
                                            ) : (
                                                filteredSearchUsers.map(user => (
                                                    <div
                                                        key={user.id}
                                                        className="flex flex-col p-2 text-sm rounded-md hover:bg-muted cursor-pointer transition-colors"
                                                        onClick={() => handleAddUserToSidebar(user)}
                                                    >
                                                        <span className="font-medium text-sm">{user.name}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Backdrop to close */}
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsSearchOpen(false)} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {sidebarList.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-4 opacity-50">
                                <Users className="h-10 w-10 mb-2" />
                                <p className="text-sm">Nenhum técnico listado.<br />Utilize a busca acima para adicionar.</p>
                            </div>
                        ) : (
                            sidebarList.map(({ user, link, isDraft }) => (
                                <div
                                    key={user.id}
                                    onClick={() => setActiveUserId(user.id)}
                                    className={`
                                        group flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer relative
                                        ${activeUserId === user.id
                                            ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20 shadow-sm'
                                            : 'border-transparent hover:bg-muted/50'
                                        }
                                    `}
                                >
                                    <div className={`
                                        h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                        ${isDraft ? 'bg-muted text-muted-foreground' : 'bg-blue-100 text-blue-700'}
                                    `}>
                                        <Speech className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{user.name}</div>
                                        <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                            {(isDraft || (link?.active ?? true)) ? (
                                                <>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                                    Ativo
                                                </>
                                            ) : (
                                                <>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 inline-block" />
                                                    Inativo
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {!isDraft && (
                                        <Badge className="text-[10px] h-5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0 px-1.5">
                                            {link?.allowedModalityIds.length}
                                        </Badge>
                                    )}

                                    <div className="flex items-center gap-0.5 ml-1">
                                        {!isDraft && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className={`h-7 w-7 shrink-0 rounded-full transition-colors ${(link?.active ?? true)
                                                    ? "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                    : "text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                                    }`}
                                                onClick={(e) => handleToggleStatus(user.id, e)}
                                                title={(link?.active ?? true) ? "Pausar Técnico" : "Ativar Técnico"}
                                            >
                                                {(link?.active ?? true) ? (
                                                    <TbUserPause className="h-4 w-4" />
                                                ) : (
                                                    <TbUserCheck className="h-4 w-4" />
                                                )}
                                            </Button>
                                        )}

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 shrink-0 transition-opacity text-muted-foreground hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setTechnicianToDelete(user.id)
                                            }}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: EDITOR */}
                <div className="w-[70%] bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col">
                    {!activeUser ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                            <School className="h-16 w-16 mb-4 opacity-10" />
                            <h3 className="text-lg font-medium text-foreground">Selecione um Técnico</h3>
                            <p className="max-w-xs text-center mt-2 text-sm">
                                Escolha um técnico na lista ao lado para gerenciar suas permissões de modalidade.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Editor Header */}
                            <div className="p-6 border-b flex items-start justify-between bg-white dark:bg-black/20">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Speech className="h-7 w-7" />
                                    </div>
                                    <div className="flex items-center">
                                        <h2 className="text-2xl font-bold text-foreground">{activeUser.name}</h2>
                                    </div>
                                </div>
                                <Button onClick={handleSave} className="gap-2 shadow-lg shadow-primary/20">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Salvar Alterações
                                </Button>
                            </div>

                            {/* Modalities List */}
                            <ScrollArea className="flex-1 p-6 bg-muted/5">
                                <div className="space-y-6 max-w-4xl mx-auto">
                                    {availableModalitiesByEvent.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                            <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
                                            <p>Esta escola não possui eventos com modalidades disponíveis.</p>
                                        </div>
                                    )}

                                    {availableModalitiesByEvent.map(({ event, modalities }) => (
                                        <div key={event.id} className="space-y-3">
                                            <div className="grid gap-2">
                                                {(() => {
                                                    const currentEventModalityIds = modalities.map(m => m.id)
                                                    const allSelected = currentEventModalityIds.every(id => selectedModalities.includes(id))

                                                    return (
                                                        <div
                                                            onClick={() => {
                                                                if (allSelected) {
                                                                    // Deselect all for this event
                                                                    setSelectedModalities(prev => prev.filter(id => !currentEventModalityIds.includes(id)))
                                                                } else {
                                                                    // Select all for this event
                                                                    const toAdd = currentEventModalityIds.filter(id => !selectedModalities.includes(id))
                                                                    setSelectedModalities(prev => [...prev, ...toAdd])
                                                                }
                                                            }}
                                                            className={`
                                                                relative overflow-hidden rounded-[5px] border-2 transition-all duration-300 cursor-pointer group flex items-center justify-between p-4
                                                                ${allSelected
                                                                    ? 'border-primary/50 bg-primary/10 shadow-md'
                                                                    : 'border-dashed border-muted-foreground/30 hover:bg-muted/40 hover:border-primary/30'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`
                                                                        h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                                                        ${allSelected
                                                                            ? 'bg-primary border-primary scale-110 shadow-sm'
                                                                            : 'border-muted-foreground/30 bg-background group-hover:border-primary/50'
                                                                        }
                                                                    `}
                                                                >
                                                                    {allSelected && (
                                                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground animate-in zoom-in duration-300" />
                                                                    )}
                                                                </div>
                                                                <span className={`font-semibold text-sm ${allSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                                                                    {allSelected ? 'Todas as modalidades selecionadas' : 'Selecionar todas as modalidades'}
                                                                </span>
                                                            </div>
                                                            {allSelected && (
                                                                <Badge variant="secondary" className="bg-background/80 text-xs">
                                                                    {modalities.length} selecionadas
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )
                                                })()}
                                                {modalities.map(mod => {
                                                    const isSelected = selectedModalities.includes(mod.id)

                                                    // Helper specific to this render for gender colors
                                                    const getGenderStyle = (g: string) => {
                                                        if (g === 'masculino') return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                                        if (g === 'feminino') return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300'
                                                        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
                                                    }

                                                    return (
                                                        <div
                                                            key={mod.id}
                                                            onClick={() => {
                                                                if (isSelected) setSelectedModalities(prev => prev.filter(id => id !== mod.id))
                                                                else setSelectedModalities(prev => [...prev, mod.id])
                                                            }}
                                                            className={`
                                                                relative overflow-hidden rounded-[5px] border-2 transition-all duration-300 cursor-pointer group
                                                                ${isSelected
                                                                    ? 'border-primary/50 bg-blue-50/50 dark:bg-blue-900/10 shadow-md'
                                                                    : 'border-transparent bg-muted/40 hover:bg-muted/60 hover:shadow-sm'
                                                                }
                                                            `}
                                                        >
                                                            {/* Decorative Blur for selected state */}
                                                            {isSelected && (
                                                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
                                                            )}

                                                            <div className="flex items-center gap-3 p-3 relative z-10 w-full">
                                                                {/* Custom Checkbox */}
                                                                <div
                                                                    className={`
                                                                        h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                                                        ${isSelected
                                                                            ? 'bg-primary border-primary scale-110 shadow-sm'
                                                                            : 'border-muted-foreground/30 bg-background group-hover:border-primary/50'
                                                                        }
                                                                    `}
                                                                >
                                                                    {isSelected && (
                                                                        <CheckCircle2 className="h-3 w-3 text-primary-foreground animate-in zoom-in duration-300" />
                                                                    )}
                                                                </div>

                                                                <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                                    {/* Title Section */}
                                                                    <div className="min-w-0">
                                                                        <h3 className={`font-bold text-base tracking-tight leading-none truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                                                            {mod.name}
                                                                        </h3>
                                                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground font-medium truncate">
                                                                            <Trophy className="h-3 w-3 text-amber-500/70" />
                                                                            <span className={isSelected ? 'text-foreground/90' : ''}>
                                                                                {mod.eventCategory || 'Categoria Única'}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Compact Pills Layout - Row on desktop */}
                                                                    <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 shrink-0">
                                                                        {/* Type Pill */}
                                                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-indigo-100 bg-indigo-50/50 dark:bg-indigo-900/10 dark:border-indigo-800">
                                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0">
                                                                                {mod.type === 'coletiva' ? <Users className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[8px] font-bold text-indigo-400 dark:text-indigo-300 tracking-wider uppercase leading-none mb-0.5">TIPO</span>
                                                                                <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-100 capitalize leading-none">{mod.type}</span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Gender Pill */}
                                                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-orange-100 bg-orange-50/50 dark:bg-orange-900/10 dark:border-orange-800">
                                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 shrink-0">
                                                                                <UserIcon className="h-3 w-3" />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[8px] font-bold text-orange-400 dark:text-orange-300 tracking-wider uppercase leading-none mb-0.5">NAIPE</span>
                                                                                <span className="text-[10px] font-bold text-orange-900 dark:text-orange-100 capitalize leading-none">{mod.gender}</span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Age Pill */}
                                                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-pink-100 bg-pink-50/50 dark:bg-pink-900/10 dark:border-pink-800">
                                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shrink-0">
                                                                                <Cake className="h-3 w-3" />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[8px] font-bold text-pink-400 dark:text-pink-300 tracking-wider uppercase leading-none mb-0.5">IDADE</span>
                                                                                <span className="text-[10px] font-bold text-pink-900 dark:text-pink-100 leading-none">
                                                                                    {mod.minAge === 0 && mod.maxAge === 99 ? 'Livre' : `${mod.minAge}-${mod.maxAge}`}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-700 max-w-3xl">
                                    <Shield className="h-5 w-5 shrink-0" />
                                    <div>
                                        <p className="font-semibold mb-1">Permissões de Acesso</p>
                                        <p className="opacity-90">
                                            Ao salvar, o técnico <strong>{activeUser.name}</strong> terá acesso imediato para gerenciar atletas apenas nestas modalidades selecionadas.
                                        </p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </div>
            </div>
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!technicianToDelete} onOpenChange={(open) => !open && setTechnicianToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover o vínculo deste técnico com a escola?
                            <br />
                            Essa ação não pode ser desfeita e removerá todas as permissões do técnico para esta escola.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                if (technicianToDelete) {
                                    handleRemoveTechnician(technicianToDelete)
                                    setTechnicianToDelete(null)
                                }
                            }}
                        >
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
