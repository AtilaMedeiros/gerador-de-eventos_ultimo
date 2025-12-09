import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useAuth } from '@/contexts/AuthContext'

const techSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  sex: z.enum(['Feminino', 'Masculino']),
  dob: z.string().min(10, 'Data inválida').max(10),
  cpf: z.string().min(11, 'CPF inválido'),
  cref: z.string().optional(),
  uniformSize: z.string().min(1, 'Selecione um tamanho'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Contato inválido'),
})

type TechFormValues = z.infer<typeof techSchema>

export default function TechnicianForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { technicians, addTechnician, updateTechnician } = useParticipant()
  const isEditing = id && id !== 'novo'

  const form = useForm<TechFormValues>({
    resolver: zodResolver(techSchema),
    defaultValues: {
      name: '',
      sex: 'Feminino',
      dob: '',
      cpf: '',
      cref: '',
      uniformSize: '',
      email: '',
      phone: '',
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      const tech = technicians.find((t) => t.id === id)
      if (tech) {
        // Convert Date to DD/MM/YYYY string
        const d = tech.dob
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        form.reset({
          ...tech,
          dob: `${day}/${month}/${year}`,
        })
      } else {
        navigate('/area-do-participante/tecnicos')
      }
    }
  }, [isEditing, id, technicians, form, navigate])

  const onSubmit = (data: TechFormValues) => {
    // Parse DD/MM/YYYY to Date
    const [day, month, year] = data.dob.split('/')

    // Explicitly cast to ensure type safety and avoid inference errors
    const payload = {
      name: data.name,
      sex: data.sex,
      dob: new Date(`${year}-${month}-${day}T00:00:00`),
      cpf: data.cpf,
      cref: data.cref,
      email: data.email,
      phone: data.phone,
      uniformSize: data.uniformSize,
    }

    if (isEditing && id) {
      updateTechnician(id, payload)
    } else {
      addTechnician(payload)
    }
    navigate('/area-do-participante/tecnicos')
  }

  // Simple masks
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    if (value.length >= 5) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`
    } else if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`
    }
    onChange(value)
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`
    }
    onChange(value)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 10) {
      value = `(${value.slice(0, 2)})${value.slice(2, 7)}-${value.slice(7)}`
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)})${value.slice(2, 6)}-${value.slice(6)}`
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)})${value.slice(2)}`
    }
    onChange(value)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/area-do-participante/tecnicos')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Editar Técnico' : 'Novo Técnico'}
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
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" maxLength={255} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Sexo</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-2"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Feminino" id="sexoFeminino" />
                      </FormControl>
                      <FormLabel htmlFor="sexoFeminino" className="font-normal font-light cursor-pointer">
                        &nbsp;Feminino
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Masculino" id="sexoMasculino" />
                      </FormControl>
                      <FormLabel htmlFor="sexoMasculino" className="font-normal font-light cursor-pointer">
                        &nbsp;Masculino
                      </FormLabel>
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
                <FormLabel>Nascimento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="00/00/0000"
                    maxLength={10}
                    {...field}
                    onChange={(e) => handleDateChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cpf</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    maxLength={14}
                    {...field}
                    onChange={(e) => handleCpfChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cref"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cref</FormLabel>
                <FormControl>
                  <Input placeholder="Nº do Cref" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uniformSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uniforme</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PP">PP</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="GG">GG</SelectItem>
                    <SelectItem value="XG">XG</SelectItem>
                    <SelectItem value="XGG">XGG</SelectItem>
                    <SelectItem value="EGG">EGG</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="E-mail" maxLength={255} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="(00)0000-0000"
                    maxLength={15}
                    {...field}
                    onChange={(e) => handlePhoneChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="form-group pt-4">
            <div className="col-sm-12">
              <Button type="submit" className="btn btn-success text-white bg-green-600 hover:bg-green-700">
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
