# Guia de Componentes e Padrões de UI

**Versão**: 0.0.48  
**Data**: Dezembro 2025

---

## 📋 Índice

1. [Componentes Shadcn UI](#componentes-shadcn-ui)
2. [Componentes Customizados](#componentes-customizados)
3. [Layouts](#layouts)
4. [Formulários e Validação](#formulários-e-validação)
5. [Padrões de Design](#padrões-de-design)
6. [Acessibilidade](#acessibilidade)
7. [Responsividade](#responsividade)

---

## 🎨 Componentes Shadcn UI

O projeto utiliza **~50 componentes Shadcn UI** baseados em Radix UI e Tailwind CSS. Todos estão em `src/components/ui/`.

### Componentes Mais Utilizados

#### Button

```tsx
import { Button } from '@/components/ui/button'

// Variações
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button disabled>Disabled</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">→</Button>

// Com ícones
<Button className="gap-2">
  <Plus className="h-4 w-4" />
  Criar
</Button>
```

#### Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo aqui
  </CardContent>
</Card>
```

#### Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
    </DialogHeader>
    {/* Conteúdo */}
  </DialogContent>
</Dialog>
```

#### Form (React Hook Form Integration)

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const form = useForm({
  resolver: zodResolver(mySchema),
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="seu@email.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Enviar</Button>
  </form>
</Form>
```

#### Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="avisos">
  <TabsList>
    <TabsTrigger value="avisos">Avisos</TabsTrigger>
    <TabsTrigger value="boletins">Boletins</TabsTrigger>
  </TabsList>
  <TabsContent value="avisos">
    {/* Avisos aqui */}
  </TabsContent>
  <TabsContent value="boletins">
    {/* Boletins aqui */}
  </TabsContent>
</Tabs>
```

#### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

#### Badge

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>Draft</Badge>
<Badge variant="secondary">Published</Badge>
<Badge variant="destructive">Closed</Badge>
<Badge variant="outline">Archived</Badge>
```

#### Toast/Sonner

```tsx
import { toast } from 'sonner'

// Sucesso
toast.success('Evento criado com sucesso!')

// Erro
toast.error('Falha ao criar evento')

// Info
toast.info('Processando...')

// Loading
const id = toast.loading('Carregando...')
setTimeout(() => toast.dismiss(id), 2000)
```

#### Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Erro</AlertTitle>
  <AlertDescription>Algo deu errado.</AlertDescription>
</Alert>
```

---

## 🧩 Componentes Customizados

### Componentes Específicos do Projeto

#### DashboardHeader

```tsx
import { DashboardHeader } from '@/components/DashboardHeader'

// Usado em Layout principal
// Renderiza automaticamente:
// - Título dinâmico baseado na rota
// - Menu mobile
// - Avatar usuário com dropdown
```

#### DashboardSidebar

```tsx
import { DashboardSidebar } from '@/components/DashboardSidebar'

// Navegação principal do dashboard
// Links para:
// - Dashboard Home
// - Cadastro Básico (Eventos, Modalidades, etc)
// - Configurações
```

#### EventPreview

```tsx
import { EventPreview } from '@/components/EventPreview'

<EventPreview eventId="event-123" isOpen={isOpen} />

// Preview em modal do evento público
```

#### ParticipantSidebar

```tsx
import { ParticipantSidebar } from '@/components/ParticipantSidebar'

// Navegação da área do participante
// Links para:
// - Dashboard
// - Perfil Escola
// - Atletas
// - Técnicos
// - Fichas de Inscrição
```

#### ProtectedRoute

```tsx
import ProtectedRoute from '@/components/ProtectedRoute'

<Route path="/area-do-produtor" element={
  <ProtectedRoute>
    <Layout />
  </ProtectedRoute>
} />

// Protege rota verificando autenticação
// Se não autenticado, redireciona para /
// Se sem permissão, redireciona para /acesso-negado
```

---

## 🏗️ Layouts

### Layout Principal (Dashboard Produtor)

```tsx
import Layout from '@/components/Layout'

// Estrutura:
// <Layout>
//   <DashboardSidebar />
//   <main>
//     <DashboardHeader />
//     <Outlet /> {/* Conteúdo dinâmico */}
//     <Footer />
//   </main>
// </Layout>
```

**Usado em**: Todas as rotas `/area-do-produtor/**`

### EventPanelLayout

```tsx
import EventPanelLayout from '@/components/EventPanelLayout'

// Estrutura específica para um evento
// <EventPanelLayout>
//   <EventPanelSidebar /> {/* evento específico */}
//   <main>
//     <DashboardHeader />
//     <Outlet />
//   </main>
// </EventPanelLayout>
```

**Usado em**: `/area-do-produtor/evento/:eventId/**`

### ParticipantLayout

```tsx
import ParticipantLayout from '@/components/ParticipantLayout'

// Para escola/participante
// <ParticipantLayout>
//   <ParticipantSidebar />
//   <main>
//     <ParticipantHeader />
//     <Outlet />
//   </main>
// </ParticipantLayout>
```

**Usado em**: `/area-do-participante/**`

---

## 📝 Formulários e Validação

### Padrão de Formulário

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Definir schema Zod
const formSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Deve ter 18 anos'),
})

type FormValues = z.infer<typeof formSchema>

// 2. Usar em componente
export default function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // Valida enquanto digita
  })

  const onSubmit = async (data: FormValues) => {
    try {
      // API call ou context update
      toast.success('Sucesso!')
    } catch (error) {
      toast.error('Erro!')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Form>
  )
}
```

### Validações Comuns

```typescript
// Email
z.string().email('Email inválido')

// URL
z.string().url('URL inválida')

// Data
z.date()

// CPF (com regex)
z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')

// Telefone
z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/)

// Enum
z.enum(['draft', 'published', 'closed'])

// Condicional
z.object({
  type: z.enum(['individual', 'coletiva']),
  maxAthletes: z.number().when('type', {
    is: 'coletiva',
    then: z.number().min(5),
  })
})
```

---

## 🎨 Padrões de Design

### Cards com Stats

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      Eventos Ativos
    </CardTitle>
    <Calendar className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">12</div>
    <p className="text-xs text-muted-foreground">
      +2 desde mês passado
    </p>
  </CardContent>
</Card>
```

### Tabelas com Ações

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead className="text-right">Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">
            Editar
          </Button>
          <Button variant="ghost" size="sm">
            Deletar
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Wizard/Stepper

```tsx
import { Check, ChevronRight } from 'lucide-react'

const steps = [
  { id: 1, title: 'Básico', description: 'Dados gerais' },
  { id: 2, title: 'Modalidades', description: 'Competições' },
  { id: 3, title: 'Visual', description: 'Tema' },
]

<div className="flex justify-between">
  {steps.map((step, idx) => (
    <div key={step.id} className="flex items-center gap-2">
      <div className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center',
        currentStep >= step.id ? 'bg-primary text-white' : 'bg-muted'
      )}>
        {currentStep > step.id ? <Check /> : step.id}
      </div>
      <div className="text-sm">
        <div className="font-bold">{step.title}</div>
        <div className="text-muted-foreground text-xs">{step.description}</div>
      </div>
    </div>
  ))}
</div>
```

### Empty States

```tsx
<div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
  <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
  <h3 className="font-semibold">Nenhum evento</h3>
  <p className="text-sm text-muted-foreground mb-4">
    Comece criando seu primeiro evento
  </p>
  <Button asChild>
    <Link to="/cadastro-basico/evento/novo">Criar evento</Link>
  </Button>
</div>
```

---

## ♿ Acessibilidade

### Boas Práticas WCAG AA

#### Semântica HTML

```tsx
// ✅ Bom: Usar elementos semânticos
<button aria-label="Excluir evento">
  <Trash2 className="h-4 w-4" />
</button>

// ❌ Ruim: Div sem semântica
<div onClick={deleteEvent}>
  <Trash2 />
</div>
```

#### Contraste de Cores

```tsx
// ✅ Suficiente contraste (WCAG AA)
<p className="text-slate-900 bg-white">Texto com alto contraste</p>

// ❌ Contraste insuficiente
<p className="text-gray-400 bg-white">Difícil de ler</p>
```

#### Labels em Formulários

```tsx
// ✅ Label vinculada
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Ou usar FormField do Shadcn que faz isto
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel> {/* htmlFor automático */}
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

#### ARIA Attributes

```tsx
// Para ícones sem texto
<button aria-label="Abrir menu">
  <Menu className="h-4 w-4" />
</button>

// Para alertas
<Alert role="alert" className="bg-red-50">
  <AlertTitle>Erro</AlertTitle>
</Alert>

// Para carregamento
<Button disabled aria-busy="true">
  <Loader2 className="animate-spin" />
  Carregando...
</Button>
```

---

## 📱 Responsividade

### Breakpoints Tailwind

```
sm: 640px   (mobile grande)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (desktop grande)
2xl: 1536px (ultra-wide)
```

### Componentes Responsivos

```tsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>

// Sidebar que vira mobile
<div className="flex">
  <aside className="hidden md:block w-64">
    <DashboardSidebar />
  </aside>
  <main className="flex-1">
    {/* Conteúdo */}
  </main>
</div>

// Tabela mobile
<div className="overflow-x-auto">
  <Table>
    {/* Tabela pode fazer scroll horizontal em mobile */}
  </Table>
</div>

// Buttons em mobile
<div className="flex gap-2 flex-col md:flex-row">
  <Button>Opção 1</Button>
  <Button>Opção 2</Button>
</div>
```

### Hook useMobile()

```tsx
import { useIsMobile } from '@/hooks/use-mobile'

export default function MyComponent() {
  const isMobile = useIsMobile() // < 768px

  if (isMobile) {
    return <MobileLayout />
  }

  return <DesktopLayout />
}
```

### Dark Mode

```tsx
// Automático via ThemeContext
// Componentes adaptam-se com Tailwind dark: modifier

<div className="bg-white dark:bg-slate-950 text-black dark:text-white">
  Muda de cor baseado em tema
</div>

// Usar ThemeContext
const { theme, toggleTheme } = useTheme()

<button onClick={toggleTheme}>
  {theme === 'light' ? '🌙 Escuro' : '☀️ Claro'}
</button>
```

---

## 🚀 Componentes Avançados

### Accordion

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Básicas</AccordionTrigger>
    <AccordionContent>
      {/* Conteúdo que expande */}
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Avançadas</AccordionTrigger>
    <AccordionContent>
      {/* ... */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Skeleton Loader

```tsx
import { Skeleton } from '@/components/ui/skeleton'

<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

### Tooltip

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

<Tooltip>
  <TooltipTrigger asChild>
    <button>Ação</button>
  </TooltipTrigger>
  <TooltipContent>Descrição da ação</TooltipContent>
</Tooltip>
```

---

**Documento elaborado em**: Dezembro 2025  
**Próxima revisão**: Q1 2026
