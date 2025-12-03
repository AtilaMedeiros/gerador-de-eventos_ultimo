import { useParams, useSearchParams } from 'react-router-dom'
import { PublicHeader } from './components/PublicHeader'
import { PublicFooter } from './components/PublicFooter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Megaphone,
  FileText,
  Trophy,
  Clock,
  Download,
  Medal,
  Calendar,
  User,
  Info,
  Scale,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useCommunication } from '@/contexts/CommunicationContext'
import { useEvent } from '@/contexts/EventContext'

export default function EventCommunicationPage() {
  const { slug, id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getEventById } = useEvent()
  const { notices, bulletins, results, regulations } = useCommunication()

  const eventData = id ? getEventById(id) : undefined
  const eventName = eventData?.name || slug || 'Evento'

  // Filter Data by Event ID
  const eventNotices = notices.filter((n) => n.eventId === id)
  const eventBulletins = bulletins.filter((b) => b.eventId === id)
  const eventResults = results.filter((r) => r.eventId === id)
  const eventRegulations = regulations.filter((r) => r.eventId === id)

  // Get active tab from query params or default to 'avisos'
  const defaultTab = searchParams.get('tab') || 'avisos'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 flex flex-col">
      <PublicHeader title={eventName as string} />

      {/* Hero Section - Smaller for internal pages */}
      <div className="relative bg-slate-900 text-white pt-24 pb-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.usecurling.com/p/1920/600?q=stadium%20lights&color=blue"
            alt="Header Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-4 text-primary/80">
            <Megaphone className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Canal Oficial
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Comunicação do Evento
          </h1>
          <p className="text-slate-300 max-w-2xl text-lg">
            Acompanhe aqui todos os avisos, boletins oficiais, resultados e
            regulamentos.
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 -mt-8 relative z-20">
        <div className="bg-card rounded-xl border shadow-lg overflow-hidden min-h-[500px]">
          <Tabs
            defaultValue={defaultTab}
            value={defaultTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="border-b bg-muted/30 px-4 md:px-6 pt-4 overflow-x-auto">
              <TabsList className="bg-transparent p-0 h-auto space-x-6 flex-nowrap">
                <TabsTrigger
                  value="avisos"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-base text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none transition-all"
                >
                  <Megaphone className="mr-2 h-4 w-4" />
                  Avisos
                </TabsTrigger>
                <TabsTrigger
                  value="boletins"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-base text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none transition-all"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Boletins
                </TabsTrigger>
                <TabsTrigger
                  value="resultados"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-base text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none transition-all"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Resultados
                </TabsTrigger>
                <TabsTrigger
                  value="regulamentos"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-base text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none transition-all"
                >
                  <Scale className="mr-2 h-4 w-4" />
                  Regulamentos
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 md:p-8">
              {/* AVISOS TAB */}
              <TabsContent
                value="avisos"
                className="space-y-6 mt-0 animate-fade-in"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Megaphone className="h-6 w-6 text-primary" />
                      Mural de Avisos
                    </h2>
                    <p className="text-muted-foreground">
                      Fique atento às últimas atualizações, informativos e notas
                      urgentes.
                    </p>
                  </div>
                </div>

                {eventNotices.length === 0 ? (
                  <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Nenhum aviso publicado até o momento.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {eventNotices.map((notice) => (
                      <Card
                        key={notice.id}
                        className="hover:border-primary/50 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant={
                                    notice.category === 'Urgente'
                                      ? 'destructive'
                                      : notice.category === 'Plantão'
                                        ? 'default'
                                        : notice.category === 'Últimas Notícias'
                                          ? 'default'
                                          : 'secondary'
                                  }
                                  className={cn(
                                    'rounded-full',
                                    notice.category === 'Plantão' &&
                                      'bg-yellow-500 hover:bg-yellow-600',
                                    notice.category === 'Últimas Notícias' &&
                                      'bg-green-500 hover:bg-green-600',
                                  )}
                                >
                                  {notice.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(notice.date, 'dd/MM/yyyy')} às{' '}
                                  {notice.time}
                                </span>
                              </div>
                              <CardTitle className="text-xl">
                                {notice.title}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-foreground text-base leading-relaxed border-l-4 border-muted pl-4">
                            {notice.description}
                          </CardDescription>
                          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            Publicado por: {notice.author}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* BOLETINS TAB */}
              <TabsContent
                value="boletins"
                className="space-y-6 mt-0 animate-fade-in"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      Boletins Oficiais
                    </h2>
                    <p className="text-muted-foreground">
                      Baixe documentos, programações e notas oficiais.
                    </p>
                  </div>
                </div>

                {eventBulletins.length === 0 ? (
                  <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Nenhum boletim disponível.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {eventBulletins.map((bulletin) => (
                      <Card
                        key={bulletin.id}
                        className="group hover:border-primary/50 transition-all"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-1 p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="bg-muted/50">
                                {bulletin.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(bulletin.date, 'dd/MM/yyyy')}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                              {bulletin.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4">
                              {bulletin.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Arquivo: {bulletin.fileName}
                            </div>
                          </div>
                          <div className="bg-muted/30 border-t md:border-t-0 md:border-l p-6 flex items-center justify-center md:w-48 shrink-0">
                            <Button className="w-full md:w-auto gap-2 shadow-sm">
                              <Download className="h-4 w-4" />
                              Baixar PDF
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* RESULTADOS TAB */}
              <TabsContent
                value="resultados"
                className="space-y-6 mt-0 animate-fade-in"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-warning" />
                      Galeria de Campeões
                    </h2>
                    <p className="text-muted-foreground">
                      Conheça os vencedores de cada modalidade.
                    </p>
                  </div>
                </div>

                {eventResults.length === 0 ? (
                  <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Resultados ainda não divulgados.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventResults.map((result) => (
                      <div
                        key={result.id}
                        className="relative group overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
                        <div className="p-6 flex flex-col items-center text-center space-y-4">
                          <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-2 group-hover:scale-110 transition-transform">
                            <Trophy className="h-8 w-8" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                              Campeão
                            </p>
                            <h3 className="text-lg font-bold text-foreground leading-tight">
                              {result.champion || 'A Definir'}
                            </h3>
                          </div>
                          <div className="w-full pt-4 border-t">
                            <Badge variant="secondary" className="font-medium">
                              {result.categoryName}
                            </Badge>
                          </div>
                        </div>
                        {/* Decorative Confetti */}
                        <div className="absolute top-2 right-2 opacity-20">
                          <Medal className="h-12 w-12 text-yellow-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* REGULAMENTOS TAB (Includes Edital) */}
              <TabsContent
                value="regulamentos"
                className="space-y-6 mt-0 animate-fade-in"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Scale className="h-6 w-6 text-primary" />
                      Regulamentos e Editais
                    </h2>
                    <p className="text-muted-foreground">
                      Consulte as regras oficiais, editais e códigos de conduta.
                    </p>
                  </div>
                </div>

                {eventRegulations.length === 0 ? (
                  <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
                    <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Nenhum regulamento ou edital disponível.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {eventRegulations.map((reg) => (
                      <Card
                        key={reg.id}
                        className="group hover:border-primary/50 transition-all"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-1 p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'bg-muted/50',
                                  reg.category === 'Edital' &&
                                    'bg-purple-100 text-purple-700 border-purple-200',
                                )}
                              >
                                {reg.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(reg.date, 'dd/MM/yyyy')}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                              {reg.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4">
                              {reg.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Arquivo: {reg.fileName}
                            </div>
                          </div>
                          <div className="bg-muted/30 border-t md:border-t-0 md:border-l p-6 flex items-center justify-center md:w-48 shrink-0">
                            <Button className="w-full md:w-auto gap-2 shadow-sm">
                              <Download className="h-4 w-4" />
                              Baixar PDF
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <PublicFooter eventName={eventName as string} />
    </div>
  )
}
