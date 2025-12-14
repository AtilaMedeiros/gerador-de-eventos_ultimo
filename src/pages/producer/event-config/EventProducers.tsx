import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
    ArrowLeft, UserPlus, Search, Trash2, Shield, Users, CheckCircle2, AlertCircle, Speech, Mail, Phone, Crown, Eye
} from 'lucide-react'
import { useEvent } from '@/contexts/EventContext'
import { getStoredUsers, User } from '@/backend/banco/usuarios'
import { getStoredPermissions, EventRole } from '@/backend/banco/permissoes'
import { EventService } from '@/backend/services/event.service'

// Helper type for display
interface DisplayProducer extends User {
    subRole: EventRole | 'Nenhum'
    status: 'active' | 'inactive'
    phone: string
    cpf: string
}

export default function EventProducers() {
    const { id: eventId } = useParams()
    const navigate = useNavigate()
    const { events } = useEvent()
    const event = events.find(e => e.id === eventId)

    // State
    const [allGlobalProducers, setAllGlobalProducers] = useState<User[]>([])
    const [linkedProducers, setLinkedProducers] = useState<DisplayProducer[]>([])
    const [draftProducers, setDraftProducers] = useState<DisplayProducer[]>([])

    // Master-Detail State
    const [activeUserId, setActiveUserId] = useState<string | null>(null)

    // Search State
    const [userSearchTerm, setUserSearchTerm] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [producerToDelete, setProducerToDelete] = useState<string | null>(null)

    // Editing State (Right Panel)
    const [selectedRole, setSelectedRole] = useState<EventRole>('observer')

    const loadProducers = () => {
        if (!eventId) return
        const allUsers = getStoredUsers()
        const allPermissions = getStoredPermissions()

        // 1. All Global Producers (Candidates)
        // Filter users who are global 'producer' or 'admin'
        const globalProducers = allUsers.filter(u =>
            (u.role === 'producer' || u.role === 'admin')
        )
        setAllGlobalProducers(globalProducers)

        // 2. Linked Producers
        const eventProducers = globalProducers.map(u => {
            const permission = allPermissions.find(p => p.userId === u.id && p.eventId === eventId)
            if (!permission) return null

            return {
                ...u,
                phone: u.phone || '(00) 00000-0000',
                cpf: u.cpf || '000.000.000-00',
                subRole: permission.role,
                status: 'active'
            } as DisplayProducer
        }).filter(Boolean) as DisplayProducer[]

        setLinkedProducers(eventProducers)
    }

    // Load Initial Data
    useEffect(() => {
        loadProducers()
    }, [eventId])

    // Update form when active user changes
    useEffect(() => {
        if (activeUserId) {
            // Check linked first
            const user = linkedProducers.find(p => p.id === activeUserId)
            if (user) {
                if (user.subRole !== 'Nenhum') setSelectedRole(user.subRole as EventRole)
            } else {
                // Check draft
                const draft = draftProducers.find(p => p.id === activeUserId)
                if (draft) {
                    setSelectedRole('observer') // Default for draft
                }
            }
        }
    }, [activeUserId, linkedProducers, draftProducers])

    // Search Logic (Global)
    const filteredSearchUsers = useMemo(() => {
        if (!userSearchTerm) return []
        const lower = userSearchTerm.toLowerCase()

        return allGlobalProducers.filter(u => {
            // Already linked?
            // const isLinked = linkedProducers.some(lp => lp.id === u.id)
            // if (isLinked) return false // Optional: hide already linked

            const phoneClean = (u.phone || '').replace(/\D/g, '')

            return (
                u.name.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower) ||
                (u.cpf && u.cpf.includes(lower)) ||
                (u.phone && u.phone.includes(lower)) ||
                phoneClean.includes(lower)
            )
        }).slice(0, 10) // Limit results
    }, [allGlobalProducers, userSearchTerm, linkedProducers])

    // Sidebar List (Linked + Drafts)
    const sidebarList = useMemo(() => {
        const list = [...linkedProducers, ...draftProducers]
        // If searching within the list (optional, but user wants search to ADD)
        // Let's keep the sidebar list strict to what is "Selected" or "Present"
        return list
    }, [linkedProducers, draftProducers])

    const handleAddProducerFromSearch = (user: User) => {
        // Check if already linked
        const isLinked = linkedProducers.some(lp => lp.id === user.id)
        if (isLinked) {
            setActiveUserId(user.id)
            setIsSearchOpen(false)
            setUserSearchTerm('')
            return
        }

        // Check if already in draft
        const isDraft = draftProducers.some(dp => dp.id === user.id)
        if (isDraft) {
            setActiveUserId(user.id)
            setIsSearchOpen(false)
            setUserSearchTerm('')
            return
        }

        // Add to draft
        const newDraft: DisplayProducer = {
            ...user,
            phone: user.phone || '(00) 00000-0000',
            cpf: user.cpf || '000.000.000-00',
            subRole: 'observer', // Default role pending save
            status: 'active' // Draft status, could be distinct
        }

        setDraftProducers(prev => [...prev, newDraft])
        setActiveUserId(user.id)
        setIsSearchOpen(false)
        setUserSearchTerm('')
    }

    const handleSaveRole = () => {
        if (!activeUserId || !eventId) return

        // Is it a draft?
        const isDraft = draftProducers.some(dp => dp.id === activeUserId)

        if (isDraft) {
            // Create New Link
            EventService.addTeamMember(activeUserId, eventId, selectedRole)
            toast.success('Produtor adicionado à equipe com sucesso!')

            // Move from draft to linked (managed by reload)
            setDraftProducers(prev => prev.filter(p => p.id !== activeUserId))
            loadProducers()
        } else {
            // Update Existing Link
            const stored = localStorage.getItem('ge_permissions')
            if (stored) {
                let perms = JSON.parse(stored)
                const index = perms.findIndex((p: any) => p.userId === activeUserId && p.eventId === eventId)
                if (index >= 0) {
                    perms[index].role = selectedRole
                    localStorage.setItem('ge_permissions', JSON.stringify(perms))
                    toast.success('Permissões atualizadas com sucesso!')
                    loadProducers()
                }
            }
        }
    }

    const handleRemoveProducer = (userId: string) => {
        // Check if draft
        const isDraft = draftProducers.some(dp => dp.id === userId)
        if (isDraft) {
            setDraftProducers(prev => prev.filter(p => p.id !== userId))
            toast.success('Removido da lista de seleção.')
            setProducerToDelete(null)
            if (activeUserId === userId) setActiveUserId(null)
            return
        }

        if (!eventId) return
        EventService.removeTeamMember(userId, eventId)
        toast.success('Produtor removido da equipe.')
        setProducerToDelete(null)
        if (activeUserId === userId) setActiveUserId(null)
        loadProducers()
    }

    const activeUser = [...linkedProducers, ...draftProducers].find(u => u.id === activeUserId)
    const isDraftUser = draftProducers.some(dp => dp.id === activeUserId)

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col animate-fade-in pb-4">
            {/* Simple Header */}
            <div className="flex items-center gap-4 mb-6 shrink-0">
                <Button variant="outline" size="icon" onClick={() => navigate('/area-do-produtor/evento')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Produtores do Evento
                        </h2>
                        <p className="text-sm text-muted-foreground">Gerenciamento de Equipe</p>
                    </div>

                    {event && (
                        <>
                            <div className="h-10 w-[1px] bg-muted-foreground/20" />
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground/80 truncate max-w-[500px]">
                                    {event.name}
                                </h2>
                                <p className="text-sm text-muted-foreground">Evento Selecionado</p>
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
                                <h3 className="font-semibold text-lg tracking-tight">Equipe</h3>
                                <p className="text-xs text-muted-foreground">Membros vinculados</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={() => setIsSearchOpen(true)}>
                                <UserPlus className="h-4 w-4 text-primary" />
                            </Button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar para adicionar..."
                                className="pl-9 bg-background/50 cursor-text"
                                value={userSearchTerm}
                                onChange={(e) => {
                                    setUserSearchTerm(e.target.value)
                                    if (!isSearchOpen) setIsSearchOpen(true)
                                }}
                                onClick={() => setIsSearchOpen(true)}
                            />

                            {/* Search Dropdown */}
                            {isSearchOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-2">
                                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                                            Resultados da Busca
                                        </div>
                                        <div className="max-h-[200px] overflow-y-auto space-y-1">
                                            {filteredSearchUsers.length === 0 ? (
                                                <div className="text-center py-4 text-xs text-muted-foreground">
                                                    {userSearchTerm ? 'Nenhum usuário encontrado.' : 'Digite para buscar...'}
                                                </div>
                                            ) : (
                                                filteredSearchUsers.map(user => {
                                                    const isLinked = linkedProducers.some(lp => lp.id === user.id)
                                                    return (
                                                        <div
                                                            key={user.id}
                                                            className="flex flex-col p-2 text-sm rounded-md hover:bg-muted cursor-pointer transition-colors"
                                                            onClick={() => handleAddProducerFromSearch(user)}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium text-sm">{user.name}</span>
                                                                {isLinked && <span className="text-[10px] text-primary bg-primary/10 px-1 rounded">Vinculado</span>}
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    )
                                                })
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
                                <p className="text-sm">Nenhum produtor na lista.</p>
                            </div>
                        ) : (
                            sidebarList.map((user) => {
                                const isDraft = draftProducers.some(dp => dp.id === user.id)
                                return (
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
                                            ${isDraft ? 'bg-muted text-muted-foreground' :
                                                user.subRole === 'owner' ? 'bg-amber-100 text-amber-700' :
                                                    user.subRole === 'assistant' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                                        `}>
                                            {isDraft ? <UserPlus className="h-4 w-4" /> :
                                                user.subRole === 'owner' ? <Crown className="h-4 w-4" /> : <Speech className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{user.name}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 capitalize">
                                                    {isDraft ? 'Novo (Não Salvo)' :
                                                        user.subRole === 'owner' ? 'Proprietário' :
                                                            user.subRole === 'assistant' ? 'Assistente' : 'Observador'}
                                                </span>
                                                {isDraft && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-0.5 ml-1">
                                            {user.subRole !== 'owner' && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 shrink-0 transition-opacity text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setProducerToDelete(user.id)
                                                    }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: EDITOR */}
                <div className="w-[70%] bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col">
                    {!activeUser ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                            <Users className="h-16 w-16 mb-4 opacity-10" />
                            <h3 className="text-lg font-medium text-foreground">Selecione um Membro</h3>
                            <p className="max-w-xs text-center mt-2 text-sm">
                                Escolha um produtor na lista ao lado para gerenciar suas permissões.
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
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">{activeUser.name}</h2>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3.5 w-3.5" /> {activeUser.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3.5 w-3.5" /> {activeUser.phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {activeUser.subRole !== 'owner' && (
                                    <Button onClick={handleSaveRole} className={`gap-2 shadow-lg ${isDraftUser ? 'shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white' : 'shadow-primary/20'}`}>
                                        <CheckCircle2 className="h-4 w-4" />
                                        {isDraftUser ? 'Confirmar Adição' : 'Salvar Alterações'}
                                    </Button>
                                )}
                            </div>

                            {/* Content */}
                            <ScrollArea className="flex-1 p-6 bg-muted/5">
                                <div className="space-y-6 max-w-2xl mx-auto">

                                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            {isDraftUser ? 'Definir Permissão Inicial' : 'Configuração de Acesso'}
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Papel no Evento</Label>
                                                <Select
                                                    value={selectedRole}
                                                    onValueChange={(v: EventRole) => setSelectedRole(v)}
                                                    disabled={activeUser.subRole === 'owner'}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="assistant">
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-0.5 bg-blue-100 p-1 rounded text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                                                    <Speech className="h-4 w-4" />
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold block">Assistente</span>
                                                                    <span className="text-xs text-muted-foreground">Pode editar informações, gerenciar inscrições e ver relatórios.</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="observer">
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-0.5 bg-purple-100 p-1 rounded text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                                                                    <Eye className="h-4 w-4" />
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold block">Observador</span>
                                                                    <span className="text-xs text-muted-foreground">Apenas visualização. Não pode alterar dados.</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {isDraftUser && (
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-sm text-emerald-800 flex gap-2">
                                                    <UserPlus className="h-5 w-5 shrink-0" />
                                                    <p>Você está adicionando este produtor à equipe. Clique em "Confirmar Adição" acima para salvar.</p>
                                                </div>
                                            )}

                                            {activeUser.subRole === 'owner' && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex gap-2">
                                                    <Crown className="h-5 w-5 shrink-0" />
                                                    <p>O proprietário do evento tem acesso total e não pode ter seu papel alterado.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </ScrollArea>
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!producerToDelete} onOpenChange={(open) => !open && setProducerToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover Produtor</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover este produtor da equipe do evento?
                            <br />
                            Ele perderá o acesso imediatamente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                if (producerToDelete) {
                                    handleRemoveProducer(producerToDelete)
                                }
                            }}
                        >
                            Confirmar Remoção
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
