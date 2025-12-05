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
import { Search, Download, Edit, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const MOCK_USERS = [
  {
    id: 1,
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    role: 'Admin',
    status: 'active',
    lastAccess: 'Hoje, 10:30',
  },
  {
    id: 2,
    name: 'Carlos Oliveira',
    email: 'carlos.o@email.com',
    role: 'Organizador',
    status: 'active',
    lastAccess: 'Ontem, 15:45',
  },
  {
    id: 3,
    name: 'Marcos Santos',
    email: 'marcos.s@email.com',
    role: 'Staff',
    status: 'inactive',
    lastAccess: '10/05/2025',
  },
]

export default function UsersList() {
  const navigate = useNavigate()

  const handleAction = (action: string) => {
    toast.info(`Ação ${action} simulada com sucesso.`)
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Background Gradients */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Usuários
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gerencie os usuários com acesso ao sistema.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Exportar')}
            className="backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button
            onClick={() =>
              navigate('/area-do-produtor/cadastro-basico/usuarios/novo')
            }
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <Input
          placeholder="Pesquisar por nome ou email..."
          className="pl-10 h-12 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left"
        />
      </div>

      <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
              <TableHead className="font-semibold text-primary/80 h-12">Nome</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Email</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Função</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Status</TableHead>
              <TableHead className="font-semibold text-primary/80 h-12">Último Acesso</TableHead>
              <TableHead className="text-right font-semibold text-primary/80 h-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
              >
                <TableCell className="font-medium h-12 py-0">
                  <div className="flex items-center h-full">
                    <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                      {user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="h-12 py-0">
                  <div className="flex items-center h-full text-muted-foreground">
                    {user.email}
                  </div>
                </TableCell>
                <TableCell className="h-12 py-0">
                  <div className="flex items-center h-full">
                    <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                      {user.role}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="h-12 py-0">
                  <div className="flex items-center h-full">
                    {user.status === 'active' ? (
                      <Badge className="bg-success/90 hover:bg-success text-white shadow-sm shadow-success/20">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        Inativo
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm h-12 py-0">
                  <div className="flex items-center h-full">
                    {user.lastAccess}
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
                          `/area-do-produtor/cadastro-basico/usuarios/${user.id}`,
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      onClick={() => handleAction('Excluir')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
