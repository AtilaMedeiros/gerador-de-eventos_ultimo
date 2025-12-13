import { useState, useEffect } from 'react'
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import {
    Search,
    Download,
    Edit,
    Trash2,
    UserPlus,
    User as UserIcon,
    Mail,
    Shield,
    Activity,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    RotateCcwKey,
    BadgeInfo,
    ArrowLeft,
    Check
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { TbUserPause, TbUserCheck } from 'react-icons/tb'
import { useEvent } from '@/contexts/EventContext'
import { getStoredUsers, User, GlobalRole } from '@/backend/banco/usuarios'
import { getStoredPermissions, EventRole } from '@/backend/banco/permissoes'
import { EventService } from '@/backend/services/event.service'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Helper type for display
interface DisplayProducer extends User {
    subRole: EventRole | 'Nenhum'
    status: 'active' | 'inactive'
    phone: string // Mocked for now if missing in User
    cpf: string // Mocked for now if missing
}

const filterFields: FilterFieldConfig[] = [
    {
        key: 'name',
        label: 'Nome',
        icon: <UserIcon className="size-3.5" />,
        type: 'text',
        placeholder: 'Buscar por nome...',
    },
    {
        key: 'email',
        label: 'Email',
        icon: <Mail className="size-3.5" />,
        type: 'text',
        placeholder: 'Buscar por email...',
    },
    {
        key: 'subRole',
        label: 'Papel',
        icon: <BadgeInfo className="size-3.5" />,
        type: 'text',
        placeholder: 'Assistente, Observador...',
    },
]

export default function EventProducers() {
    const navigate = useNavigate()
    const { id: eventId } = useParams()
    const { events } = useEvent()
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<Filter[]>([])

    const event = events.find(e => e.id === eventId)

    const [users, setUsers] = useState<DisplayProducer[]>([])

    // Add Producer Dialog State
    const [addProducerOpen, setAddProducerOpen] = useState(false)
    const [availableProducers, setAvailableProducers] = useState<User[]>([])
    const [selectedProducerId, setSelectedProducerId] = useState<string>('')
    const [selectedRole, setSelectedRole] = useState<EventRole>('observer')

    // Load Data
    useEffect(() => {
        if (!eventId) return
        loadProducers()
    }, [eventId])

    const loadProducers = () => {
        const allUsers = getStoredUsers()
        const allPermissions = getStoredPermissions()

        // Filter users who are global 'producer' or 'admin' AND have a role in THIS event
        const eventProducers = allUsers.filter(u =>
            (u.role === 'producer' || u.role === 'admin')
        ).map(u => {
            const permission = allPermissions.find(p => p.userId === u.id && p.eventId === eventId)

            // Should we show ALL producers or ONLY those associated with the event?
            // Requirement: "quando esse produtos cadastra novos produtores... esse novo usuario é apenas um produtor mas quando é associado a um evento... é do tipo assistente/observador"
            // So this list should probably only show those associated? 
            // Usually "Event Team" list shows only team members.

            if (!permission) return null

            return {
                ...u,
                phone: '(00) 00000-0000', // Mock
                cpf: '000.000.000-00', // Mock
                subRole: permission.role,
                status: 'active'
            } as DisplayProducer
        }).filter(Boolean) as DisplayProducer[]

        setUsers(eventProducers)

        // Prepare users for "Add" dialog (Global Producers NOT in this event yet)
        const candidates = allUsers.filter(u =>
            (u.role === 'producer') &&
            !allPermissions.some(p => p.userId === u.id && p.eventId === eventId)
        )
        setAvailableProducers(candidates)
    }

    const handleAddProducer = () => {
        if (!selectedProducerId || !eventId) return

        EventService.addTeamMember(selectedProducerId, eventId, selectedRole)

        toast.success('Produtor adicionado à equipe com sucesso!')
        setAddProducerOpen(false)
        setSelectedProducerId('')
        loadProducers()
    }

    // Password Reset State
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
    const [selectedUserForReset, setSelectedUserForReset] = useState<DisplayProducer | null>(null)
    const [newPass, setNewPass] = useState('')

    // Apply Filters
    const filteredUsers = users.filter(user => {
        // Global Search
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.subRole.toLowerCase().includes(searchLower) ||
            user.cpf.includes(searchLower)

        if (!matchesSearch) return false

        // Specific Filters
        if (filters.length === 0) return true
        return filters.every(filter => {
            const value = filter.value?.toString().toLowerCase() || ''
            if (value === '') return true
            switch (filter.field) {
                case 'name': return user.name.toLowerCase().includes(value)
                case 'email': return user.email.toLowerCase().includes(value)
                case 'subRole': return user.subRole.toLowerCase().includes(value)
                default: return true
            }
        })
    })

    const [sortConfig, setSortConfig] = useState<{ key: keyof DisplayProducer, direction: 'asc' | 'desc' } | null>(null)

    // Apply Sorting
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig) return 0
        const { key, direction } = sortConfig
        // @ts-ignore
        const aValue = a[key]
        // @ts-ignore
        const bValue = b[key]
        if (aValue < bValue) return direction === 'asc' ? -1 : 1
        if (aValue > bValue) return direction === 'asc' ? 1 : -1
        return 0
    })

    const requestSort = (key: keyof DisplayProducer) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(50)
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
    const currentUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleAction = (action: string) => {
        toast.info(`Ação ${action} simulada com sucesso.`)
    }

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full hover:bg-muted"
                        onClick={() => navigate('/area-do-produtor/evento')}
                    >
                        <ArrowLeft className="h-6 w-6 text-muted-foreground" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Produtores do Evento
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-muted-foreground text-lg">
                                {event?.name || 'Evento não encontrado'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Dialog open={addProducerOpen} onOpenChange={setAddProducerOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] flex-1 md:flex-none"
                            >
                                <UserPlus className="mr-2 h-4 w-4" /> Adicionar Produtor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Produtor ao Evento</DialogTitle>
                                <DialogDescription>
                                    Selecione um produtor cadastrado para fazer parte da equipe deste evento.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Produtor</Label>
                                    <Select value={selectedProducerId} onValueChange={setSelectedProducerId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um produtor..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableProducers.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name} ({p.email})</SelectItem>
                                            ))}
                                            {availableProducers.length === 0 && (
                                                <SelectItem value="none" disabled>Nenhum produtor disponível</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Papel no Evento</Label>
                                    <Select value={selectedRole} onValueChange={(v: EventRole) => setSelectedRole(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="assistant">Assistente (Pode Editar)</SelectItem>
                                            <SelectItem value="observer">Observador (Apenas Visualiza)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddProducer} disabled={!selectedProducerId}>Confirmar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content Table */}
            <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-primary/5">
                        <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
                            <TableHead className="font-semibold text-primary/80 h-12" onClick={() => requestSort('name')}>Nome</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12" onClick={() => requestSort('email')}>Email</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12" onClick={() => requestSort('subRole')}>Papel</TableHead>
                            <TableHead className="text-right font-semibold text-primary/80 h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30">
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                            ${user.subRole === 'assistant' ? 'bg-blue-100 text-blue-800' :
                                                user.subRole === 'owner' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {user.subRole === 'assistant' ? 'Assistente' :
                                                user.subRole === 'owner' ? 'Proprietário' : 'Observador'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleAction('Editar')}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Nenhum produtor vinculado a este evento.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
