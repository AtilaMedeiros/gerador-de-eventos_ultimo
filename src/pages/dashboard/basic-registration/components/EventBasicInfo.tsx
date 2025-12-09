import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/FileUpload'
import type { EventFormValues } from '../schemas'

export function EventBasicInfo() {
  const { control, formState } = useFormContext<EventFormValues>()
  const { errors } = formState

  return (
    <div className="space-y-8 mt-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Nome do Evento
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Copa Verão de Futsal 2025"
                className="h-12 text-lg shadow-sm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <FormField
          control={control}
          name="imagem"
          render={({ field }) => (
            <FormItem>
              <FileUpload
                label="Imagem de Capa"
                description="1600x838px recomendado. Max 2MB."
                onChange={field.onChange}
                value={field.value}
                className="bg-background shadow-sm"
                error={errors.imagem?.message as string}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="logoEvento"
          render={({ field }) => (
            <FormItem>
              <FileUpload
                label="Logo do Evento"
                description="Resol. ideal: ~200x200px - Max 2MB."
                maxSizeMB={2}
                onChange={field.onChange}
                value={field.value}
                className="bg-background shadow-sm"
                error={errors.logoEvento?.message as string}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="textoInstitucional"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Texto Institucional
            </FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                className="min-h-[200px]"
              />
            </FormControl>
            <FormDescription>
              Utilize este espaço para "vender" seu evento.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
