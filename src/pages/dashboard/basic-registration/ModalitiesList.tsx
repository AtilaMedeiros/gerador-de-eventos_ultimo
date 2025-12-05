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
  const filteredModalities = modalities.filter((mod) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      mod.name.toLowerCase().includes(searchLower) ||
      mod.type.toLowerCase().includes(searchLower) ||
      mod.gender.toLowerCase().includes(searchLower) ||
      (mod.eventCategory &&
        mod.eventCategory.toLowerCase().includes(searchLower)) ||
      mod.minAge.toString().includes(searchLower) ||
      mod.maxAge.toString().includes(searchLower) ||
      mod.minAthletes.toString().includes(searchLower) ||
      mod.maxAthletes.toString().includes(searchLower) ||
      mod.maxTeams.toString().includes(searchLower) ||
      mod.maxEventsPerAthlete.toString().includes(searchLower)
    )
  })

  const handleDuplicate = (modality: any) => {
    const { id, ...rest } = modality
    addModality({ ...rest, name: `${rest.name} (Cópia)` })
  }


  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Background Gradients */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Modalidades
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gerencie o catálogo de esportes do sistema.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button
            onClick={() =>
              navigate('/area-do-produtor/cadastro-basico/modalidades/nova')
            }
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <Input
          placeholder="Pesquisar por nome, tipo, gênero, idade, atletas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left"
        />
      </div>

      <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
              <TableHead className="w-[250px] font-semibold text-primary/80">
                Nome
              </TableHead>
              <TableHead className="font-semibold text-primary/80">
                Tipo
              </TableHead>
              <TableHead className="font-semibold text-primary/80">
                Gênero
              </TableHead>
              <TableHead className="font-semibold text-primary/80">
                Idade (Min-Max)
              </TableHead>
              <TableHead className="font-semibold text-primary/80">
                Atletas (Min-Max)
              </TableHead>
              <TableHead className="font-semibold text-primary/80">
                Equipes Máx
              </TableHead>
              <TableHead className="font-semibold text-primary/80">
                Máx. Provas por Atleta
              </TableHead>
              <TableHead className="text-right font-semibold text-primary/80">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModalities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground text-lg"
                >
                  Nenhuma modalidade encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredModalities.map((mod) => (
                <TableRow
                  key={mod.id}
                  className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                >
                  <TableCell className="font-medium h-12 py-0">
                    <div className="flex flex-col justify-center h-full">
                      <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                        {mod.name}
                      </span>
                      {mod.eventCategory && (
                        <span className="text-[10px] text-muted-foreground font-light leading-tight">
                          {mod.eventCategory}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground h-12 py-0">
                    {mod.type}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground h-12 py-0">
                    {mod.gender}
                  </TableCell>
                  <TableCell className="text-muted-foreground h-12 py-0">
                    {mod.minAge} - {mod.maxAge} anos
                  </TableCell>
                  <TableCell className="text-muted-foreground h-12 py-0">
                    {mod.minAthletes} - {mod.maxAthletes}
                  </TableCell>
                  <TableCell className="text-muted-foreground h-12 py-0">
                    {mod.maxTeams > 0 ? mod.maxTeams : 'Ilimitado'}
                  </TableCell>
                  <TableCell className="text-muted-foreground pl-8 h-12 py-0">
                    {mod.maxEventsPerAthlete}
                  </TableCell>
                  <TableCell className="text-right h-12 py-0">
                    <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                        title="Editar"
                        onClick={() =>
                          navigate(
                            `/area-do-produtor/cadastro-basico/modalidades/${mod.id}`,
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-secondary/20 hover:text-secondary-foreground rounded-full transition-colors"
                        title="Copiar"
                        onClick={() => handleDuplicate(mod)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Excluir"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-primary/10 shadow-2xl">
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
                            <AlertDialogCancel className="rounded-xl">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteModality(mod.id)}
                              className="bg-destructive hover:bg-destructive/90 rounded-xl shadow-lg shadow-destructive/20"
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
