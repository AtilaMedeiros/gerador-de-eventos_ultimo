import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Megaphone, FileText, Trophy, Scale } from 'lucide-react'
import { NoticesTab } from './communication-tabs/NoticesTab'
import { BulletinsTab } from './communication-tabs/BulletinsTab'
import { ResultsTab } from './communication-tabs/ResultsTab'
import { RegulationsTab } from './communication-tabs/RegulationsTab'

interface CommunicationContentProps {
    eventId: string
}

export function CommunicationContent({ eventId }: CommunicationContentProps) {
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
            </div>

            <div className="min-h-[400px] border rounded-2xl bg-card/30 p-1">
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
            </div>
        </Tabs>
    )
}
