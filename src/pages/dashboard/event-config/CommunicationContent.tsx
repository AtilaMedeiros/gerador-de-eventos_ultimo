import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Megaphone, FileText, Trophy, Scale, Search } from 'lucide-react'
import { NoticesTab } from './communication-tabs/NoticesTab'
import { BulletinsTab } from './communication-tabs/BulletinsTab'
import { ResultsTab } from './communication-tabs/ResultsTab'
import { RegulationsTab } from './communication-tabs/RegulationsTab'

import { Filters, FilterFieldConfig, Filter } from '@/components/ui/filters'
import { Calendar, CalendarHeart } from 'lucide-react'
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

                <div className="hidden md:block">
                    <Filters
                        fields={[
                            {
                                key: 'active',
                                label: 'Evento Ativo',
                                type: 'boolean',
                                icon: <CalendarHeart className="h-4 w-4" />,
                                activeLabel: ''
                            },
                            {
                                key: 'eventId',
                                label: 'Evento',
                                type: 'select',
                                icon: <Calendar className="h-4 w-4" />,
                                options: events.map(e => ({ label: e.name, value: e.id }))
                            }
                        ]}
                        filters={[
                            {
                                id: 'event-filter',
                                field: 'eventId',
                                operator: 'eq',
                                value: eventId || ''
                            },
                            {
                                id: 'active-filter',
                                field: 'active',
                                operator: 'eq',
                                value: 'true'
                            }
                        ]}
                        onChange={(newFilters) => {
                            const eventFilter = newFilters.find(f => f.field === 'eventId')
                            // Always keep 'active' filter true or respect user toggle?
                            // User said "por padrao fica setado".
                            // If user removes 'active', we let it go? 
                            // For visual consistency, I'll mainly listen to 'eventId'.
                            if (eventFilter && eventFilter.value !== eventId) {
                                onEventSelect(eventFilter.value)
                            } else if (!eventFilter && eventId) {
                                // Event filter removed
                                onEventSelect('')
                            }
                        }}
                        className="justify-end"
                    />
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
