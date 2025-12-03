import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  UserCheck,
  AlertTriangle,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useModality } from '@/contexts/ModalityContext'
import { differenceInYears } from 'date-fns'
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

export default function AthletesList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId')
  const { athletes, deleteAthlete, inscriptions } = useParticipant()
  const { modalities } = useModality()
  const [search, setSearch] = useState('')

  const filteredAthletes = athletes.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.cpf.includes(search),
  )

  const getAge = (dob: Date) => differenceInYears(new Date(), dob)

  // Get linked modalities for an athlete in the current event
  const getAthleteModalities = (athleteId: string) => {
    if (eventId) {
      const athleteInscriptions = inscriptions.filter(
        (i) => i.athleteId === athleteId && i.eventId === eventId,
      )
      return athleteInscriptions
        .map((ins) => modalities.find((m) => m.id === ins.modalityId))
        .filter((m) => !!m)
    }
    return []
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Gestão de Atletas
          </h2>
          <p className="text-muted-foreground">
            {eventId
              ? 'Gerencie as inscrições dos atletas para este evento.'
              : 'Cadastre e gerencie os atletas da sua escola.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button
            onClick={() => navigate('/area-do-participante/atletas/novo')}
          >
            <Plus className="mr-2 h-4 w-4" /> Incluir Atleta
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Atenção ao editar atletas!</p>
          <p>
            Alterações nos dados cadastrais (como idade ou sexo) podem invalidar
            inscrições já realizadas em modalidades específicas. Verifique
            sempre as inscrições após editar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm relative">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Naipe</TableHead>
              {/* Always show Modalidades column if eventId is present, or just for structure */}
              {eventId && <TableHead>Modalidades</TableHead>}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAthletes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={eventId ? 6 : 5}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 opacity-20" />
                    <p>Nenhum atleta encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAthletes.map((athlete) => {
                const linkedModalities = getAthleteModalities(athlete.id)
                return (
                  <TableRow key={athlete.id} className="hover:bg-muted/10">
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-foreground hover:text-primary hover:underline"
                        onClick={() =>
                          navigate(
                            `/area-do-participante/atletas/${athlete.id}`,
                          )
                        }
                      >
                        {athlete.name}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {athlete.cpf}
                    </TableCell>
                    <TableCell>{getAge(athlete.dob)} anos</TableCell>
                    <TableCell>{athlete.sex}</TableCell>
                    {eventId && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {linkedModalities.length > 0 ? (
                            linkedModalities.map((mod) => (
                              <Badge
                                key={mod!.id}
                                variant="outline"
                                className={`text-[10px] border ${mod!.type === 'coletiva' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                              >
                                {mod!.type === 'coletiva' ? 'Col' : 'Ind'}:{' '}
                                {mod!.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {eventId && (
                          <Button
                            variant={
                              linkedModalities.length > 0
                                ? 'secondary'
                                : 'default'
                            }
                            size="sm"
                            className="shadow-sm"
                            title="Alocar/Vincular Modalidades"
                            onClick={() =>
                              navigate(
                                `/area-do-participante/atletas/${athlete.id}/inscricao?eventId=${eventId}`,
                              )
                            }
                          >
                            <UserCheck className="mr-2 h-3 w-3" />
                            {linkedModalities.length > 0
                              ? 'Editar Inscrição'
                              : 'Alocar/Vincular'}
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar Atleta"
                          onClick={() =>
                            navigate(
                              `/area-do-participante/atletas/${athlete.id}`,
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Excluir Atleta"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir Atleta?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação removerá o atleta{' '}
                                <strong>{athlete.name}</strong> e todas as suas
                                inscrições em eventos. Não pode ser desfeito.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteAthlete(athlete.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
