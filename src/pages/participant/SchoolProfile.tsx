import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Save } from 'lucide-react'
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
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useAuth } from '@/contexts/AuthContext'

const schoolSchema = z.object({
  name: z.string().min(3),
  inep: z.string(),
  municipality: z.string(),
  directorName: z.string().min(3),
  email: z.string().email(),
  mobile: z.string(),
})

type SchoolFormValues = z.infer<typeof schoolSchema>

export default function SchoolProfile() {
  const { user } = useAuth()
  const { school, updateSchool } = useParticipant()
  const isResponsible = user?.role === 'school_admin'

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      inep: '',
      municipality: '',
      directorName: '',
      email: '',
      mobile: '',
    },
  })

  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        inep: school.inep,
        municipality: school.municipality,
        directorName: school.directorName,
        email: school.email,
        mobile: school.mobile,
      })
    }
  }, [school, form])

  const onSubmit = (data: SchoolFormValues) => {
    updateSchool(data)
  }

  if (!school) return <div>Carregando dados da escola...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dados da Escola</h2>

      <Card>
        <CardHeader>
          <CardTitle>Informações Institucionais</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nome da Escola</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isResponsible} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>INEP</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Município</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isResponsible} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="directorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diretor(a)</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isResponsible} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isResponsible} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isResponsible} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isResponsible && (
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
