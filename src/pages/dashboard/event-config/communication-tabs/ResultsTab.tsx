import { useState } from 'react'
import { Trophy, Plus, Trash2, Medal, Search, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useCommunication, Result } from '@/contexts/CommunicationContext'

interface ResultsTabProps {
  eventId: string
}

const filterFields: FilterFieldConfig[] = [
  {
    key: 'categoryName',
    label: 'Categoria',
    icon: <Tag className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por categoria...',
  },
  {
    key: 'champion',
    label: 'Campeão',
    icon: <Trophy className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por campeão...',
  }
]

export function ResultsTab({ eventId }: ResultsTabProps) {
  const { results, addResult, updateResult, deleteResult } = useCommunication()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])

  // Filter results for current event
  const eventResults = results.filter((r) => r.eventId === eventId)

  const filteredResults = eventResults.filter((result) => {
    // Global Search
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = result.categoryName.toLowerCase().includes(searchLower) ||
      (result.champion && result.champion.toLowerCase().includes(searchLower))

    if (!matchesSearch) return false

    // Specific Filters
    if (filters.length === 0) return true

    return filters.every(filter => {
      const value = filter.value?.toString().toLowerCase() || ''
      if (value === '') return true

      if (filter.field === 'categoryName') {
        return result.categoryName.toLowerCase().includes(value)
      }
      if (filter.field === 'champion') {
        return result.champion && result.champion.toLowerCase().includes(value)
      }
      return true
    })
  })

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | string>(12)

  // Pagination Logic
  const pageSize = Number(itemsPerPage) > 0 ? Number(itemsPerPage) : 12
  const totalPages = Math.ceil(filteredResults.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentResults = filteredResults.slice(startIndex, endIndex)

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  const handleChampionChange = (id: string, value: string) => {
    updateResult(id, { champion: value })
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('O nome da modalidade é obrigatório.')
      return
    }

    addResult({
      eventId,
      categoryName: newCategoryName,
      champion: '',
    })

    setNewCategoryName('')
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Galeria de Campeões</h3>
          <p className="text-sm text-muted-foreground">
            Registre os vencedores de cada modalidade para exibir no site.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Adicionar Modalidade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Categoria/Modalidade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Categoria</Label>
                <Input
                  placeholder="Ex: Futsal Masculino Sub-17"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddCategory}>Adicionar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Advanced Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[200px] relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left w-full"
          />
        </div>

        <div className="flex bg-white/0 items-center gap-4">
          <div className="flex-1">
            <Filters
              fields={filterFields}
              filters={filters}
              onChange={(newFilters) => setFilters(newFilters)}
              addButton={
                <Button
                  size="sm"
                  variant="outline"
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

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground mt-6">
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
            className="h-8 w-12 text-center p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Resultados por Modalidade
          </CardTitle>
          <CardDescription>
            Preencha o nome da equipe ou atleta campeão de cada categoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  Modalidade / Categoria
                </TableHead>
                <TableHead>Campeão</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                currentResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      {result.categoryName}
                    </TableCell>
                    <TableCell>
                      <div className="relative max-w-md">
                        <Medal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warning" />
                        <Input
                          value={result.champion}
                          onChange={(e) =>
                            handleChampionChange(result.id, e.target.value)
                          }
                          placeholder="Digite o nome do campeão..."
                          className="pl-9"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {result.champion ? (
                        <Badge className="bg-success hover:bg-success/80">
                          Definido
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteResult(result.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {eventResults.length > 0 && (
        <div className="flex justify-end">
          <p className="text-sm text-muted-foreground">
            As alterações são salvas automaticamente.
          </p>
        </div>
      )}
    </div>
  )
}
