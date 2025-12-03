import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useParticipant } from '@/contexts/ParticipantContext'

const athleteSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  sex: z.enum(['Feminino', 'Masculino']),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data inválida',
  }),
  rg: z.string().min(2, 'RG é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  nis: z.string().optional(),
  motherName: z.string().min(3, 'Nome do Responsável é obrigatório'),
  motherCpf: z.string().min(11, 'CPF do Responsável inválido'),
})

type AthleteFormValues = z.infer<typeof athleteSchema>

export default function AthleteForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { athletes, addAthlete, updateAthlete } = useParticipant()
  const isEditing = id && id !== 'novo'

  const form = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      name: '',
      sex: 'Feminino',
      dob: '',
      rg: '',
      cpf: '',
      nis: '',
      motherName: '',
      motherCpf: '',
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      const athlete = athletes.find((a) => a.id === id)
      if (athlete) {
        form.reset({
          ...athlete,
          dob: athlete.dob.toISOString().split('T')[0],
          nis: athlete.nis || '',
        })
      } else {
        toast.error('Atleta não encontrado')
        navigate('/area-do-participante/atletas')
      }
    }
  }, [isEditing, id, athletes, form, navigate])

  const onSubmit = (data: AthleteFormValues) => {
    // Validate CPF uniqueness in school
    const cpfExists = athletes.some((a) => a.cpf === data.cpf && a.id !== id)

    if (cpfExists) {
      form.setError('cpf', {
        message: 'Este CPF já está cadastrado na escola.',
      })
      return
    }

    const payload = {
      ...data,
      dob: new Date(data.dob),
    }

    if (isEditing && id) {
      updateAthlete(id, payload)
    } else {
      addAthlete(payload)
    }
    navigate('/area-do-participante/atletas')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/area-do-participante/atletas')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditing ? 'Editar Atleta' : 'Novo Atleta'}
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-card p-6 rounded-lg border shadow-sm"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do atleta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Sexo *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Feminino" />
                        </FormControl>
                        <FormLabel className="font-normal">Feminino</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Masculino" />
                        </FormControl>
                        <FormLabel className="font-normal">Masculino</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do Atleta *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Deve ser único na escola.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG *</FormLabel>
                  <FormControl>
                    <Input placeholder="Número do RG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIS (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Número NIS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Responsável Legal *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motherCpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do Responsável Legal *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/area-do-participante/atletas')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Atleta
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
