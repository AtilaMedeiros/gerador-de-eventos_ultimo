import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { EventFormValues } from '../schemas'
import { FileUpload } from '@/components/FileUpload'

export function EventProducerFields() {
  const { control, formState } = useFormContext<EventFormValues>()

  return (
    <div className="mt-4 space-y-6">
      <FormField
        control={control}
        name="nomeProdutor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Produtor Responsável</FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly
                className="bg-muted text-muted-foreground font-medium"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="descricaoProdutor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Informações de Contato</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ex: Email: contato@evento.com | WhatsApp: (11) 99999-9999"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-muted/20 p-6 rounded-xl border space-y-6 mt-8">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Logos de Parceiros
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={control}
            name="logosRealizadores"
            render={({ field }) => (
              <FormItem>
                <FileUpload
                  label="Realização"
                  description="Logos dos organizadores. Resol. ideal: ~200x200px"
                  multiple
                  maxSizeMB={2}
                  onChange={field.onChange}
                  value={field.value}
                  className="bg-background"
                  error={formState.errors.logosRealizadores?.message as string}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="logosApoiadores"
            render={({ field }) => (
              <FormItem>
                <FileUpload
                  label="Apoio"
                  description="Logos dos patrocinadores. Resol. ideal: ~200x200px"
                  multiple
                  maxSizeMB={2}
                  onChange={field.onChange}
                  value={field.value}
                  className="bg-background"
                  error={formState.errors.logosApoiadores?.message as string}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
