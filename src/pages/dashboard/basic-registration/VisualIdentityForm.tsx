import { useState, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ChevronDown,
  Palette,
  Type,
  Ruler,
  MoreHorizontal,
  Save,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { ThemePreview } from '@/components/ThemePreview'
import { useTheme, ThemeValues } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// --- Utils for Contrast ---
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null
}

const getLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

const getContrastRatio = (hex1: string, hex2: string) => {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  if (!rgb1 || !rgb2) return 1

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

const ContrastBadge = ({ bg, fg }: { bg: string; fg: string }) => {
  const ratio = getContrastRatio(bg, fg)
  const isGood = ratio >= 4.5
  const isOk = ratio >= 3 && ratio < 4.5

  return (
    <div
      className={cn(
        'text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 mt-1 w-fit font-medium border',
        isGood
          ? 'bg-green-100 text-green-700 border-green-200'
          : isOk
            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
            : 'bg-red-100 text-red-700 border-red-200',
      )}
    >
      {isGood ? (
        <Check className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      Ratio: {ratio.toFixed(2)}
    </div>
  )
}

// --- Schema ---
const formSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
  colors: z.object({
    primary: z.string().regex(/^#/, 'Cor inválida'),
    secondary: z.string().regex(/^#/, 'Cor inválida'),
    background: z.string().regex(/^#/, 'Cor inválida'),
    text: z.string().regex(/^#/, 'Cor inválida'),
    success: z.string().regex(/^#/, 'Cor inválida'),
    warning: z.string().regex(/^#/, 'Cor inválida'),
    error: z.string().regex(/^#/, 'Cor inválida'),
    info: z.string().regex(/^#/, 'Cor inválida'),
  }),
  typography: z.object({
    titleFont: z.string(),
    bodyFont: z.string(),
    baseSize: z.coerce.number().min(10).max(32),
    lineHeight: z.coerce.number().min(1).max(3),
  }),
  spacing: z.object({
    baseUnit: z.coerce.number().min(2).max(20),
  }),
  style: z.object({
    borderRadius: z.enum(['none', 'small', 'medium', 'large', 'full']),
    borderThickness: z.coerce.number().min(0).max(10),
    shadow: z.enum(['none', 'light', 'medium', 'strong', 'heavy']),
  }),
})

type FormValues = z.infer<typeof formSchema>

const FONTS = ['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Playfair Display']

export default function VisualIdentityForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = id && id !== 'novo'
  const { addTheme, updateTheme, getThemeById } = useTheme()
  const [showAllColors, setShowAllColors] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      colors: {
        primary: '#0197FF',
        secondary: '#FF6B35',
        background: '#FFFFFF',
        text: '#333333',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
      },
      typography: {
        titleFont: 'Poppins',
        bodyFont: 'Inter',
        baseSize: 16,
        lineHeight: 1.5,
      },
      spacing: {
        baseUnit: 4,
      },
      style: {
        borderRadius: 'medium',
        borderThickness: 1,
        shadow: 'light',
      },
    },
  })

  // Load theme data if editing
  useEffect(() => {
    if (isEditing && id) {
      const theme = getThemeById(id)
      if (theme) {
        // We can spread the theme into the form, but we must be careful with the structure
        // Ensure the theme object matches the FormValues structure perfectly
        const { name, description, colors, typography, spacing, style } = theme
        form.reset({
          name,
          description: description || '',
          colors,
          typography,
          spacing,
          style,
        })
      } else {
        toast.error('Tema não encontrado')
        navigate('/area-do-produtor/identidade-visual')
      }
    }
  }, [isEditing, id, getThemeById, form, navigate])

  const watchedValues = form.watch() as ThemeValues

  function onSubmit(values: FormValues) {
    if (isEditing && id) {
      updateTheme(id, values)
    } else {
      addTheme(values)
    }
    navigate('/area-do-produtor/identidade-visual')
  }

  return (
    <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate('/area-do-produtor/identidade-visual')
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isEditing ? 'Editar Tema' : 'Criar Novo Tema'}
            </h2>
            <p className="text-muted-foreground text-sm">
              Personalize a aparência dos seus eventos.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate('/area-do-produtor/identidade-visual')
            }
          >
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" /> Salvar Tema
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden pb-6">
        {/* Left Column: Form */}
        <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 scrollbar-thin">
          <Form {...form}>
            <form className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Tema *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Tema de Verão" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descrição sobre o propósito deste tema..."
                          className="h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Colors */}
              <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Cores</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="colors.primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor Principal *</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            className="w-12 h-10 p-1 cursor-pointer"
                            {...field}
                          />
                          <Input {...field} className="font-mono uppercase" />
                        </div>
                        <ContrastBadge bg={field.value} fg="#FFFFFF" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="colors.secondary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor Secundária *</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            className="w-12 h-10 p-1 cursor-pointer"
                            {...field}
                          />
                          <Input {...field} className="font-mono uppercase" />
                        </div>
                        <ContrastBadge
                          bg={field.value}
                          fg={watchedValues.colors.text}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="colors.background"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor de Fundo</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            className="w-12 h-10 p-1 cursor-pointer"
                            {...field}
                          />
                          <Input {...field} className="font-mono uppercase" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="colors.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor do Texto</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            className="w-12 h-10 p-1 cursor-pointer"
                            {...field}
                          />
                          <Input {...field} className="font-mono uppercase" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {showAllColors && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                    {['success', 'warning', 'error', 'info'].map(
                      (colorType) => (
                        <FormField
                          key={colorType}
                          control={form.control}
                          // @ts-expect-error - dynamic access
                          name={`colors.${colorType}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="capitalize">
                                Cor {colorType}
                              </FormLabel>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  className="w-12 h-10 p-1 cursor-pointer"
                                  {...field}
                                />
                                <Input
                                  {...field}
                                  className="font-mono uppercase"
                                />
                              </div>
                            </FormItem>
                          )}
                        />
                      ),
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-primary"
                  onClick={() => setShowAllColors(!showAllColors)}
                >
                  {showAllColors
                    ? '- Ocultar Cores Adicionais'
                    : '+ Mostrar Todas as Cores'}
                </Button>
              </div>

              {/* Typography */}
              <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Type className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Fontes e Tamanhos</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="typography.titleFont"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonte Títulos</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FONTS.map((f) => (
                              <SelectItem key={f} value={f}>
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="typography.bodyFont"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonte Corpo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FONTS.map((f) => (
                              <SelectItem key={f} value={f}>
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="typography.baseSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho Base (px)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="typography.lineHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura da Linha</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Spacing */}
              <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Ruler className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Espaçamento</h3>
                </div>

                <div className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name="spacing.baseUnit"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Unidade Base (px)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Escala tudo no layout.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <div className="flex-1 p-3 bg-muted rounded-lg text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Pequeno (1x):</span>
                      <strong>{watchedValues.spacing.baseUnit}px</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Médio (4x):</span>
                      <strong>{watchedValues.spacing.baseUnit * 4}px</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Grande (8x):</span>
                      <strong>{watchedValues.spacing.baseUnit * 8}px</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* More Options */}
              <Collapsible className="border rounded-xl bg-card shadow-sm">
                <CollapsibleTrigger className="flex w-full items-center justify-between p-5 font-semibold hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <MoreHorizontal className="h-5 w-5 text-primary" />
                    </div>
                    <span>Mais Opções (Bordas, Sombras, Efeitos)</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-5 pt-0 space-y-6 border-t">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <FormField
                      control={form.control}
                      name="style.borderRadius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arredondamento</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Nenhum</SelectItem>
                              <SelectItem value="small">Pequeno</SelectItem>
                              <SelectItem value="medium">Médio</SelectItem>
                              <SelectItem value="large">Grande</SelectItem>
                              <SelectItem value="full">Total</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="style.borderThickness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Espessura da Borda (px)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="style.shadow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intensidade da Sombra</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Nenhuma</SelectItem>
                              <SelectItem value="light">Leve</SelectItem>
                              <SelectItem value="medium">Média</SelectItem>
                              <SelectItem value="strong">Forte</SelectItem>
                              <SelectItem value="heavy">Muito Forte</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </form>
          </Form>
        </div>

        {/* Right Column: Preview (Sticky on Desktop) */}
        <div className="w-full lg:w-[480px] xl:w-[550px] shrink-0 h-[500px] lg:h-full sticky top-0">
          <ThemePreview values={watchedValues} />
        </div>
      </div>
    </div>
  )
}
