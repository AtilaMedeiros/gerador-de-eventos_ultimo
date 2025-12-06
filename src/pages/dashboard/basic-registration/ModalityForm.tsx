import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNavigate, useParams } from 'react-router-dom'
import { useModality } from '@/contexts/ModalityContext'
import { useEffect } from 'react'
import {
  ArrowLeft,
  Info,
  ShieldCheck,
  Users,
  User,
  Trophy,
  LayoutList,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  type: z.enum(['coletiva', 'individual'], {
    required_error: 'Selecione o tipo de modalidade',
  }),
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Máximo de 255 caracteres'),
  gender: z.enum(['feminino', 'masculino', 'misto'], {
    required_error: 'Selecione o naipe/gênero',
  }),
  eventCategory: z.string().optional(),
  maxAthletes: z.coerce
    .number({ invalid_type_error: 'Apenas Números' })
    .min(1, 'Mínimo 1 atleta')
    .max(999, 'Máximo 999'),
  minAthletes: z.coerce
    .number({ invalid_type_error: 'Apenas Números' })
    .min(1, 'Mínimo 1 atleta')
    .max(999, 'Máximo 999'),
  maxEventsPerAthlete: z.coerce
    .number({ invalid_type_error: 'Apenas Números' })
    .min(0, 'Mínimo 0'),
  maxTeams: z.coerce
    .number({ invalid_type_error: 'Apenas Números' })
    .min(0, 'Mínimo 0'),
  minAge: z.coerce
    .number({ invalid_type_error: 'Apenas Números' })
    .min(0, 'Mínimo 0')
    .max(99, 'Máximo 99 anos'),
  maxAge: z.coerce
    .number({ invalid_type_error: 'Apenas Números' })
    .min(0, 'Mínimo 0')
    .max(99, 'Máximo 99 anos'),
})

type FormValues = z.infer<typeof formSchema>

export default function ModalityForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addModality, updateModality, getModalityById } = useModality()

  const isEditing = id && id !== 'nova'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'coletiva',
      gender: 'masculino',
      eventCategory: '',
      minAge: 0,
      maxAge: 99,
      minAthletes: 1,
      maxAthletes: 20,
      maxEventsPerAthlete: 1,
      maxTeams: 0,
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      const modality = getModalityById(id)
      if (modality) {
        form.reset({
          name: modality.name,
          type: modality.type,
          gender: modality.gender,
          eventCategory: modality.eventCategory || '',
          minAthletes: modality.minAthletes,
          maxAthletes: modality.maxAthletes,
          maxEventsPerAthlete: modality.maxEventsPerAthlete,
          maxTeams: modality.maxTeams || 0,
          minAge: modality.minAge,
          maxAge: modality.maxAge,
        })
      } else {
        navigate('/area-do-produtor/modalidades')
      }
    }
  }, [isEditing, id, getModalityById, navigate, form])

  function onSubmit(values: FormValues) {
    if (isEditing && id) {
      updateModality(id, values)
    } else {
      addModality(values)
    }
    navigate('/area-do-produtor/modalidades')
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate('/area-do-produtor/modalidades')
          }
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Editar Modalidade' : 'Nova Modalidade'}
          </h2>
          <p className="text-muted-foreground">
            Preencha as informações técnicas da modalidade esportiva.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Info Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm border-primary/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Dados Principais
                      </CardTitle>
                      <CardDescription>
                        Identificação básica da modalidade.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Modalidade</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Atletismo, Natação, Futsal..."
                            className="text-lg h-12"
                            maxLength={255}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Disputa</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="coletiva">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  Coletiva (Equipe)
                                </div>
                              </SelectItem>
                              <SelectItem value="individual">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  Individual
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gênero / Naipe</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Selecione o gênero" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="masculino">
                                Masculino
                              </SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                              <SelectItem value="misto">Misto</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="eventCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Especificação da Prova / Categoria
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 100m Rasos, Peso Pena (Opcional)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Utilizado para diferenciar provas de uma mesma
                          modalidade (ex: Natação).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-sm border-primary/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Regras de Elegibilidade
                      </CardTitle>
                      <CardDescription>
                        Restrições de idade e quantidade de participantes.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="minAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade Mínima (Anos)</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade Máxima (Anos)</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="minAthletes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mín. Atletas por Equipe</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxAthletes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Máx. Atletas por Equipe</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Column */}
            <div className="space-y-6">
              <Card className="shadow-sm border-primary/10 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <LayoutList className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Configurações</CardTitle>
                      <CardDescription>Limites do evento.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">


                  <FormField
                    control={form.control}
                    name="maxTeams"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máximo de Equipes</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-11" {...field} />
                        </FormControl>
                        <FormDescription>Use 0 para ilimitado.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxEventsPerAthlete"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máx. Provas por Atleta</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-11" {...field} />
                        </FormControl>
                        <FormDescription>
                          Quantas provas dessa modalidade um mesmo atleta pode
                          disputar.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() =>
                navigate('/area-do-produtor/modalidades')
              }
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-success hover:bg-success/90 min-w-[150px]"
            >
              Salvar Modalidade
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
