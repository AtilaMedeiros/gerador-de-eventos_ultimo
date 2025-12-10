# Guia de Implementação: Server vs Client Components

## Decisão Tomada ✅
Otimizar usando **Server Components** onde possível para melhor performance e SEO.

---

## 1. Regras de Ouro

### ✅ Use Server Component quando:
- Componente apenas **exibe dados** (sem interatividade)
- Precisa fazer **fetch de dados** do servidor/banco
- Quer **melhor SEO** (páginas públicas)
- Não usa hooks de estado (useState, useEffect, useContext)
- Não usa event handlers (onClick, onChange)

### 🔴 Use Client Component quando:
- Usa **hooks** React (useState, useEffect, useContext, etc)
- Usa **event handlers** (onClick, onChange, onSubmit)
- Usa **Web APIs** (localStorage, window, document)
- Usa bibliotecas**client-only** (react-hook-form, tiptap, recharts)
- Precisa de **interatividade**

---

## 2. Estratégia de Componentes do Projeto

### 📄 Páginas Públicas (Otimizadas para SEO)

#### ✅ Server Component: app/evento/[slug]/[id]/page.tsx

```typescript
// Sem 'use client' = Server Component

import { notFound } from 'next/navigation'
import EventHero from './components/EventHero'
import PublicHeader from './components/PublicHeader'
import PublicAbout from './components/PublicAbout'
import NewsCarousel from './components/NewsCarousel'
import PublicPartners from './components/PublicPartners'
import PublicFooter from './components/PublicFooter'

// Função que roda no SERVIDOR
async function getEvent(id: string) {
  // Buscar do banco de dados ou localStorage via API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
    cache: 'no-store', // ou 'force-cache' para SSG
  })
  
  if (!res.ok) return null
  return res.json()
}

// Server Component
export default async function EventPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const event = await getEvent(params.id)
  
  if (!event) {
    notFound()
  }

  // HTML gerado no servidor, enviado pronto ao cliente
  return (
    <div>
      <PublicHeader event={event} />
      <EventHero event={event} />
      <PublicAbout description={event.description} />
      <NewsCarousel news={event.news} />
      <PublicPartners partners={event.partners} />
      <PublicFooter />
    </div>
  )
}

// Metadata para SEO (só funciona em Server Components)
export async function generateMetadata({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const event = await getEvent(params.id)
  
  return {
    title: event?.name || 'Evento não encontrado',
    description: event?.description?.substring(0, 160),
    openGraph: {
      title: event?.name,
      description: event?.description?.substring(0, 160),
      images: [event?.logo],
    },
  }
}
```

**Vantagens:**
- ✅ Google indexa perfeitamente
- ✅ Tempo de carregamento inicial mais rápido
- ✅ Menos JavaScript enviado ao navegador

---

### 🔴 Client Component: Componentes Interativos

#### NewsCarousel (Precisa de 'use client')

```typescript
// components/NewsCarousel.tsx
'use client'

import { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface News {
  id: string
  title: string
  image: string
}

// Props vêm do Server Component pai
export default function NewsCarousel({ news }: { news: News[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()])
  
  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex">
        {news.map((item) => (
          <div key={item.id} className="flex-[0_0_100%]">
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Motivo para Client:**
- Usa hook `useEmblaCarousel`
- Precisa de ref do DOM
- Biblioteca client-only

---

### Composição: Server + Client

#### ✅ Server Component (pai) passa dados para 🔴 Client Component (filho)

```typescript
// app/evento/[slug]/[id]/page.tsx (Server)

import NewsCarousel from './components/NewsCarousel' // Client

export default async function EventPage({ params }) {
  // Busca dados no SERVIDOR
  const event = await getEvent(params.id)
  
  return (
    <div>
      {/* Server Component renderiza */}
      <h1>{event.name}</h1>
      
      {/* Passa dados pro Client Component */}
      <NewsCarousel news={event.news} />
    </div>
  )
}
```

**Padrão importante:**
- Server Component busca dados
- Passa dados via props pro Client Component
- Client Component só lida com interatividade

---

## 3. Mapeamento Completo do Projeto

### Páginas Públicas

| Página | Tipo | Componente | Justificativa |
|--------|------|------------|---------------|
| `/` | 🔴 Client | `page.tsx` | Formulário de login |
| `/evento/[slug]/[id]` | ✅ Server | `page.tsx` | SEO + fetch de dados |
| `/evento/.../comunicacao` | ✅ Server | `page.tsx` | SEO + fetch de dados |
| `/evento/.../regulamentos` | ✅ Server | `page.tsx` | SEO + fetch de dados |
| `/acesso-negado` | ✅ Server | `page.tsx` | Página estática |
| `/not-found` | ✅ Server | `not-found.tsx` | Página estática |

### Componentes de Páginas Públicas

| Componente | Tipo | Justificativa |
|------------|------|---------------|
| `PublicHeader` | 🔴 Client | Navigation menu (interativo) |
| `EventHero` | 🔴/✅ Híbrido | Título (Server), Botões (Client) |
| `PublicAbout` | ✅ Server | Apenas exibe texto |
| `NewsCarousel` | 🔴 Client | Embla carousel (client-only) |
| `PublicPartners` | ✅ Server | Apenas exibe logos |
| `PublicSchedule` | ✅ Server | Apenas exibe dados |
| `PublicFooter` | ✅ Server | Links estáticos |

### Áreas Protegidas

| Página | Tipo | Justificativa |
|--------|------|---------------|
| Todas as páginas de formulário | 🔴 Client | React Hook Form |
| Todas as páginas de listagem | 🔴 Client | useState, filtros |
| Dashboards | 🔴 Client | Gráficos (Recharts) |
| Perfil/Configurações | 🔴 Client | Formulários |

**Realidade:** ~80% das páginas protegidas serão Client Components devido a:
- React Hook Form ubíquo
- Uso extensivo de Context API
- Interatividade constante

---

## 4. Padrão: Dividir Componentes

### ❌ Antes (Tudo Client)

```typescript
'use client'

export default function EventPage() {
  const [event, setEvent] = useState(null)
  
  useEffect(() => {
    // Fetch client-side
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(setEvent)
  }, [])
  
  return (
    <div>
      <Header />
      <h1>{event?.name}</h1>
      <Description text={event?.description} />
      <InteractiveButton />
    </div>
  )
}
```

**Problemas:**
- ❌ Tudo é Client Component
- ❌ Fetch client-side (loading delay)
- ❌ SEO ruim
- ❌ Bundle JavaScript grande

---

### ✅ Depois (Server + Client otimizado)

```typescript
// page.tsx (Server Component)

import Header from './Header' // Server
import Description from './Description' // Server
import InteractiveButton from './InteractiveButton' // Client

async function getEvent(id: string) {
  // Fetch no SERVIDOR
  const res = await fetch(`${process.env.API_URL}/events/${id}`)
  return res.json()
}

export default async function EventPage({ params }) {
  const event = await getEvent(params.id)
  
  return (
    <div>
      <Header />
      <h1>{event.name}</h1>
      <Description text={event.description} /> {/* Server */}
      <InteractiveButton eventId={event.id} /> {/* Client */}
    </div>
  )
}
```

```typescript
// Description.tsx (Server Component - sem 'use client')
export default function Description({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />
}
```

```typescript
// InteractiveButton.tsx (Client Component)
'use client'

import { useState } from 'react'

export default function InteractiveButton({ eventId }: { eventId: string }) {
  const [clicked, setClicked] = useState(false)
  
  return (
    <button onClick={() => setClicked(true)}>
      {clicked ? 'Inscrito!' : 'Inscrever-se'}
    </button>
  )
}
```

**Benefícios:**
- ✅ HTML gerado no servidor (fast)
- ✅ SEO perfeito
- ✅ Apenas `InteractiveButton` é enviado como JS
- ✅ Bundle menor

---

## 5. Casos Especiais

### Caso 1: Tiptap Editor (Rich Text)

```typescript
// components/RichTextEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// SEMPRE Client Component (biblioteca client-only)
export default function RichTextEditor({ 
  content, 
  onChange 
}: {
  content: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return <EditorContent editor={editor} />
}
```

### Caso 2: Recharts (Gráficos)

```typescript
// components/EventStats.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis } from 'recharts'

// SEMPRE Client Component
export default function EventStats({ data }) {
  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  )
}
```

### Caso 3: jspdf (Geração de PDF)

```typescript
// components/GeneratePDFButton.tsx
'use client'

import { jsPDF } from 'jspdf'

// SEMPRE Client Component (usa window)
export default function GeneratePDFButton({ data }) {
  const generatePDF = () => {
    const doc = new jsPDF()
    doc.text('Relatório', 10, 10)
    doc.save('relatorio.pdf')
  }
  
  return <button onClick={generatePDF}>Gerar PDF</button>
}
```

---

## 6. Layouts

### Server Layout (Wrapper)

```typescript
// app/layout.tsx (Server Component)

import { Inter } from 'next/font/google'
import { Providers } from './providers' // Client wrapper
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### Client Providers

```typescript
// app/providers.tsx
'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
```

**Padrão:**
- Root Layout = Server
- Providers wrapper = Client (context)
- Children podem ser Server ou Client

---

## 7. Fetching de Dados

### ✅ Server Component (Recomendado para páginas públicas)

```typescript
// app/area-do-produtor/evento/page.tsx

async function getEvents() {
  const res = await fetch(`${process.env.API_URL}/events`, {
    cache: 'no-store', // Sempre busca dados frescos
    // ou
    // next: { revalidate: 60 } // Revalida a cada 60s
  })
  return res.json()
}

export default async function EventsPage() {
  const events = await getEvents()
  
  return (
    <div>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

### 🔴 Client Component (Para dados que mudam frequentemente)

```typescript
// app/area-do-produtor/evento/page.tsx
'use client'

import { useState, useEffect } from 'react'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents)
  }, [])
  
  return (
    <div>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

---

## 8. Checklist de Implementação

### Páginas Públicas
- [ ] `/evento/[slug]/[id]` - Server Component
- [ ] Adicionar `generateMetadata` para SEO
- [ ] `PublicHeader` - Analisar se pode ser Server
- [ ] `PublicAbout` - Server Component
- [ ] `PublicPartners` - Server Component
- [ ] `PublicSchedule` - Server Component
- [ ] `PublicFooter` - Server Component
- [ ] `NewsCarousel` - Client Component (Embla)

### Componentes Interativos
- [ ] Marcar todos os formulários como Client
- [ ] Marcar componentes com Tiptap como Client
- [ ] Marcar componentes com Recharts como Client
- [ ] Marcar componentes com jspdf como Client

### Otimizações
- [ ] Dividir componentes grandes em Server + Client
- [ ] Mover fetch de dados para Server Components
- [ ] Implementar `loading.tsx` para cada seção
- [ ] Implementar `error.tsx` para cada seção

---

## 9. Exemplo Prático: EventForm

### ❌ Tudo Client (abordagem antiga)

```typescript
'use client'

export default function EventForm() {
  const form = useForm()
  const editor = useEditor()
  
  return (
    <form>
      <Input /> {/* Client */}
      <RichTextEditor /> {/* Client */}
      <Button /> {/* Client */}
    </form>
  )
}
```

### ✅ Otimizado (dividir responsabilidades)

```typescript
// page.tsx (Server - se buscar dados iniciais)
import EventFormClient from './EventFormClient'

async function getEvent(id: string) {
  // Buscar no servidor
  const res = await fetch(`${process.env.API_URL}/events/${id}`)
  return res.json()
}

export default async function EventFormPage({ params }) {
  const event = params.id ? await getEvent(params.id) : null
  
  return <EventFormClient initialData={event} />
}
```

```typescript
// EventFormClient.tsx
'use client'

export default function EventFormClient({ initialData }) {
  const form = useForm({ defaultValues: initialData })
  
  return (/* formulário */)
}
```

---

## 10. Performance Tips

### 1. Lazy Loading de Client Components

```typescript
'use client'

import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false, // Não renderiza no servidor
  loading: () => <p>Carregando editor...</p>
})
```

### 2. Suspense Boundaries

```typescript
// Server Component
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SlowComponent />
    </Suspense>
  )
}
```

### 3. Streaming de Dados

```typescript
// Use Suspense para carregar parts da página progressivamente
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
</Suspense>

<Suspense fallback={<ContentSkeleton />}>
  <Content />
</Suspense>
```

---

**Documento criado em**: 10/12/2025  
**Status**: Fase 2 - Implementação  
**Abordagem**: Server Components onde possível + Client Components para interatividade
