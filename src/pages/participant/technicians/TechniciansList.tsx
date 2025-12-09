import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Download,
  Edit,
  Trash2,
  Plus,
  User,
  Mail,
  ClipboardList,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  KeyRound,
  RotateCcwKey,
  Trophy
} from 'lucide-react'
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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
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
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useAuth } from '@/contexts/AuthContext'
import { useEvent } from '@/contexts/EventContext'
import { toast } from 'sonner'
import { FaWhatsapp } from 'react-icons/fa'

const filterFields: FilterFieldConfig[] = [
  {
    key: 'name',
    label: 'Nome',
    icon: <User className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por nome...',
  },
  {
    key: 'cref',
    label: 'CREF',
    icon: <ClipboardList className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por CREF...',
  },
  {
    key: 'email',
    label: 'Email',
    icon: <Mail className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por email...',
  },
  {
    key: 'phone',
    label: 'Telefone',
    icon: <Phone className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por telefone...',
  },
]

export default function TechniciansList() {
  const navigate = useNavigate()
  const calculateUser = useAuth()
  const user = calculateUser.user
  const { technicians, deleteTechnician } = useParticipant()
  const { events } = useEvent()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])

  // Password Reset State
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [selectedTechForReset, setSelectedTechForReset] = useState<any | null>(null)
  const [newPassword, setNewPassword] = useState('')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | string>(10)

  // Forcing true to ensure action buttons are visible as requested
  const isResponsible = true // user?.role === 'school_admin' || user?.role === 'producer'

  // Apply Filters
  const filteredTechnicians = technicians.filter(tech => {
    // Global Search
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      tech.name.toLowerCase().includes(searchLower) ||
      tech.email.toLowerCase().includes(searchLower) ||
      (tech.cref || '').toLowerCase().includes(searchLower) ||
      tech.phone.includes(searchLower) ||
      tech.cpf.includes(searchLower)

    if (!matchesSearch) return false

    // Specific Filters
    if (filters.length === 0) return true

    return filters.every(filter => {
      const value = filter.value?.toString().toLowerCase() || ''
      if (value === '') return true

      switch (filter.field) {
        case 'name':
          return tech.name.toLowerCase().includes(value)
        case 'email':
          return tech.email.toLowerCase().includes(value)
        case 'cref':
          return (tech.cref || '').toLowerCase().includes(value)
        case 'phone':
          return tech.phone.includes(value)
        default:
          return true
      }
    })
  })

  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  const sortedTechnicians = [...filteredTechnicians].sort((a: any, b: any) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    const aValue = a[key] || ''
    const bValue = b[key] || ''

    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })

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

  // Pagination Logic
  const pageSize = Number(itemsPerPage) > 0 ? Number(itemsPerPage) : 10
  const totalPages = Math.ceil(sortedTechnicians.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentTechnicians = sortedTechnicians.slice(startIndex, endIndex)

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  const handleAction = (action: string) => {
    toast.info(`Ação ${action} simulada com sucesso.`)
  }

  const handleResetPassword = (tech: any) => {
    setSelectedTechForReset(tech)
    setNewPassword(`@Sme${new Date().getFullYear()}`)
    setResetPasswordDialogOpen(true)
  }

  const handleConfirmReset = () => {
    if (!selectedTechForReset) return

    // Simulate API call
    console.log(`Resetting password for user ${selectedTechForReset.id} to ${newPassword}`)

    toast.success(`Senha para ${selectedTechForReset.name} alterada com sucesso!`)
    setResetPasswordDialogOpen(false)
    setSelectedTechForReset(null)
  }

  // Column Resizing Logic
  const [colWidths, setColWidths] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('ge_technicians_col_widths_v2')
    return saved ? JSON.parse(saved) : {
      name: 250,
      cpf: 140,
      cref: 120,
      email: 220,
      phone: 150,
      actions: 160
    }
  })

  useEffect(() => {
    localStorage.setItem('ge_technicians_col_widths_v2', JSON.stringify(colWidths))
  }, [colWidths])

  const resizingRef = useRef<{ key: string, startX: number, startWidth: number } | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return
    const { key, startX, startWidth } = resizingRef.current
    const diff = e.clientX - startX
    const newWidth = Math.max(50, startWidth + diff)

    setColWidths(prev => ({
      ...prev,
      [key]: newWidth
    }))
  }, [])

  const handleMouseUp = useCallback(() => {
    resizingRef.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'default'
  }, [handleMouseMove])

  const handleMouseDown = useCallback((e: React.MouseEvent, key: string) => {
    e.preventDefault()
    e.stopPropagation()
    resizingRef.current = {
      key,
      startX: e.clientX,
      startWidth: colWidths[key] || 100
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
  }, [colWidths, handleMouseMove, handleMouseUp])

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Background Gradients */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Técnicos
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gerencie os técnicos e equipe de apoio.
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
            onClick={() => navigate('/area-do-participante/tecnicos/novo')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Técnico
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
            placeholder="Pesquisar por nome, cpf, cref ou email..."
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

      <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden overflow-x-auto">
        <Table style={{ tableLayout: 'fixed', minWidth: '100%' }}>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
              <TableHead style={{ width: colWidths.name }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('name')}>
                <div className="flex items-center overflow-hidden">
                  <span className="truncate">Nome</span> {getSortIcon('name')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'name')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.cpf }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('cpf')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">CPF</span> {getSortIcon('cpf')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'cpf')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.cref }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('cref')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">CREF</span> {getSortIcon('cref')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'cref')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.email }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('email')}>
                <div className="flex items-center overflow-hidden">
                  <span className="truncate">Email</span> {getSortIcon('email')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'email')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.phone }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('phone')}>
                <div className="flex items-center overflow-hidden">
                  <span className="truncate">Telefone</span> {getSortIcon('phone')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'phone')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.actions }} className="relative text-right font-semibold text-primary/80 h-12">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTechnicians.length > 0 ? (
              currentTechnicians.map((tech) => (
                <TableRow
                  key={tech.id}
                  className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                >
                  <TableCell className="font-medium h-12 py-0 overflow-hidden">
                    <div className="flex flex-col justify-center h-full truncate">
                      <span className="text-sm group-hover:text-primary transition-colors leading-tight truncate" title={tech.name}>
                        {tech.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0 text-center overflow-hidden">
                    <div className="flex items-center justify-center h-full text-muted-foreground truncate">
                      {tech.cpf}
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0 text-center overflow-hidden">
                    <div className="flex items-center justify-center h-full">
                      <span className="text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded text-xs truncate">
                        {tech.cref || '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0 overflow-hidden">
                    <div className="flex items-center h-full text-muted-foreground truncate" title={tech.email}>
                      {tech.email}
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0 overflow-hidden">
                    <div className="flex items-center h-full text-muted-foreground truncate gap-2" title={tech.phone}>
                      <button
                        className="hover:text-green-600 transition-colors flex-shrink-0"
                        onClick={() => window.open(`https://wa.me/55${tech.phone?.replace(/\D/g, '')}`, '_blank')}
                        title="Whatsapp"
                      >
                        <FaWhatsapp className="h-4 w-4" />
                      </button>
                      <span className="truncate">{tech.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right h-12 py-0">
                    <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity h-full items-center">


                      {(isResponsible || user?.id === tech.id) && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                            onClick={() => navigate(`/area-do-participante/tecnicos/${tech.id}/inscricao?eventId=${events.length > 0 ? events[0].id : ''}`)}
                            title="Vincular Modalidade"
                          >
                            <Trophy className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                            onClick={() => handleResetPassword(tech)}
                            title="Resetar Senha"
                          >
                            <RotateCcwKey className="h-5 w-5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-500/10 hover:text-blue-600 rounded-full transition-colors"
                            onClick={() => navigate(`/area-do-participante/tecnicos/${tech.id}`)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {isResponsible && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover Técnico?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTechnician(tech.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum técnico encontrado.
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

      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Resetar Senha</DialogTitle>
            <DialogDescription>
              Defina a senha temporária. No primeiro acesso, o sistema solicitará a troca obrigatória da senha.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirmReset}>Confirmar Alteração</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
