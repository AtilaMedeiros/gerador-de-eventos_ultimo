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
import {
  Search,
  Download,
  Plus,
  Edit,
  Copy,
  Trash2,
  Filter,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useModality } from '@/contexts/ModalityContext'
import { useState } from 'react'
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

export default function ModalitiesList() {
  const navigate = useNavigate()
  const { modalities, deleteModality, addModality } = useModality()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredModalities = modalities.filter(
    (mod) =>
      mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.gender.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDuplicate = (modality: any) => {
    const { id, ...rest } = modality
    addModality({ ...rest, name: `${rest.name} (Cópia)` })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Modalidades</h2>
          <p className="text-muted-foreground">
            Gerencie as modalidades esportivas disponíveis para os eventos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button
            onClick={() =>
              navigate('/area-do-produtor/cadastro-basico/modalidades/nova')
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm relative">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
          <Input
            placeholder="Pesquisar por nome, tipo ou gênero..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>Idade (Min-Max)</TableHead>
              <TableHead>Atletas (Min-Max)</TableHead>
              <TableHead>Equipes Máx</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModalities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma modalidade encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredModalities.map((mod) => (
                <TableRow
                  key={mod.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{mod.name}</span>
                      {mod.eventCategory && (
                        <span className="text-xs text-muted-foreground">
                          {mod.eventCategory}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        mod.type === 'coletiva' ? 'default' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {mod.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{mod.gender}</TableCell>
                  <TableCell>
                    {mod.minAge} - {mod.maxAge} anos
                  </TableCell>
                  <TableCell>
                    {mod.minAthletes} - {mod.maxAthletes}
                  </TableCell>
                  <TableCell>
                    {mod.maxTeams > 0 ? mod.maxTeams : 'Ilimitado'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Editar"
                        onClick={() =>
                          navigate(
                            `/area-do-produtor/cadastro-basico/modalidades/${mod.id}`,
                          )
                        }
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Copiar"
                        onClick={() => handleDuplicate(mod)}
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Excluir"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Tem certeza absoluta?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Isso excluirá
                              permanentemente a modalidade
                              <strong> {mod.name}</strong> e removerá os dados
                              de nossos servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteModality(mod.id)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
