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
    X
} from 'lucide-react'

import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { SchoolService } from '@/backend/services/school.service'
import { TechnicianLinkService, SchoolTechnician } from '@/backend/services/technician-link.service'
import { getStoredUsers, User } from '@/backend/banco/usuarios'

export default function SchoolTechnicians() {
    const { id: schoolId } = useParams()
    const navigate = useNavigate()
    const { events, getEventModalities } = useEvent()
    const { modalities } = useModality()

    const [school, setSchool] = useState<any>(null)
    const [technicians, setTechnicians] = useState<SchoolTechnician[]>([])
    const [users, setUsers] = useState<User[]>([])

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedModalities, setSelectedModalities] = useState<string[]>([])

    // Load Initial Data
    useEffect(() => {
        if (!schoolId) return

        // Load School
        const allSchools = JSON.parse(localStorage.getItem('ge_schools_list') || '[]')
        const foundSchool = allSchools.find((s: any) => s.id === schoolId)

        if (foundSchool) {
            setSchool(foundSchool)
        } else {
            toast.error('Escola não encontrada')
            navigate('/area-do-produtor/escolas')
            return
        }

        // Load Technicians
        loadTechnicians()

        // Load Users (Global List)
        setUsers(getStoredUsers())

    }, [schoolId, navigate])

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

    // Actions
    const handleAddTechnician = () => {
        if (!selectedUser || !schoolId) return

        try {
            TechnicianLinkService.addTechnician(schoolId, selectedUser.id, selectedModalities)
            toast.success('Técnico adicionado com sucesso!')
            setIsAddModalOpen(false)
            resetForm()
            loadTechnicians()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleRemoveTechnician = (linkId: string) => {
        if (confirm('Tem certeza que deseja remover este técnico da escola?')) {
            TechnicianLinkService.removeTechnician(linkId)
            toast.success('Técnico removido.')
            loadTechnicians()
        }
    }

    const resetForm = () => {
        setSelectedUser(null)
        setSelectedModalities([])
        setSearchTerm('')
    }

    // Helper to enrich technician data for display
    const enrichedTechnicians = technicians.map(tech => {
        const user = users.find(u => u.id === tech.userId)
        return {
            ...tech,
            user,
            modalityCount: tech.allowedModalityIds.length
        }
    })

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (!school) return null

    return (
        <div className="space-y-8 animate-fade-in relative min-h-screen pb-20">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/50 hover:bg-white"
                        onClick={() => navigate('/area-do-produtor/escolas')}
                    >
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            Técnicos da Escola
                        </h2>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">{school.name}</span>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                >
                    <UserPlus className="mr-2 h-4 w-4" /> Novo Técnico
                </Button>
            </div>

            {/* Technicians List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrichedTechnicians.map(tech => (
                    <Card key={tech.id} className="border-border/50 bg-white/40 hover:bg-white/60 transition-all duration-300 group">
                        <CardHeader className="pb-3 pt-6 flex flex-row items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {tech.user?.name.charAt(0) || '?'}
                                </div>
                                <div>
                                    <CardTitle className="text-base font-bold text-foreground">
                                        {tech.user?.name || 'Usuário Desconhecido'}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {tech.user?.email}
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                                onClick={() => handleRemoveTechnician(tech.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/50">
                                <Shield className="h-3.5 w-3.5 text-primary" />
                                <span className="text-xs">
                                    Permissão para <strong>{tech.modalityCount}</strong> modalidade(s)
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {enrichedTechnicians.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-xl border border-dashed border-border">
                        <div className="bg-muted/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-10 w-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-medium">Nenhum técnico vinculado</h3>
                        <p className="mb-6">Adicione usuários para gerenciar os atletas desta escola.</p>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
                            Adicionar Técnico
                        </Button>
                    </div>
                )}
            </div>

            {/* Add Technician Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Técnico</DialogTitle>
                        <DialogDescription>
                            Selecione um usuário e as modalidades que ele poderá gerenciar.
                        </DialogDescription>
                    </DialogHeader>

                    {!selectedUser ? (
                        <div className="flex-1 overflow-y-auto py-4 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar usuário por nome ou email..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="space-y-2">
                                {filteredUsers.slice(0, 5).map(user => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">Selecionar</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto py-4 space-y-6">
                            <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{selectedUser.name}</p>
                                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                                    <X className="h-4 w-4 mr-1" /> Trocar
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-primary" />
                                    Permissões de Modalidade
                                </h4>
                                <p className="text-xs text-muted-foreground -mt-3">
                                    Selecione quais modalidades este técnico poderá acessar.
                                </p>

                                {availableModalitiesByEvent.length === 0 ? (
                                    <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
                                        A escola não está vinculada a nenhum evento com modalidades disponíveis.
                                    </div>
                                ) : (
                                    availableModalitiesByEvent.map(({ event, modalities }) => (
                                        <div key={event.id} className="border rounded-lg overflow-hidden">
                                            <div className="bg-muted/30 p-2 border-b flex items-center gap-2">
                                                <Badge variant="outline" className="bg-background text-[10px] uppercase">{event.computedTimeStatus}</Badge>
                                                <span className="font-semibold text-sm">{event.name}</span>
                                            </div>
                                            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {modalities.map(mod => (
                                                    <div key={mod.id} className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors">
                                                        <Checkbox
                                                            id={`mod-${mod.id}`}
                                                            checked={selectedModalities.includes(mod.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setSelectedModalities(prev => [...prev, mod.id])
                                                                } else {
                                                                    setSelectedModalities(prev => prev.filter(id => id !== mod.id))
                                                                }
                                                            }}
                                                        />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <label
                                                                htmlFor={`mod-${mod.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {mod.name}
                                                            </label>
                                                            <span className="text-xs text-muted-foreground">
                                                                {mod.gender}, {mod.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4 gap-2">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={handleAddTechnician}
                            disabled={!selectedUser || selectedModalities.length === 0}
                            className={!selectedUser ? 'hidden' : ''}
                        >
                            Salvar Permissões
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
