# Arquitectura do Projeto - Gerador de Eventos

**Versão**: 0.0.48  
**Data**: Dezembro 2025

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Stack Técnico](#stack-técnico)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Padrões de Projeto](#padrões-de-projeto)
5. [Context API e Estado Global](#context-api-e-estado-global)
6. [Componentes e Layouts](#componentes-e-layouts)
7. [Sistema de Roteamento](#sistema-de-roteamento)
8. [Persistência de Dados](#persistência-de-dados)
9. [Fluxo de Dados](#fluxo-de-dados)
10. [Boas Práticas](#boas-práticas)

---

## 🏗️ Visão Geral da Arquitetura

A arquitetura do **Gerador de Eventos** segue o padrão **Component-Based Architecture** com **Context API** para gerenciamento de estado global. O projeto é organizado em camadas funcionais:

```
┌─────────────────────────────────────────┐
│         React Router (Roteamento)       │
├─────────────────────────────────────────┤
│  Layouts (Dashboard, Event, Participant)│
├─────────────────────────────────────────┤
│   Páginas (Pages - Lógica de negócio)   │
├─────────────────────────────────────────┤
│  Componentes Reutilizáveis (UI + Logic) │
├─────────────────────────────────────────┤
│  Context Providers (Auth, Event, etc)   │
├─────────────────────────────────────────┤
│  localStorage (Persistência)            │
└─────────────────────────────────────────┘
```

### Princípios Arquiteturais

- **Separação de Responsabilidades**: Componentes UI, lógica de negócio e estado separados
- **Reutilização**: Componentes Shadcn/UI aplicados em múltiplos contextos
- **Composição**: Layouts compostos por componentes menores
- **Context Isolation**: Cada contexto gerencia um domínio específico
- **TypeScript Strict**: Tipagem completa para segurança
- **Responsive First**: Mobile-first design com Tailwind CSS

---

## 💻 Stack Técnico

### Frontend Framework
```
React 19.2.0          → Framework principal
TypeScript 5.9        → Tipagem estática
Vite (Rolldown)       → Build tool extremamente rápido
React Router 6.30     → Roteamento client-side
```

### Gerenciamento de Estado
```
Context API           → Estado global (7 contextos)
React Hooks           → useState, useEffect, useContext, useMemo
```

### UI e Styling
```
Shadcn UI            → Componentes acessíveis pré-construídos
Radix UI             → Primitivos de componentes
Tailwind CSS 3.4     → Utility-first CSS framework
class-variance-authority → Variantes de classes CSS
clsx / tailwind-merge → Manipulação de classNames
```

### Formulários e Validação
```
React Hook Form 7.66 → Gerenciamento eficiente de formulários
Zod 3.25            → Validação de schemas TypeScript-first
@hookform/resolvers → Integração Zod + React Hook Form
```

### Bibliotecas Utilitárias
```
date-fns 4.1        → Manipulação de datas/horas
Lucide React 0.552  → Ícones SVG
Sonner 2.0.7        → Toast notifications
Recharts 2.15.4     → Gráficos e visualizações
Embla Carousel      → Carrosséis responsivos
```

### Qualidade de Código
```
Oxlint 1.29         → Linter extremamente rápido
Prettier 3.6.2      → Formatação automática de código
ESLint 9.39         → Análise estática
TypeScript Strict   → Configuração rigorosa
```

---

## 📁 Estrutura de Pastas

```
gerador-de-eventos/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── accordion.tsx           # Componentes Shadcn
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── [outros ~40 componentes]
│   │   │
│   │   ├── DashboardHeader.tsx         # Header principal
│   │   ├── DashboardSidebar.tsx        # Sidebar principal
│   │   ├── EventPanelLayout.tsx        # Layout por evento
│   │   ├── EventPanelSidebar.tsx       # Sidebar do evento
│   │   ├── ParticipantLayout.tsx       # Layout do participante
│   │   ├── ParticipantHeader.tsx       # Header participante
│   │   ├── ParticipantSidebar.tsx      # Sidebar participante
│   │   ├── Layout.tsx                  # Layout padrão dashboard
│   │   ├── ProtectedRoute.tsx          # HOC de proteção de rotas
│   │   ├── EventPreview.tsx            # Preview do evento
│   │   ├── ThemePreview.tsx            # Preview de temas
│   │   └── FileUpload.tsx              # Upload de arquivos
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx             # 🔐 Autenticação
│   │   ├── EventContext.tsx            # 📅 Eventos
│   │   ├── ModalityContext.tsx         # 🏆 Modalidades
│   │   ├── ParticipantContext.tsx      # 🏫 Escolas/Atletas/Inscrições
│   │   ├── CommunicationContext.tsx    # 📢 Avisos/Boletins/Resultados
│   │   ├── ThemeContext.tsx            # 🎨 Tema (Dark/Light)
│   │   └── [Providers combinados em App.tsx]
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx              # Detecta viewport mobile
│   │   └── use-toast.ts                # Hook de toast notifications
│   │
│   ├── lib/
│   │   └── utils.ts                    # Funções utilitárias (cn, etc)
│   │
│   ├── pages/
│   │   ├── Login.tsx                   # 🔑 Login produtor
│   │   ├── AccessDenied.tsx            # ❌ 403 - Acesso negado
│   │   ├── NotFound.tsx                # ❌ 404 - Página não encontrada
│   │   ├── Index.tsx                   # Home/Index
│   │   │
│   │   ├── dashboard/                  # 📊 ÁREA DO PRODUTOR
│   │   │   ├── DashboardHome.tsx       # Home com stats
│   │   │   ├── Profile.tsx             # Perfil usuário
│   │   │   ├── Reports.tsx             # Relatórios globais
│   │   │   ├── Settings.tsx            # Configurações
│   │   │   │
│   │   │   ├── basic-registration/     # 📝 CADASTRO BÁSICO
│   │   │   │   ├── EventsList.tsx      # Lista de eventos
│   │   │   │   ├── EventForm.tsx       # Formulário evento
│   │   │   │   ├── EventWizard.tsx     # ⭐ Wizard 3 etapas
│   │   │   │   ├── ModalitiesList.tsx  # Lista modalidades
│   │   │   │   ├── ModalityForm.tsx    # Formulário modalidade
│   │   │   │   ├── UsersList.tsx       # Lista usuários
│   │   │   │   ├── UserForm.tsx        # Formulário usuário
│   │   │   │   ├── VisualIdentityList.tsx # Lista temas
│   │   │   │   ├── VisualIdentityForm.tsx # Formulário tema
│   │   │   │   ├── components/
│   │   │   │   │   ├── EventBasicInfo.tsx
│   │   │   │   │   ├── EventDateFields.tsx
│   │   │   │   │   ├── EventRegistrationFields.tsx
│   │   │   │   │   └── EventProducerFields.tsx
│   │   │   │   └── schemas.ts          # Validações Zod
│   │   │   │
│   │   │   ├── event-config/           # ⚙️ CONFIGURAÇÃO POR EVENTO
│   │   │   │   ├── AssociateModalities.tsx # Associar modalidades
│   │   │   │   ├── ApplyVisualIdentity.tsx # Aplicar tema
│   │   │   │   ├── Communication.tsx   # ⭐ Comunicação multi-abas
│   │   │   │   └── communication-tabs/
│   │   │   │       ├── NoticesTab.tsx
│   │   │   │       ├── BulletinsTab.tsx
│   │   │   │       ├── ResultsTab.tsx
│   │   │   │       └── RegulationsTab.tsx
│   │   │   │
│   │   │   └── event-panel/            # 📍 PAINEL POR EVENTO (:eventId)
│   │   │       ├── EventPanelDashboard.tsx
│   │   │       ├── EventSchools.tsx
│   │   │       ├── EventAthletes.tsx
│   │   │       └── EventReports.tsx
│   │   │
│   │   ├── participant/                # 👥 ÁREA DO PARTICIPANTE
│   │   │   ├── ParticipantLogin.tsx
│   │   │   ├── ParticipantRegister.tsx
│   │   │   ├── ParticipantHome.tsx
│   │   │   ├── SchoolProfile.tsx
│   │   │   ├── InscriptionForms.tsx
│   │   │   ├── PrintableInscriptionForm.tsx
│   │   │   │
│   │   │   ├── athletes/
│   │   │   │   ├── AthletesList.tsx
│   │   │   │   ├── AthleteForm.tsx
│   │   │   │   └── AthleteInscription.tsx
│   │   │   │
│   │   │   └── technicians/
│   │   │       ├── TechniciansList.tsx
│   │   │       └── TechnicianForm.tsx
│   │   │
│   │   └── public/                     # 🌐 PÁGINAS PÚBLICAS
│   │       ├── EventPage.tsx           # Página pública do evento
│   │       ├── EventCommunicationPage.tsx # Comunicação pública
│   │       └── components/
│   │           ├── PublicHeader.tsx
│   │           ├── PublicHero.tsx
│   │           ├── PublicNews.tsx
│   │           ├── PublicAbout.tsx
│   │           ├── PublicPartners.tsx
│   │           ├── PublicFooter.tsx
│   │           ├── PublicTicker.tsx
│   │           └── [outros]
│   │
│   ├── App.tsx                         # 🚀 Router principal
│   ├── main.tsx                        # Entry point
│   ├── main.css                        # Estilos globais
│   └── vite-env.d.ts                   # Tipagem Vite
│
├── public/
│   └── [Assets estáticos]
│
├── vite.config.ts                      # Configuração Vite
├── tsconfig.json                       # Configuração TypeScript
├── tailwind.config.ts                  # Configuração Tailwind
├── postcss.config.js                   # Configuração PostCSS
├── package.json
└── README.md
```

### Convenção de Nomes

```
Components:    PascalCase (EventForm.tsx)
Hooks:         camelCase com prefixo 'use' (useAuth.ts)
Contexts:      PascalCase com sufixo 'Context' (AuthContext.tsx)
Utilities:     camelCase (generateSlug.ts)
Types/Interfaces: PascalCase (Event, User, Athlete)
```

---

## 🎨 Padrões de Projeto

### 1. **Component Composition Pattern**

Componentes quebrados em partes menores e reutilizáveis:

```tsx
// ❌ Evitar
export default function EventForm() {
  return (
    <div>
      {/* 500+ linhas de JSX */}
    </div>
  )
}

// ✅ Preferir
export default function EventForm() {
  return (
    <div>
      <EventBasicInfo />
      <EventDateFields />
      <EventRegistrationFields />
      <EventProducerFields />
    </div>
  )
}
```

### 2. **Container/Presentational Pattern**

Separação entre componentes com lógica e componentes puros:

```tsx
// Container (Com lógica)
export default function AthletesList() {
  const { athletes } = useParticipant()
  const [filtered, setFiltered] = useState(athletes)
  
  return <AthletesListView athletes={filtered} />
}

// Presentational (Apenas renderiza)
function AthletesListView({ athletes }: Props) {
  return athletes.map(a => <AthleteCard key={a.id} athlete={a} />)
}
```

### 3. **Custom Hooks Pattern**

Lógica reutilizável extraída em hooks:

```tsx
// ✅ Usar custom hooks para lógica compartilhada
function useEventFilters() {
  const { events } = useEvent()
  const [status, setStatus] = useState<Status>('published')
  
  const filtered = useMemo(() =>
    events.filter(e => e.status === status),
    [events, status]
  )
  
  return { filtered, status, setStatus }
}
```

### 4. **Compound Component Pattern**

Componentes que trabalham juntos:

```tsx
// Exemplo: Tabs do Shadcn UI
<Tabs defaultValue="avisos">
  <TabsList>
    <TabsTrigger value="avisos">Avisos</TabsTrigger>
    <TabsTrigger value="boletins">Boletins</TabsTrigger>
  </TabsList>
  <TabsContent value="avisos">...</TabsContent>
  <TabsContent value="boletins">...</TabsContent>
</Tabs>
```

### 5. **Form Validation Pattern**

Validação com Zod + React Hook Form:

```tsx
const eventFormSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  startDate: z.date(),
  location: z.string().nonempty(),
})

type EventFormValues = z.infer<typeof eventFormSchema>

const form = useForm<EventFormValues>({
  resolver: zodResolver(eventFormSchema),
  mode: 'onChange'
})
```

---

## 🌍 Context API e Estado Global

### Hierarquia de Contexts

```
App
├── AuthProvider
│   └── Gerencia: user, isAuthenticated, login, logout, hasPermission
│
├── EventProvider
│   └── Gerencia: events[], addEvent, updateEvent, deleteEvent
│
├── ModalityProvider
│   └── Gerencia: modalities[], CRUD
│
├── ParticipantProvider
│   └── Gerencia: school, athletes[], technicians[], inscriptions[]
│
├── CommunicationProvider
│   └── Gerencia: notices[], bulletins[], results[], regulations[]
│
├── ThemeProvider
│   └── Gerencia: theme ('light' | 'dark'), toggleTheme
│
└── [Outros: TooltipProvider, Toaster, Sonner]
```

### Exemplo: AuthContext

```typescript
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'producer' | 'school_admin' | 'technician'
  permissions: string[]
  schoolId?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

// Uso em componentes
const { user, login, hasPermission } = useAuth()
```

### Persistência em localStorage

Cada context salva seu estado em localStorage com prefixo `ge_`:

```
ge_user                 // Usuário autenticado
ge_events               // Eventos
ge_event_modalities     // Associações evento-modalidade
ge_modalities           // Modalidades esportivas
ge_schools              // Escolas
ge_athletes             // Atletas
ge_technicians          // Técnicos
ge_inscriptions         // Inscrições
ge_comm_notices         // Avisos
ge_comm_bulletins       // Boletins
ge_comm_results         // Resultados
ge_comm_regulations     // Regulamentos
```

---

## 🎭 Componentes e Layouts

### Layouts Principais

#### 1. **DashboardLayout** (Produtor)
```
┌─────────────────────────────────────────┐
│        DashboardHeader                  │
├──────────────┬──────────────────────────┤
│              │                          │
│  Dashboard   │    <Outlet />            │
│  Sidebar     │  (Conteúdo dinâmico)    │
│              │                          │
│              ├──────────────────────────┤
│              │         Footer           │
└──────────────┴──────────────────────────┘
```

#### 2. **EventPanelLayout** (Evento específico)
```
┌─────────────────────────────────────────┐
│        DashboardHeader                  │
├──────────────┬──────────────────────────┤
│ EventPanel   │                          │
│ Sidebar      │    <Outlet />            │
│ (:eventId)   │  (Dashboard, Relatórios)|
│              ├──────────────────────────┤
│              │         Footer           │
└──────────────┴──────────────────────────┘
```

#### 3. **ParticipantLayout** (Participante/Escola)
```
┌─────────────────────────────────────────┐
│      ParticipantHeader                  │
├──────────────┬──────────────────────────┤
│ Participant  │                          │
│ Sidebar      │    <Outlet />            │
│              │  (Atletas, Técnicos)    │
│              ├──────────────────────────┤
│              │         Footer           │
└──────────────┴──────────────────────────┘
```

### Componentes Principais

#### DashboardHeader
- Exibe título dinâmico da página
- Menu mobile (hamburger)
- Avatar usuário com dropdown
- Atalhos rápidos

#### DashboardSidebar
- Navegação principal
- Menu de cadastro básico
- Menu de evento (quando em painel)
- Menu de configurações
- Branding/Logo

#### EventPanelSidebar
- Info do evento selecionado
- Menu específico do evento
- Links rápidos

---

## 🛣️ Sistema de Roteamento

### Estrutura de Rotas (React Router v6)

```
/                                    # Login (Raiz)
├── /evento/:slug/:id                # Página pública evento
├── /evento/:slug/:id/comunicacao    # Comunicação pública
│
├── /area-do-participante/
│   ├── login                        # Login participante
│   ├── cadastro                     # Registro escola
│   ├── imprimir/:eventId/:modalityId # Impressão ficha
│   │
│   └── /area-do-participante        # ProtectedRoute
│       ├── inicio                   # Dashboard
│       ├── escola                   # Perfil escola
│       ├── atletas                  # Lista atletas
│       ├── atletas/novo             # Novo atleta
│       ├── atletas/:id              # Editar atleta
│       ├── atletas/:id/inscricao    # Inscrição
│       ├── tecnicos                 # Lista técnicos
│       ├── tecnicos/novo            # Novo técnico
│       ├── tecnicos/:id             # Editar técnico
│       └── fichas                   # Fichas inscrição
│
└── /area-do-produtor                # ProtectedRoute
    ├── inicio                       # Dashboard home
    │
    ├── cadastro-basico/
    │   ├── evento                   # Lista eventos
    │   ├── evento/novo              # Event Wizard
    │   ├── evento/:id               # Editar evento
    │   ├── modalidades              # Lista modalidades
    │   ├── modalidades/:id          # Editar modalidade
    │   ├── identidade-visual        # Lista temas
    │   ├── identidade-visual/novo   # Novo tema
    │   ├── identidade-visual/:id    # Editar tema
    │   ├── usuarios                 # Lista usuários
    │   ├── usuarios/novo            # Novo usuário
    │   └── usuarios/:id             # Editar usuário
    │
    ├── configurar-evento/
    │   ├── modalidades
    │   ├── identidade-visual
    │   └── comunicacao
    │
    ├── evento/:eventId/             # Event Panel
    │   ├── dashboard
    │   ├── relatorios
    │   ├── escolas
    │   ├── atletas
    │   ├── modalidades
    │   ├── tema
    │   └── comunicacao
    │
    ├── relatorios                   # Relatórios globais
    ├── perfil                       # Perfil usuário
    └── configuracoes                # Configurações

├── /acesso-negado                   # 403
└── *                                # 404 NotFound
```

### ProtectedRoute Component

```tsx
<ProtectedRoute>
  <ParticipantLayout />
</ProtectedRoute>

// Verifica:
// 1. Se usuário está autenticado
// 2. Se tem permissão necessária
// 3. Se não, redireciona para /acesso-negado ou /
```

---

## 💾 Persistência de Dados

### localStorage Strategy

**Prefixo**: `ge_` (Gerador de Eventos)

**Estrutura**:
```javascript
// Usuário autenticado
localStorage.setItem('ge_user', JSON.stringify(user))

// Eventos com Date objects
localStorage.setItem('ge_events', JSON.stringify(
  events.map(e => ({...e, startDate: e.startDate.toISOString()}))
))

// Associações (simples)
localStorage.setItem('ge_event_modalities', JSON.stringify({
  'event-1': ['modality-1', 'modality-2'],
  'event-2': ['modality-3']
}))
```

### Tratamento de Datas

Como localStorage salva apenas strings, datas são convertidas:

```tsx
// Ao salvar
const event = { ...data, startDate: new Date('2025-12-15') }
localStorage.setItem('ge_events', JSON.stringify(event))

// Ao carregar
const loaded = JSON.parse(localStorage.getItem('ge_events'))
const restored = {
  ...loaded,
  startDate: new Date(loaded.startDate)
}
```

### Sincronização automática

Cada context mantém useEffect que:
1. Carrega dados ao montar
2. Salva dados em localStorage quando mudam

```tsx
useEffect(() => {
  localStorage.setItem('ge_events', JSON.stringify(events))
}, [events]) // Salva toda vez que events muda
```

---

## 🔄 Fluxo de Dados

### Exemplo: Criar Evento

```
1. User clica em "Novo Evento"
   ↓
2. Navegação para EventWizard (/cadastro-basico/evento/novo)
   ↓
3. EventForm renderiza
   ↓
4. User preenche dados
   ↓
5. Form valida com Zod schema
   ↓
6. User clica "Próximo"
   ↓
7. EventForm.onSubmit valida novamente
   ↓
8. Chama addEvent(data) do EventContext
   ↓
9. EventContext gera UUID e salva
   ↓
10. localStorage atualizado automaticamente (useEffect)
    ↓
11. Toast de sucesso
    ↓
12. Navega para Etapa 2 (Modalidades)
```

### Exemplo: Inscrever Atleta

```
1. Diretor acessa ParticipantHome
   ↓
2. Vê eventos abertos em tabela
   ↓
3. Clica em "Inscrever" ou vai para AthleteInscription
   ↓
4. Seleciona evento
   ↓
5. Seleciona modalidade
   ↓
6. Confirma inscrição
   ↓
7. Chama addInscription(data) do ParticipantContext
   ↓
8. ParticipantContext cria Inscription object
   ↓
9. localStorage atualizado
    ↓
10. Toast de sucesso
    ↓
11. Redireciona para fichas para impressão
```

---

## ✅ Boas Práticas

### Componentização

```tsx
// ✅ BOM: Componente pequeno e reutilizável
function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{event.description}</p>
      </CardContent>
    </Card>
  )
}

// ❌ EVITAR: Lógica complexa e difícil de testar
function EventCard({ event }: { event: Event }) {
  const [isOpen, setIsOpen] = useState(false)
  const { addEvent, updateEvent } = useEvent()
  const { user } = useAuth()
  // ... 200 linhas de JSX
}
```

### Uso de useMemo

```tsx
// ✅ Para cálculos custosos
const activeEvents = useMemo(() =>
  events.filter(e => e.status === 'published')
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
  [events]
)

// ❌ Não usar para dados simples
const someNumber = useMemo(() => 42, []) // Desnecessário
```

### Validação de Formulários

```tsx
// ✅ Sempre usar Zod + React Hook Form
const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6)
})

// ❌ Evitar validação manual
if (!email.includes('@')) return // Frágil e difícil manter
```

### Type Safety

```tsx
// ✅ Tipar tudo
const { events }: { events: Event[] } = useEvent()

// ❌ Usar any
const { events }: any = useEvent()
```

### Tratamento de Erros

```tsx
// ✅ Sempre usar try-catch e toast
try {
  await addEvent(data)
  toast.success("Evento criado!")
} catch (error) {
  toast.error("Erro ao criar evento")
  console.error(error)
}

// ❌ Ignorar erros
await addEvent(data) // Pode quebrar sem avisar
```

---

**Documento elaborado em**: Dezembro 2025  
**Próxima revisão**: Q1 2026
