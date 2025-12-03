import { useState } from 'react'
import { Trophy, Plus, Trash2, Medal } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useCommunication, Result } from '@/contexts/CommunicationContext'

interface ResultsTabProps {
  eventId: string
}

export function ResultsTab({ eventId }: ResultsTabProps) {
  const { results, addResult, updateResult, deleteResult } = useCommunication()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // Filter results for current event
  const eventResults = results.filter((r) => r.eventId === eventId)

  const handleChampionChange = (id: string, value: string) => {
    updateResult(id, { champion: value })
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('O nome da modalidade é obrigatório.')
      return
    }

    addResult({
      eventId,
      categoryName: newCategoryName,
      champion: '',
    })

    setNewCategoryName('')
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Galeria de Campeões</h3>
          <p className="text-sm text-muted-foreground">
            Registre os vencedores de cada modalidade para exibir no site.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Adicionar Modalidade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Categoria/Modalidade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Categoria</Label>
                <Input
                  placeholder="Ex: Futsal Masculino Sub-17"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddCategory}>Adicionar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Resultados por Modalidade
          </CardTitle>
          <CardDescription>
            Preencha o nome da equipe ou atleta campeão de cada categoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  Modalidade / Categoria
                </TableHead>
                <TableHead>Campeão</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Nenhuma modalidade cadastrada. Adicione uma para registrar
                    resultados.
                  </TableCell>
                </TableRow>
              ) : (
                eventResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      {result.categoryName}
                    </TableCell>
                    <TableCell>
                      <div className="relative max-w-md">
                        <Medal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warning" />
                        <Input
                          value={result.champion}
                          onChange={(e) =>
                            handleChampionChange(result.id, e.target.value)
                          }
                          placeholder="Digite o nome do campeão..."
                          className="pl-9"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {result.champion ? (
                        <Badge className="bg-success hover:bg-success/80">
                          Definido
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteResult(result.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {eventResults.length > 0 && (
        <div className="flex justify-end">
          <p className="text-sm text-muted-foreground">
            As alterações são salvas automaticamente.
          </p>
        </div>
      )}
    </div>
  )
}
