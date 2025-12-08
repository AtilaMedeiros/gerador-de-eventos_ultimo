import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Megaphone,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  User,
  Heart,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

const noticeSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  category: z.string().min(1, 'Selecione uma categoria'),
  description: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres'),

  author: z.string(),
})

type NoticeFormValues = z.infer<typeof noticeSchema>

interface NoticesTabProps {
  eventId: string
}

export function NoticesTab({ eventId }: NoticesTabProps) {
  const { user } = useAuth()
  const { notices, addNotice, deleteNotice } = useCommunication()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter notices for current event
  const eventNotices = notices.filter((n) => n.eventId === eventId)

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      author: user?.name || '',
    },
  })

  const onSubmit = (data: NoticeFormValues) => {
    addNotice({
      ...data,
      date: new Date(),
      time: format(new Date(), 'HH:mm'),
      eventId,
    })

    setIsDialogOpen(false)
    form.reset({
      title: '',
      category: '',
      description: '',
      author: user?.name || '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Mural de Avisos</h3>
          <p className="text-sm text-muted-foreground">
            Publique atualizações rápidas para os participantes do evento.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Aviso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Aviso</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Mudança de Local" {...field} />
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
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Plantão">Plantão</SelectItem>
                          <SelectItem value="Últimas Notícias">
                            Últimas Notícias
                          </SelectItem>
                          <SelectItem value="Informativo">
                            Informativo
                          </SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />



                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite os detalhes do aviso..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
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

                <div className="flex justify-end pt-4">
                  <Button type="submit">Salvar Aviso</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {eventNotices.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-muted/20 rounded-lg border border-dashed">
            <Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              Nenhum aviso publicado para este evento.
            </p>
          </div>
        ) : (
          eventNotices.map((notice) => (
            <div
              key={notice.id}
              className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive bg-white/80 backdrop-blur-sm dark:bg-black/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotice(notice.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border transition-colors',
                    notice.category === 'Urgente'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : notice.category === 'Plantão'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : notice.category === 'Últimas Notícias'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200',
                  )}
                >
                  {notice.category}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground group-hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">24</span>
                </div>
              </div>

              <h3 className="font-semibold tracking-tight text-[16px] mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {notice.title}
              </h3>

              <p className="text-muted-foreground text-[13px] line-clamp-3 mb-4 flex-grow">
                {notice.description}
              </p>

              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-auto">
                <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>
                    {format(notice.date, "dd 'de' MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                  <User className="w-4 h-4 text-primary" />
                  <span className="truncate">{notice.author}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
