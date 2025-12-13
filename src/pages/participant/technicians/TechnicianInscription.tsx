import { useState, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
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
  ArrowLeft,
  Plus,
  Trash2,
  User,
  AlertCircle,
  Calendar,
  Save,
} from 'lucide-react'
import { differenceInYears } from 'date-fns'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { InscriptionService } from '@/backend/services/inscription.service'

export default function TechnicianInscription() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId')

  const { technicians, inscriptions, addInscription, deleteInscription } =
    useParticipant()
  const { getEventById, getEventModalities } = useEvent()
  const { modalities } = useModality()

  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedModalityName, setSelectedModalityName] = useState<string>('')
  const [selectedProvaId, setSelectedProvaId] = useState<string>('')

  const technician = technicians.find((t) => t.id === id)
  const event = eventId ? getEventById(eventId) : null

  // Calculate age
  const age = technician ? differenceInYears(new Date(), technician.dob) : 0

  // 1. Get list of modalities associated with this event
  const allowedModalityIds = useMemo(() => {
    if (!eventId) return []
    return getEventModalities(eventId)
  }, [eventId, getEventModalities])

  // 2. Filter modalities based on eligibility and event association
  const eligibleModalities = useMemo(() => {
    if (!technician) return []

    return modalities.filter((mod) => {
      // Must be associated with the event
      // Must be associated with the event (if event has specific restrictions)
      if (allowedModalityIds.length > 0 && !allowedModalityIds.includes(mod.id)) return false

      // Gender Check
      const genderMatch =
        mod.gender === 'misto' ||
        mod.gender.toLowerCase() === technician.sex.toLowerCase()

      // Age Check
      const ageMatch = age >= mod.minAge && age <= mod.maxAge

      return genderMatch // && ageMatch -> Technicians usually don't have age restrictions for modalities like athletes
    })
  }, [modalities, technician, allowedModalityIds])

  // 3. Get Unique Types available for this athlete
  const availableTypes = useMemo(() => {
    const types = new Set(eligibleModalities.map((m) => m.type))
    return Array.from(types).sort()
  }, [eligibleModalities])

  // 4. Get Available Modalities Names based on Selected Type
  const availableModalityNames = useMemo(() => {
    if (!selectedType) return []
    const filtered = eligibleModalities.filter((m) => m.type === selectedType)
    const names = new Set(filtered.map((m) => m.name))
    return Array.from(names).sort()
  }, [eligibleModalities, selectedType])

  // 5. Get Available Provas (Modality IDs) based on Selected Modality Name
  const availableProvas = useMemo(() => {
    if (!selectedModalityName || !selectedType) return []
    return eligibleModalities.filter(
      (m) => m.type === selectedType && m.name === selectedModalityName,
    )
  }, [eligibleModalities, selectedType, selectedModalityName])

  // Check for invalid state early
  if (!technician || !event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h3 className="text-lg font-medium">Dados inválidos</h3>
          <p className="text-muted-foreground">
            Técnico ou evento não encontrado.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    let modalityIdToSave = selectedProvaId

    // If Coletiva, and only one option exists for the name (common case),
    // and user didn't select (because dropdown might be optional logic), we select it.
    // However, if dropdown IS shown, user MUST select.
    if (!modalityIdToSave && availableProvas.length === 1) {
      modalityIdToSave = availableProvas[0].id
    }

    if (!modalityIdToSave) {
      toast.error('Selecione todos os campos obrigatórios (Modalidade/Prova).')
      return
    }

    // Check duplicates
    const exists = inscriptions.some(
      (i) =>
        i.athleteId === id &&
        i.eventId === eventId &&
        i.modalityId === modalityIdToSave,
    )

    if (exists) {
      toast.error('Técnico já inscrito nesta modalidade/prova.')
      return
    }

    // Use Service Factory
    const newInscription = InscriptionService.createInscription({
      athleteId: id!, // Technician is treated as athlete in inscription schema for now? Or purely ID based.
      eventId: eventId!,
      modalityId: modalityIdToSave,
      schoolId: 'school-1' // TODO: Get from context/session
    })

    addInscription({
      athleteId: newInscription.athleteId,
      eventId: newInscription.eventId,
      modalityId: newInscription.modalityId,
    })

    // Reset selections
    setSelectedProvaId('')
    // Keep type and modality name for faster multiple entry if needed, or reset all:
    // setSelectedModalityName('')
  }

  const technicianInscriptions = inscriptions.filter(
    (i) => i.athleteId === id && i.eventId === eventId,
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Alocar/Vincular Modalidades ao Técnico
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <User className="h-3 w-3" /> {technician.name}
              <span className="text-border">|</span>
              <span>
                {/* {age} anos ({technician.sex}) */}
                {technician.sex}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Plus className="h-5 w-5" /> Nova Inscrição
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select
                  value={selectedType}
                  onValueChange={(v) => {
                    setSelectedType(v)
                    setSelectedModalityName('')
                    setSelectedProvaId('')
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTypes.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modalidade *</Label>
                <Select
                  value={selectedModalityName}
                  onValueChange={(v) => {
                    setSelectedModalityName(v)
                    setSelectedProvaId('')
                  }}
                  disabled={!selectedType}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue
                      placeholder={
                        !selectedType
                          ? 'Escolha primeiro um Tipo'
                          : 'Selecione a Modalidade'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModalityNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prova/Categoria Dropdown logic */}
              {selectedModalityName && availableProvas.length > 0 && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <Label>
                    {selectedType === 'individual' ? 'Prova *' : 'Categoria *'}
                  </Label>
                  <Select
                    value={selectedProvaId}
                    onValueChange={setSelectedProvaId}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={`Selecione a ${selectedType === 'individual' ? 'Prova' : 'Categoria'}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProvas.map((mod) => (
                        <SelectItem key={mod.id} value={mod.id}>
                          {mod.eventCategory
                            ? mod.eventCategory
                            : `${mod.minAge}-${mod.maxAge} anos`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {availableProvas.length === 0 && selectedModalityName && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                  Não há provas disponíveis para esta modalidade e faixa etária.
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={
                  !selectedType ||
                  !selectedModalityName ||
                  (availableProvas.length > 0 && !selectedProvaId)
                }
                className="w-full h-11 font-semibold text-base mt-2"
              >
                <Save className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </CardContent>
          </Card>

          <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-sm flex gap-3 border border-blue-100">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Elegibilidade Automática</p>
              <p>
                As opções de modalidades são filtradas automaticamente
                considerando:
              </p>
              <ul className="list-disc list-inside pl-1 mt-1">
                <li>Associação ao Evento</li>
                {/* <li>Idade do atleta ({age} anos)</li> */}
                <li>Sexo do técnico ({technician.sex})</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Table */}
        <div className="lg:col-span-7">
          <Card className="h-full border-none shadow-none bg-transparent">
            <div className="mb-4">
              <h3 className="text-xl font-bold tracking-tight">
                Modalidades Cadastradas
              </h3>
              <p className="text-muted-foreground">
                Lista de modalidades vinculadas ao técnico para este evento.
              </p>
            </div>

            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Prova</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Faixa de Idade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicianInscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        Nenhuma inscrição realizada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    technicianInscriptions.map((inscription) => {
                      const mod = modalities.find(
                        (m) => m.id === inscription.modalityId,
                      )
                      if (!mod) return null
                      return (
                        <TableRow key={inscription.id}>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize text-[10px] rounded-[5px] border-none px-2 py-0.5 font-bold ${mod.type === 'individual'
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                                }`}
                            >
                              {mod.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {mod.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {mod.eventCategory || '-'}
                          </TableCell>
                          <TableCell className="capitalize">
                            {mod.gender}
                          </TableCell>
                          <TableCell>
                            {mod.minAge} a {mod.maxAge} anos
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Remover Inscrição?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover a inscrição
                                    em <strong>{mod.name}</strong>?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteInscription(inscription.id)
                                    }
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div >
  )
}
