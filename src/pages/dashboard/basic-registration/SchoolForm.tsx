import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'

export default function SchoolForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = id && id !== 'novo'

    const { register, handleSubmit } = useForm({
        defaultValues: isEditing
            ? {
                name: 'Escola Municipal de Esportes',
                inep: '12345678',
                city: 'São Paulo',
                state: 'SP',
                responsible: 'João Silva',
                email: 'joao.silva@escola.com',
                phone: '(11) 99999-9999',
            }
            : {},
    })

    const onSubmit = (data: any) => {
        toast.success(
            isEditing ? 'Escola atualizada com sucesso!' : 'Escola criada com sucesso!',
        )
        navigate('/area-do-produtor/escolas')
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto pb-20 pt-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/area-do-produtor/escolas')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditing ? 'Editar Escola' : 'Nova Escola'}
                </h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados da Escola</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Escola</Label>
                            <Input id="name" {...register('name')} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="inep">INEP</Label>
                            <Input id="inep" {...register('inep')} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Cidade</Label>
                                <Input id="city" {...register('city')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">Estado (UF)</Label>
                                <Input id="state" {...register('state')} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="responsible">Responsável</Label>
                            <Input id="responsible" {...register('responsible')} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone</Label>
                                <Input id="phone" {...register('phone')} required />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="w-full sm:w-auto">
                                <Save className="mr-2 h-4 w-4" />
                                {isEditing ? 'Salvar Alterações' : 'Cadastrar Escola'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
