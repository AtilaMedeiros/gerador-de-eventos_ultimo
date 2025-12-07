import { useState } from 'react'
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
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import {
  Search,
  Download,
  Edit,
  Trash2,
  UserPlus,
  User,
  Mail,
  Shield,
  Activity,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const MOCK_USERS = [
  {
    id: 1,
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    role: 'Administrador',
    status: 'active',
    lastAccess: 'Hoje, 10:30',
  },
  {
    id: 2,
    name: 'Carlos Oliveira',
    email: 'carlos.o@email.com',
    role: 'Produtor',
    status: 'active',
    lastAccess: 'Ontem, 15:45',
  },
  {
    id: 3,
    name: 'Marcos Santos',
    email: 'marcos.s@email.com',
    role: 'Participante',
    status: 'inactive',
    lastAccess: '10/05/2025',
  },
]

const filterFields: FilterFieldConfig[] = [
  {
    key: 'name',
    label: 'Nome',
    icon: <User className="size-3.5" />,
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
    key: 'role',
    label: 'Tipo de Acesso',
    icon: <Shield className="size-3.5" />,
    type: 'text', // Keeping text for simplicity as mock roles are limited but could be select
    placeholder: 'Administrador, Produtor...',
  },
  {
    key: 'status',
    label: 'Status Ativo',
    activeLabel: 'Ativo',
    icon: <Activity className="size-3.5" />,
    type: 'boolean',
  },
]

export default function UsersList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])

  // Apply Filters
  const filteredUsers = MOCK_USERS.filter(user => {
    // Global Search
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    // Specific Filters
    if (filters.length === 0) return true

    return filters.every(filter => {
      const value = filter.value?.toString().toLowerCase() || ''
      if (value === '') return true

      switch (filter.field) {
        case 'name':
          return user.name.toLowerCase().includes(value)
        case 'email':
          return user.email.toLowerCase().includes(value)
        case 'role':
          return user.role.toLowerCase().includes(value)
        case 'status': {
          if (value === 'false') return true
          const isActive = user.status === 'active'
          const boolValue = value === 'true' || value === true
          return isActive === boolValue
        }
        default:
          return true
      }
    })
  })

  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof MOCK_USERS[0], direction: 'asc' | 'desc' } | null>(null)

  // Apply Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig

    let aValue: any = a[key]
    let bValue: any = b[key]

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: keyof typeof MOCK_USERS[0]) => {
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | string>(50)

  // Pagination Logic
  const pageSize = Number(itemsPerPage) > 0 ? Number(itemsPerPage) : 50
  const totalPages = Math.ceil(sortedUsers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentUsers = sortedUsers.slice(startIndex, endIndex)

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

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
            Usuários
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gerencie os usuários com acesso ao sistema.
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
            onClick={() => navigate('/area-do-produtor/usuarios/novo')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
          </Button>
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[200px] relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left w-full"
          />
        </div>

        <div className="flex bg-white items-center gap-4">
          <div className="flex-1">
            <Filters
              fields={filterFields}
              filters={filters}
              onChange={(newFilters) => setFilters(newFilters)}
              addButton={
                <Button
                  size="sm"
                  className="h-10 w-10 p-0 rounded-md bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-blue-200 dark:border-blue-800 hover:bg-primary/5 hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-400" aria-hidden="true">
                    <path d="M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348"></path>
                    <path d="M16 6h6"></path>
                    <path d="M19 3v6"></path>
                  </svg>
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
              <TableHead className="font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('name')}>
                <div className="flex items-center">
                  Nome {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('email')}>
                <div className="flex items-center">
                  Email {getSortIcon('email')}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('role')}>
                <div className="flex items-center">
                  Tipo de Acesso {getSortIcon('role')}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('status')}>
                <div className="flex items-center">
                  Status {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('lastAccess')}>
                <div className="flex items-center">
                  Último Acesso {getSortIcon('lastAccess')}
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold text-primary/80 h-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                >
                  <TableCell className="font-medium h-12 py-0">
                    <div className="flex items-center h-full">
                      <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                        {user.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0">
                    <div className="flex items-center h-full text-muted-foreground">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0">
                    <div className="flex items-center h-full text-muted-foreground">
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0">
                    <div className="flex items-center h-full">
                      {user.status === 'active' ? (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Ativo
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                          Inativo
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm h-12 py-0">
                    <div className="flex items-center h-full">
                      {user.lastAccess}
                    </div>
                  </TableCell>
                  <TableCell className="text-right h-12 py-0">
                    <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity h-full items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                        onClick={() => navigate(`/area-do-produtor/usuarios/${user.id}`)}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum usuário encontrado com os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Monstrando</span>
          <Input
            type="number"
            min={1}
            max={500}
            value={itemsPerPage}
            onChange={(e) => {
              const val = e.target.value
              if (val === '') {
                setItemsPerPage('')
                return
              }
              let num = parseInt(val)
              if (isNaN(num)) return
              if (num > 500) num = 500
              setItemsPerPage(num)
              setCurrentPage(1)
            }}
            className="h-8 w-10 text-center p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span>registros por página</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Página {currentPage} de {totalPages || 1}
          </span>
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
  )
}
