import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Megaphone, FileText, Trophy, Scale, Search } from 'lucide-react'
import { NoticesTab } from './communication-tabs/NoticesTab'
import { BulletinsTab } from './communication-tabs/BulletinsTab'
import { ResultsTab } from './communication-tabs/ResultsTab'
import { RegulationsTab } from './communication-tabs/RegulationsTab'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Event } from '@/contexts/EventContext'
interface CommunicationContentProps {
    eventId: string
    events: Event[]
    onEventSelect: (value: string) => void
}

export function CommunicationContent({ eventId, events, onEventSelect }: CommunicationContentProps) {
    const [activeTab, setActiveTab] = useState('avisos')

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <div className="flex items-center justify-between overflow-x-auto pb-1">
                <TabsList className="h-12 bg-muted/20 p-1 gap-1 w-full md:w-auto supports-[backdrop-filter]:bg-background/60 backdrop-blur">
                    <TabsTrigger value="avisos" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 px-4 gap-2">
                        <Megaphone className="h-4 w-4" />
                        <span className="hidden sm:inline">Mural de</span> Avisos
                    </TabsTrigger>
                    <TabsTrigger value="boletins" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 px-4 gap-2">
                        <FileText className="h-4 w-4" /> Boletins
                    </TabsTrigger>
                    <TabsTrigger value="resultados" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 px-4 gap-2">
                        <Trophy className="h-4 w-4" /> Resultados
                    </TabsTrigger>
                    <TabsTrigger value="regulamentos" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 px-4 gap-2">
                        <Scale className="h-4 w-4" /> Regulamentos
                    </TabsTrigger>
                </TabsList>

                <div className="hidden md:block w-[300px]">
                    <Select
                        value={eventId}
                        onValueChange={onEventSelect}
                    >
                        <SelectTrigger className="h-10 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 focus:ring-primary/20 shadow-sm transition-all text-xs">
                            <div className="flex items-center gap-2 truncate">
                                <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider shrink-0">Evento Ativo:</span>
                                <span className="truncate font-medium flex-1 text-left">
                                    {events.find(e => e.id === eventId)?.name || "Selecione..."}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent align="end">
                            {events.map((event) => (
                                <SelectItem key={event.id} value={event.id} className="cursor-pointer">
                                    <div className="flex flex-col gap-0.5 py-1">
                                        <span className="font-medium">{event.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(event.startDate), "d 'de' MMM, yyyy", { locale: ptBR })}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="min-h-[400px] border rounded-2xl bg-card/30 p-1">
                {!eventId ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center animate-pulse-slow">
                            <Search className="h-10 w-10 text-primary/40" />
                        </div>
                        <div className="max-w-md space-y-2">
                            <h3 className="text-xl font-bold">Selecione um evento para começar</h3>
                            <p className="text-muted-foreground">
                                Utilize o seletor acima para escolher o evento que deseja gerenciar.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabsContent value="avisos" className="m-0 focus-visible:outline-none">
                            <NoticesTab eventId={eventId} />
                        </TabsContent>

                        <TabsContent value="boletins" className="m-0 focus-visible:outline-none">
                            <BulletinsTab eventId={eventId} />
                        </TabsContent>

                        <TabsContent value="resultados" className="m-0 focus-visible:outline-none">
                            <ResultsTab eventId={eventId} />
                        </TabsContent>

                        <TabsContent value="regulamentos" className="m-0 focus-visible:outline-none">
                            <RegulationsTab eventId={eventId} />
                        </TabsContent>
                    </div>
                )}
            </div>
        </Tabs>
    )
}
