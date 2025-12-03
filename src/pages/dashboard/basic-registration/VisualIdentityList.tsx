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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
        </div>
        <Button
          onClick={() =>
            navigate('/area-do-produtor/cadastro-basico/identidade-visual/novo')
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Tema
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cor Primária</TableHead>
              <TableHead>Cor Secundária</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThemes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum tema encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredThemes.map((theme) => (
                <TableRow key={theme.id}>
                  <TableCell className="font-medium">
                    {theme.name}
                    {theme.isDefault && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-muted rounded-full border">
                        Padrão
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {theme.colors.primary}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border shadow-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {theme.colors.secondary}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(theme.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(
                            `/area-do-produtor/cadastro-basico/identidade-visual/${theme.id}`,
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {/* Copy functionality could be added here */}
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(theme.id)}
                        disabled={theme.isDefault}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
