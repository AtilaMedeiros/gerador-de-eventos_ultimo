import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  FileText,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  User,
  Download,
  Heart,
  Search,
  Type,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
} from 'lucide-react'
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
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useCommunication } from '@/contexts/CommunicationContext'
import { FileUpload } from '@/components/FileUpload'

const bulletinSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  category: z.string().min(1, 'Selecione uma categoria'),
  description: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres'),

  author: z.string(),
  files: z
    .array(z.instanceof(File))
    .min(1, 'É necessário anexar um arquivo PDF'),
})

type BulletinFormValues = z.infer<typeof bulletinSchema>

interface BulletinsTabProps {
  eventId: string
}

const filterFields: FilterFieldConfig[] = [
  {
    key: 'title',
    label: 'Título',
    icon: <Type className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por título...',
  },
  {
    key: 'category',
    label: 'Categoria',
    icon: <Tag className="size-3.5" />,
    type: 'text',
    placeholder: 'Filtrar por categoria...',
  },
  {
    key: 'description',
    label: 'Descrição',
    icon: <FileText className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar na descrição...',
  },
  {
    key: 'author',
    label: 'Autor',
    icon: <User className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por autor...',
  },
  {
    key: 'date',
    label: 'Data de Criação',
    icon: <CalendarIcon className="size-3.5" />,
    type: 'date',
    placeholder: 'Selecione a data...',
  }
]

export function BulletinsTab({ eventId }: BulletinsTabProps) {
  const { user } = useAuth()
  const { bulletins, addBulletin, updateBulletin, deleteBulletin } = useCommunication()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])

  // Filter bulletins for current event
  const eventBulletins = bulletins.filter((b) => b.eventId === eventId)

  const filteredBulletins = eventBulletins.filter((bulletin) => {
    // Global Search (Search bar)
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = bulletin.title.toLowerCase().includes(searchLower) ||
      bulletin.description.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    // Specific Filters
    if (filters.length === 0) return true

    return filters.every(filter => {
      const value = filter.value?.toString().toLowerCase() || ''
      if (value === '') return true

      if (filter.field === 'title') {
        return bulletin.title.toLowerCase().includes(value)
      }
      if (filter.field === 'category') {
        return bulletin.category.toLowerCase().includes(value)
      }
      if (filter.field === 'description') {
        return bulletin.description.toLowerCase().includes(value)
      }
      if (filter.field === 'author') {
        return bulletin.author.toLowerCase().includes(value)
      }
      if (filter.field === 'date') {
        if (!value) return true
        const bulletinDate = format(bulletin.date, 'yyyy-MM-dd')
        return bulletinDate === value
      }
      return true
    })
  })

  // Selected Bulletin State
  const [selectedBulletin, setSelectedBulletin] = useState<any | null>(null)

  // Bulletin to Delete State
  const [bulletinToDelete, setBulletinToDelete] = useState<string | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | string>(12)

  // Pagination Logic
  const pageSize = Number(itemsPerPage) > 0 ? Number(itemsPerPage) : 12
  const totalPages = Math.ceil(filteredBulletins.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentBulletins = filteredBulletins.slice(startIndex, endIndex)

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  const form = useForm<BulletinFormValues>({
    resolver: zodResolver(bulletinSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      author: user?.name || '',
      files: [],
    },
  })

  const onSubmit = (data: BulletinFormValues) => {
    // In a real app, we would upload the file here.
    // For this demo, we just save the metadata.
    if (editingId) {
      updateBulletin(editingId, {
        ...data,
        // Assuming file handling for edit might be more complex or not directly through `files` array for existing files
        // For now, just passing the data as is.
      })
      setEditingId(null)
    } else {
      // In a real app, we would upload the file here.
      // For this demo, we just save the metadata.
      const fileName = data.files[0]
        ? data.files[0].name
        : 'arquivo_desconhecido.pdf'

      addBulletin({
        title: data.title,
        category: data.category,
        description: data.description,
        date: new Date(),
        time: format(new Date(), 'HH:mm'),
        author: data.author,
        fileName: fileName,
        eventId,
      })
    }

    setIsDialogOpen(false)
    form.reset({
      title: '',
      category: '',
      description: '',
      author: user?.name || '',
      files: [],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Boletins Oficiais</h3>
          <p className="text-sm text-muted-foreground">
            Divulgue documentos oficiais e programação em PDF.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingId(null)
              form.reset({
                title: '',
                category: '',
                description: '',
                author: user?.name || '',
                files: [], // Ensure files are reset
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Boletim
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Boletim' : 'Publicar Novo Boletim'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Boletim 01 - Resultados"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                            <SelectItem value="Boletim Diário">
                              Boletim Diário
                            </SelectItem>
                            <SelectItem value="Programação">
                              Programação
                            </SelectItem>
                            <SelectItem value="Resultados Oficiais">
                              Resultados Oficiais
                            </SelectItem>
                            <SelectItem value="Nota Oficial">
                              Nota Oficial
                            </SelectItem>
                            <SelectItem value="Retificação">
                              Retificação
                            </SelectItem>
                            <SelectItem value="Regular">
                              Regular
                            </SelectItem>
                            <SelectItem value="Geral">
                              Geral
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registro de quem criou</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome do autor" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>



              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Resumo do conteúdo do boletim..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FileUpload
                      label="Anexo PDF"
                      description="Selecione o arquivo do boletim (PDF)."
                      accept="application/pdf"
                      maxSizeMB={10}
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.files?.message as string}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit">Salvar Boletim</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>

      {/* Search and Advanced Filters */ }
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredBulletins.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-muted/20 rounded-lg border border-dashed">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhum boletim encontrado.</p>
          </div>
        ) : (
          currentBulletins.map((bulletin) => (
            <div
              key={bulletin.id}
              onClick={() => setSelectedBulletin(bulletin)}
              className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
            >

              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary bg-white/80 backdrop-blur-sm dark:bg-black/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingId(bulletin.id)
                    form.reset({
                      title: bulletin.title,
                      category: bulletin.category,
                      description: bulletin.description,
                      author: bulletin.author,
                    })
                    setIsDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive bg-white/80 backdrop-blur-sm dark:bg-black/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    setBulletinToDelete(bulletin.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    'inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors',
                    bulletin.category === 'Nota Oficial'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : bulletin.category === 'Boletim Diário'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : bulletin.category === 'Resultados Oficiais'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200',
                  )}
                >
                  {bulletin.category}
                </div>

              </div>

              <h3 className="font-semibold tracking-tight text-[16px] mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {bulletin.title}
              </h3>

              <p className="text-muted-foreground text-[13px] line-clamp-2 mb-4 flex-grow">
                {bulletin.description}
              </p>

              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-auto">
                <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>
                    {format(new Date(bulletin.date), "dd 'de' MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                  <User className="w-4 h-4 text-primary" />
                  <span className="truncate">{bulletin.author}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

  {/* Pagination Controls */ }
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

  {/* Detail Modal */ }
      <Dialog open={!!selectedBulletin} onOpenChange={(open) => !open && setSelectedBulletin(null)}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[550px] w-full [&>button]:hidden">
          {selectedBulletin && (
            <div className="w-[550px] h-[550px] flex flex-col rounded-xl bg-white text-card-foreground shadow-2xl border-2 border-orange-100 overflow-hidden text-left relative animate-in zoom-in-95 duration-300">

              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div className="pr-8">
                  <div className="inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border mb-3 bg-purple-100 text-purple-800 border-purple-200">
                    {selectedBulletin.category}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {selectedBulletin.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedBulletin(null)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto text-base text-muted-foreground leading-relaxed whitespace-pre-wrap p-6">
                {selectedBulletin.description}
              </div>

              <div className="flex flex-col gap-3 px-6 pb-6 pt-4 border-t border-border mt-auto bg-gray-50/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span className="text-base">{format(new Date(selectedBulletin.date), "dd 'de' MMM yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-5 h-5 text-primary" />
                  <span className="text-base">{selectedBulletin.author}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!bulletinToDelete} onOpenChange={() => setBulletinToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente este boletim.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (bulletinToDelete) {
                  deleteBulletin(bulletinToDelete)
                  setBulletinToDelete(null)
                }
              }}
            >
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  )
}
