import * as z from 'zod'
import { isAfter, isSameDay } from 'date-fns'

// Helper to combine date and time
export const combineDateTime = (date: Date | undefined, time: string) => {
  if (!date || !time) return null
  const [hours, minutes] = time.split(':').map(Number)
  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}

export const eventFormSchema = z
  .object({
    // Section 1: Identity
    name: z.string().min(3, 'Nome do evento é obrigatório (mín. 3 caracteres)'),
    imagem: z.array(z.instanceof(File)).optional(),
    logoEvento: z.array(z.instanceof(File)).optional(),
    logosRealizadores: z.array(z.instanceof(File)).optional(),
    logosApoiadores: z.array(z.instanceof(File)).optional(),
    textoInstitucional: z
      .string()
      .min(10, 'Texto institucional deve ter pelo menos 10 caracteres'),
    nomeProdutor: z.string(),
    descricaoProdutor: z.string().optional(),

    // Section 2: Event Dates
    dataInicio: z.date({ required_error: 'Data de início é obrigatória' }),
    horaInicio: z.string().min(1, 'Hora de início é obrigatória'),
    dataFim: z.date({ required_error: 'Data de término é obrigatória' }),
    horaFim: z.string().min(1, 'Hora de término é obrigatória'),

    // Section 3: Registrations
    inscricaoColetivaInicio: z.date({
      required_error: 'Data início coletiva é obrigatória',
    }),
    inscricaoColetivaHoraInicio: z
      .string()
      .min(1, 'Hora início coletiva é obrigatória'),
    inscricaoColetivaFim: z.date({
      required_error: 'Data fim coletiva é obrigatória',
    }),
    inscricaoColetivaHoraFim: z
      .string()
      .min(1, 'Hora fim coletiva é obrigatória'),

    inscricaoIndividualInicio: z.date({
      required_error: 'Data início individual é obrigatória',
    }),
    inscricaoIndividualHoraInicio: z
      .string()
      .min(1, 'Hora início individual é obrigatória'),
    inscricaoIndividualFim: z.date({
      required_error: 'Data fim individual é obrigatória',
    }),
    inscricaoIndividualHoraFim: z
      .string()
      .min(1, 'Hora fim individual é obrigatória'),

    // Status
    status: z.enum(['draft', 'published', 'paused', 'ended', 'deleted']),
  })
  .superRefine((data, ctx) => {
    const start = combineDateTime(data.dataInicio, data.horaInicio)
    const end = combineDateTime(data.dataFim, data.horaFim)

    // Event End > Start
    if (start && end) {
      if (isAfter(start, end)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Data de término deve ser posterior ao início',
          path: ['dataFim'],
        })
      }
      if (isSameDay(start, end) && data.horaInicio >= data.horaFim) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Hora de término deve ser posterior ao início',
          path: ['horaFim'],
        })
      }
    }

    // Registration End < Event Start checks
    const colEnd = combineDateTime(
      data.inscricaoColetivaFim,
      data.inscricaoColetivaHoraFim,
    )
    if (start && colEnd && isAfter(colEnd, start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As inscrições devem fechar ANTES do evento começar.',
        path: ['inscricaoColetivaFim'],
      })
    }

    const indEnd = combineDateTime(
      data.inscricaoIndividualFim,
      data.inscricaoIndividualHoraFim,
    )
    if (start && indEnd && isAfter(indEnd, start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As inscrições devem fechar ANTES do evento começar.',
        path: ['inscricaoIndividualFim'],
      })
    }
  })

export type EventFormValues = z.infer<typeof eventFormSchema>
