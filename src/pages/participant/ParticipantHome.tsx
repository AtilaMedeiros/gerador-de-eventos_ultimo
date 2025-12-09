import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Calendar,
  Ticket,
  ArrowRight,
  ExternalLink,
  Activity,
  Trophy,
  AlertCircle,
  CalendarDays,
  Plus,
  Search,
} from 'lucide-react'
import { format, differenceInDays, differenceInHours, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useEvent } from '@/contexts/EventContext'
import { useParticipant } from '@/contexts/ParticipantContext'

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function ParticipantHome() {
  const navigate = useNavigate()
  const { events } = useEvent()
  const { inscriptions, athletes } = useParticipant()

  // 1. Filter Active Events
  const activeEvents = useMemo(() => {
    return events.filter((e) => e.status === 'published')
  }, [events])

  // 2. Metrics
  const openEventsCount = activeEvents.length
  const confirmedInscriptionsCount = inscriptions.length
  const totalAthletes = athletes.length

  // 3. Helper for Inscription Status
  const getInscriptionStatus = (eventId: string) => {
    const hasInscriptions = inscriptions.some((i) => i.eventId === eventId)
    return hasInscriptions ? 'Inscrito' : 'Disponível'
  }

  const handleOpenPublicPage = (event: any) => {
    const slug = generateSlug(event.name)
    window.open(`/evento/${slug}/${event.id}`, '_blank')
  }

  // 4. Find the most urgent deadline (optional logic for countdowns)
  const nextDeadline = useMemo(() => {
    const dates = activeEvents
      .map(e => new Date(e.registrationIndividualEnd))
      .filter(date => !isPast(date))
      .sort((a, b) => a.getTime() - b.getTime())
    return dates[0]
  }, [activeEvents])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Visão Geral
          </h2>
          <p className="text-muted-foreground mt-1">
            Resumo da sua participação e gestão de atletas.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
            onClick={() => navigate('/area-do-participante/atletas/novo')}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Atleta
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1: Open Events */}
        <Card className="border-none shadow-md bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-blue-100">
              Eventos Disponíveis
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {openEventsCount}
            </div>
            <p className="text-xs text-blue-200 mt-1 flex items-center">
              <ArrowRight className="h-3 w-3 mr-1" /> Campeonatos abertos
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Inscriptions */}
        <Card className="border-none shadow-md bg-gradient-to-br from-violet-600 to-violet-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-violet-100">
              Minhas Inscrições
            </CardTitle>
            <Ticket className="h-5 w-5 text-violet-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {confirmedInscriptionsCount}
            </div>
            <p className="text-xs text-violet-200 mt-1 flex items-center">
              <ArrowRight className="h-3 w-3 mr-1" /> Vagas confirmadas
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Athletes */}
        <Card className="border-none shadow-md bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-emerald-100">
              Atletas Cadastrados
            </CardTitle>
            <Users className="h-5 w-5 text-emerald-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {totalAthletes}
            </div>
            <p className="text-xs text-emerald-200 mt-1 flex items-center">
              <ArrowRight className="h-3 w-3 mr-1" /> Base de talentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Countdowns Row (Optional - If there is a deadline) */}
      {nextDeadline && (
        <div className="grid gap-6 md:grid-cols-1">
          <CountdownCard
            title="Próximo Encerramento de Inscrições"
            date={nextDeadline}
            icon={CalendarDays}
            colorClass="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800"
            iconClass="text-amber-600 dark:text-amber-400"
          />
        </div>
      )}


      {/* Main Content: KPIs and Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Chart: Athletes by Gender */}
        <Card className="col-span-4 border shadow-sm">
          <CardHeader>
            <CardTitle>Distribuição de Atletas</CardTitle>
            <CardDescription>
              Total de atletas cadastrados por gênero.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AthletesGenderChart athletes={athletes} />
          </CardContent>
        </Card>

        {/* Recent Activity / Additional KPIs */}
        <Card className="col-span-3 border shadow-sm">
          <CardHeader>
            <CardTitle>Inscrições Recentes</CardTitle>
            <CardDescription>
              Últimas atualizações de inscrição.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentInscriptionsList inscriptions={inscriptions} events={events} />
          </CardContent>
        </Card>
      </div>

      {/* New Table: Atletas Inscritos por Categoria */}
      <InscribedAthletesTable inscriptions={inscriptions} events={activeEvents} />
    </div>
  )
}

// --- Sub-components ---

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'
import { useModality } from '@/contexts/ModalityContext'


function InscribedAthletesTable({ inscriptions, events }: { inscriptions: any[], events: any[] }) {
  const { modalities } = useModality()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])

  const filterFields: FilterFieldConfig[] = [
    {
      key: 'categoryName',
      label: 'Modalidade',
      icon: <Trophy className="size-3.5" />,
      type: 'text',
      placeholder: 'Ex: Futsal',
    },
    {
      key: 'modalityType',
      label: 'Tipo',
      icon: <Activity className="size-3.5" />,
      type: 'select',
      options: [
        { label: 'Coletiva', value: 'Coletiva' },
        { label: 'Individual', value: 'Individual' },
      ],
      placeholder: 'Selecione o tipo',
    }
  ]

  const groupedData = useMemo(() => {
    const groups: Record<string, any> = {}

    inscriptions.forEach(insc => {
      const mod = modalities.find(m => m.id === insc.modalityId)
      if (!mod) return

      const key = `${mod.name}-${mod.type}-${mod.gender}-${mod.minAge}-${mod.maxAge}`

      if (!groups[key]) {
        groups[key] = {
          modalityType: mod.type === 'coletiva' ? 'Coletiva' : 'Individual',
          categoryName: mod.name,
          gender: mod.gender,
          ageRange: `${mod.minAge} a ${mod.maxAge}`,
          count: 0
        }
      }
      groups[key].count++
    })

    return Object.values(groups)
  }, [inscriptions, modalities])

  const filteredData = groupedData.filter(item => {
    // Global Search
    const searchLower = search.toLowerCase()
    const matchesSearch =
      item.categoryName.toLowerCase().includes(searchLower) ||
      item.modalityType.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    // Specific Filters
    if (filters.length === 0) return true

    return filters.every(filter => {
      const value = filter.value?.toString().toLowerCase() || ''
      if (value === '') return true

      switch (filter.field) {
        case 'categoryName':
          return item.categoryName.toLowerCase().includes(value)
        case 'modalityType':
          return item.modalityType.toLowerCase() === value
        default:
          return true
      }
    })
  })

  return (
    <div className="space-y-6 relative rounded-xl border border-blue-100 bg-white/50 dark:bg-black/20 dark:border-blue-900/50 shadow-sm p-6 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Atletas Inscritos por Categoria
          </h3>
          <p className="text-muted-foreground mt-1">
            Visão agrupada das inscrições confirmadas.
          </p>
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[200px] relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder="Pesquisar por modalidade ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left w-full"
          />
        </div>

        <div className="flex bg-white items-center gap-4">
          <div className="flex-1">
            <Filters
              fields={filterFields}
              filters={filters}
              onChange={setFilters}
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

      <div className="rounded-lg border border-blue-200 dark:border-blue-900/50 bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden shadow-inner">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
              <TableHead className="w-[120px] font-semibold text-primary/80 h-12 uppercase text-xs tracking-wider">Tipo</TableHead>
              <TableHead className="w-[200px] font-semibold text-primary/80 h-12 uppercase text-xs tracking-wider">Modalidade</TableHead>
              <TableHead className="w-[150px] font-semibold text-primary/80 h-12 uppercase text-xs tracking-wider">Categoria</TableHead>
              <TableHead className="w-[120px] font-semibold text-primary/80 h-12 uppercase text-xs tracking-wider">Naipe</TableHead>
              <TableHead className="w-[80px] font-semibold text-primary/80 h-12 uppercase text-xs tracking-wider text-center">Qtd.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
                    <p>Nenhum registro encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, i) => (
                <TableRow key={i} className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-50 dark:border-blue-900/10 group last:border-0">
                  <TableCell className="font-medium text-foreground/90">
                    <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary hover:bg-primary/10 transition-colors">
                      {row.modalityType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground/80">{row.categoryName}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {row.ageRange}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{row.gender}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:scale-110">
                        {row.count}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-primary/5 hover:text-primary transition-colors">
            Imprimir
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-primary/5 hover:text-primary transition-colors">
            Excel
          </Button>
        </div>
        <div>
          Mostrando {filteredData.length} categorias
        </div>
      </div>
    </div>
  )
}

function AthletesGenderChart({ athletes }: { athletes: any[] }) {
  const data = useMemo(() => {
    const male = athletes.filter(a => a.sex === 'Masculino').length
    const female = athletes.filter(a => a.sex === 'Feminino').length
    return [
      { name: 'Masculino', total: male, fill: '#3b82f6' },
      { name: 'Feminino', total: female, fill: '#ec4899' },
    ]
  }, [athletes])

  if (athletes.length === 0) {
    return <div className="h-[350px] flex items-center justify-center text-muted-foreground">Nenhum atleta cadastrado.</div>
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {payload[0].payload.name}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function RecentInscriptionsList({ inscriptions, events }: { inscriptions: any[], events: any[] }) {
  // Mock recent logic or just take last 5
  // Assuming inscriptions might not have timestamps in this mock context, unshift logic usually puts newest first?
  // Let's take slice 0-5
  const recent = inscriptions.slice(0, 5)

  if (recent.length === 0) {
    return <EmptyState text="Nenhuma inscrição realizada ainda." />
  }

  return (
    <div className="space-y-4">
      {recent.map((insc, i) => {
        const event = events.find(e => e.id === insc.eventId)
        return (
          <div key={i} className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{event?.name || 'Evento Desconhecido'}</p>
              <p className="text-sm text-muted-foreground">
                Status: {insc.status}
              </p>
            </div>
            <div className={`ml-auto font-medium ${insc.status === 'Confirmada' ? 'text-green-500' : 'text-amber-500'}`}>
              {insc.status === 'Confirmada' ? 'Confirmado' : 'Pendente'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CountdownCard({
  title,
  date,
  icon: Icon,
  colorClass,
  iconClass,
}: {
  title: string
  date?: Date
  icon: any
  colorClass: string
  iconClass: string
}) {
  if (!date) return null

  const isFinished = isPast(date)
  const daysLeft = differenceInDays(date, new Date())
  const hoursLeft = differenceInHours(date, new Date()) % 24

  return (
    <Card className={cn('border shadow-sm overflow-hidden', colorClass)}>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'h-10 w-10 rounded-lg flex items-center justify-center bg-white dark:bg-background shadow-sm',
              iconClass,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              {isFinished ? (
                <span className="text-2xl font-bold text-muted-foreground">
                  Encerrado
                </span>
              ) : (
                <>
                  <span className="text-3xl font-bold tracking-tight">
                    {daysLeft}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    dias
                  </span>
                  {daysLeft < 3 && (
                    <>
                      <span className="ml-2 text-lg font-bold">{hoursLeft}</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        h
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {!isFinished && daysLeft < 5 && (
        <div className="h-1 w-full bg-primary/20">
          <div className="h-full bg-primary w-[80%] animate-pulse" />
        </div>
      )}
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="p-3 rounded-full bg-muted/30 mb-3">
        <AlertCircle className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground max-w-sm">{text}</p>
    </div>
  )
}
