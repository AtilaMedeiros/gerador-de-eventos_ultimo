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
} from 'lucide-react'

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

export function BulletinsTab({ eventId }: BulletinsTabProps) {
  const { user } = useAuth()
  const { bulletins, addBulletin, deleteBulletin } = useCommunication()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter bulletins for current event
  const eventBulletins = bulletins.filter((b) => b.eventId === eventId)

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Boletim
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Publicar Novo Boletim</DialogTitle>
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
                          <SelectContent>
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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {eventBulletins.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-muted/20 rounded-lg border border-dashed">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhum boletim publicado.</p>
          </div>
        ) : (
          eventBulletins.map((bulletin) => (
            <div
              key={bulletin.id}
              className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive bg-white/80 backdrop-blur-sm dark:bg-black/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteBulletin(bulletin.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border bg-secondary text-secondary-foreground border-border transition-colors">
                  {bulletin.category}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground group-hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">18</span>
                </div>
              </div>

              <h3 className="font-semibold tracking-tight text-[16px] mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {bulletin.title}
              </h3>

              <p className="text-muted-foreground text-[13px] line-clamp-3 mb-4 flex-grow">
                {bulletin.description}
              </p>

              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-auto">
                <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>
                    {format(bulletin.date, "dd 'de' MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground group/file cursor-pointer hover:text-primary transition-colors">
                  <Download className="w-4 h-4 text-primary" />
                  <span className="truncate">{bulletin.fileName}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
