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
import { Search, Download, Plus, Edit, Copy, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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

export default function VisualIdentityList() {
  const navigate = useNavigate()
  const { themes, deleteTheme } = useTheme()
  const [search, setSearch] = useState('')

  const filteredThemes = themes.filter((theme) =>
    theme.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tema?')) {
      deleteTheme(id)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Background Gradients */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Identidade Visual
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gerencie os temas e cores dos seus eventos.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button
            onClick={() =>
              navigate('/area-do-produtor/cadastro-basico/identidade-visual/novo')
            }
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Tema
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <Input
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left"
        />
      </div>

      <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
              <TableHead className="font-semibold text-primary/80 h-12">Nome</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Cor Primária</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Cor Secundária</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Cor de Fundo</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Cor do Texto</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Data Criação</TableHead>
              <TableHead className="text-right font-semibold text-primary/80 h-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThemes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground text-lg"
                >
                  Nenhum tema encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredThemes.map((theme) => (
                <TableRow
                  key={theme.id}
                  className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                >
                  <TableCell className="font-medium h-12 py-0">
                    <div className="flex items-center h-full">
                      <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                        {theme.name}
                      </span>
                      {theme.isDefault && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                          Padrão
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0">
                    <div className="flex items-center gap-2 h-full">
                      <div
                        className="h-4 w-4 rounded-full border shadow-sm ring-1 ring-white/20"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {theme.colors.primary}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0">
                    <div className="flex items-center gap-2 h-full">
                      <div
                        className="h-4 w-4 rounded-full border shadow-sm ring-1 ring-white/20"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {theme.colors.secondary}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0">
                    <div className="flex items-center gap-2 h-full">
                      <div
                        className="h-4 w-4 rounded-full border shadow-sm ring-1 ring-white/20"
                        style={{ backgroundColor: theme.colors.background }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {theme.colors.background}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-12 py-0">
                    <div className="flex items-center gap-2 h-full">
                      <div
                        className="h-4 w-4 rounded-full border shadow-sm ring-1 ring-white/20"
                        style={{ backgroundColor: theme.colors.text }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {theme.colors.text}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground h-12 py-0">
                    <div className="flex items-center h-full">
                      {format(theme.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right h-12 py-0">
                    <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity h-full items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                        onClick={() =>
                          navigate(
                            `/area-do-produtor/cadastro-basico/identidade-visual/${theme.id}`,
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-secondary/20 hover:text-secondary-foreground rounded-full transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                            disabled={theme.isDefault}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-primary/10 shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Isso excluirá permanentemente o tema
                              <strong> {theme.name}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteTheme(theme.id)}
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
