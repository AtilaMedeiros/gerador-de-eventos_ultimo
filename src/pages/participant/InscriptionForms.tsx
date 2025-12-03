import { useState } from 'react'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Printer, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function InscriptionForms() {
  const { events } = useEvent()
  const { inscriptions } = useParticipant()
  const { modalities } = useModality()
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [search, setSearch] = useState('')

  // Group inscriptions by modality for the selected event
  const getGroupedModalities = () => {
    if (!selectedEventId) return []

    const eventInscriptions = inscriptions.filter(
      (i) => i.eventId === selectedEventId,
    )

    // Set of unique modality IDs
    const modalityIds = Array.from(
      new Set(eventInscriptions.map((i) => i.modalityId)),
    )

    return modalityIds
      .map((mid) => modalities.find((m) => m.id === mid))
      .filter((m) => !!m)
      .filter((m) => m!.name.toLowerCase().includes(search.toLowerCase()))
  }

  const handlePrint = (modalityId: string) => {
    // In a real app, you would open a PDF or a print-specific route
    // For now, we'll open a new window with the print view
    window.open(
      `/area-do-participante/imprimir/${selectedEventId}/${modalityId}`,
      '_blank',
    )
  }

  const list = getGroupedModalities()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Ficha de Inscrição</h2>
      <p className="text-muted-foreground">
        Gere e imprima as fichas de inscrição por modalidade.
      </p>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="w-full md:w-64 space-y-2">
          <label className="text-sm font-medium">Selecione o Evento</label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger>
              <SelectValue placeholder="Evento..." />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Buscar Modalidade</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ex: Futsal"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={!selectedEventId}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead>Naipe</TableHead>
              <TableHead>Faixa Etária</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!selectedEventId ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Selecione um evento para ver as fichas disponíveis.
                </TableCell>
              </TableRow>
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma inscrição encontrada para este evento/filtro.
                </TableCell>
              </TableRow>
            ) : (
              list.map((mod) => (
                <TableRow key={mod!.id}>
                  <TableCell className="capitalize">{mod!.type}</TableCell>
                  <TableCell className="font-medium">{mod!.name}</TableCell>
                  <TableCell className="capitalize">{mod!.gender}</TableCell>
                  <TableCell>
                    {mod!.minAge} a {mod!.maxAge} anos
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint(mod!.id)}
                    >
                      <Printer className="mr-2 h-4 w-4" /> Imprimir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
