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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os usuários com acesso ao sistema.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Exportar')}
          >
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button
            onClick={() =>
              navigate('/area-do-produtor/cadastro-basico/usuarios/novo')
            }
          >
            <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Pesquisar por nome ou email..." />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <Badge className="bg-success hover:bg-success/80">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.lastAccess}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
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
                      className="text-destructive hover:text-destructive"
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
