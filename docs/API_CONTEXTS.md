# Documentação de API - Contextos e Hooks

**Versão**: 0.0.48  
**Data**: Dezembro 2025

---

## 📋 Índice

1. [AuthContext](#authcontext)
2. [EventContext](#eventcontext)
3. [ModalityContext](#modalitycontext)
4. [ParticipantContext](#participantcontext)
5. [CommunicationContext](#communicationcontext)
6. [ThemeContext](#themecontext)
7. [Hooks Customizados](#hooks-customizados)

---

## 🔐 AuthContext

**Localização**: `src/contexts/AuthContext.tsx`

Gerencia autenticação, sessão de usuário e permissões do sistema.

### Interface

```typescript
export interface User {
  id: string                                    // UUID
  name: string                                  // Nome completo
  email: string                                 // Email único
  role: 'admin' | 'producer' | 'school_admin' | 'technician'
  permissions: string[]                         // Lista de permissões
  schoolId?: string                             // Link opcional para escola
}

interface AuthContextType {
  user: User | null                             // Usuário autenticado ou null
  isAuthenticated: boolean                      // true se user não é null
  isLoading: boolean                            // true enquanto carrega sessão
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}
```

### Roles e Permissões

```
┌─────────────┬──────────────────────────────────┐
│ Role        │ Permissões                       │
├─────────────┼──────────────────────────────────┤
│ admin       │ TODAS (acesso total)             │
│ producer    │ criar_evento, editar_evento,     │
│             │ ver_relatorios                   │
│ school_admin│ gerir_escola, gerir_atletas,     │
│             │ gerir_tecnicos                   │
│ technician  │ ver_atletas                      │
└─────────────┴──────────────────────────────────┘
```

### Métodos

#### `login(email: string, password: string): Promise<boolean>`

Autentica usuário com email e senha.

**Parâmetros**:
- `email`: Endereço de email do usuário
- `password`: Senha (mínimo 6 caracteres)

**Retorna**: `true` se autenticado, `false` se erro

**Validações**:
- Email deve conter `@`
- Senha mínimo 6 caracteres
- Não deve ser `password === 'error'` (teste)

**Exemplo**:
```tsx
const { login } = useAuth()

const handleLogin = async (email: string, password: string) => {
  try {
    const success = await login(email, password)
    if (success) {
      navigate('/area-do-produtor/inicio')
    } else {
      toast.error('Credenciais inválidas')
    }
  } catch (error) {
    toast.error('Erro ao fazer login')
  }
}
```

#### `logout(): void`

Faz logout do usuário atual.

**Efeitos colaterais**:
- Remove `ge_user` de localStorage
- Limpa sessão
- Mostra toast de confirmação
- Redireciona para `/` (implícito via ProtectedRoute)

**Exemplo**:
```tsx
const { logout } = useAuth()

const handleLogout = () => {
  logout() // Toast automático: "Você saiu do sistema"
}
```

#### `hasPermission(permission: string): boolean`

Verifica se usuário possui permissão específica.

**Parâmetro**:
- `permission`: String da permissão (ex: 'criar_evento')

**Retorna**: `true` se tem permissão, `false` caso contrário

**Lógica**:
- Se role é `admin`, retorna sempre `true`
- Se role é `school_admin` e permission começa com `gerir_`, retorna `true`
- Senão, verifica array `permissions`

**Exemplo**:
```tsx
const { hasPermission } = useAuth()

if (!hasPermission('criar_evento')) {
  return <AccessDenied />
}

return <EventForm />
```

### Uso em Componentes

```tsx
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }
  
  return (
    <div>
      <h1>Bem-vindo, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Sair</button>
    </div>
  )
}
```

---

## 📅 EventContext

**Localização**: `src/contexts/EventContext.tsx`

Gerencia eventos, CRUD e associações com modalidades.

### Interface

```typescript
export interface Event {
  id: string                              // UUID
  name: string                            // Nome do evento
  description?: string                    // Descrição
  startDate: Date                         // Data início
  endDate: Date                           // Data fim
  startTime?: string                      // Hora início (HH:MM)
  endTime?: string                        // Hora fim (HH:MM)
  location: string                        // Local
  registrations: number                   // Total inscrições
  capacity: number                        // Capacidade máxima
  status: 'draft' | 'published' | 'closed' | 'archived'
  
  producerName?: string                   // Produtor
  producerDescription?: string            // Descrição produtor
  themeId?: string                        // ID do tema
  
  registrationCollectiveStart?: Date      // Início inscrição coletiva
  registrationCollectiveEnd?: Date        // Fim inscrição coletiva
  registrationIndividualStart?: Date      // Início inscrição individual
  registrationIndividualEnd?: Date        // Fim inscrição individual
}

interface EventContextType {
  events: Event[]
  addEvent: (event: Omit<Event, 'id'>) => Event
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  getEventById: (id: string) => Event | undefined
  getEventModalities: (eventId: string) => string[]
  setEventModalities: (eventId: string, modalityIds: string[]) => void
}
```

### Métodos

#### `addEvent(eventData): Event`

Cria novo evento com UUID automático.

**Parâmetro**:
```typescript
eventData: Omit<Event, 'id'>  // Todos os campos exceto ID
```

**Retorna**: Novo objeto `Event` com ID gerado

**Efeitos**:
- Gera UUID via `crypto.randomUUID()`
- Salva em localStorage (`ge_events`)
- Toast: "Evento criado com sucesso!"

**Exemplo**:
```tsx
const { addEvent } = useEvent()

const newEvent = addEvent({
  name: 'Maratona 2025',
  startDate: new Date('2025-12-15'),
  endDate: new Date('2025-12-16'),
  location: 'Parque Central',
  registrations: 0,
  capacity: 500,
  status: 'draft'
})

console.log(newEvent.id) // "550e8400-e29b-41d4-a716-446655440000"
```

#### `updateEvent(id: string, eventData: Partial<Event>): void`

Atualiza evento existente.

**Parâmetros**:
- `id`: UUID do evento
- `eventData`: Campos a atualizar (pode ser parcial)

**Efeitos**:
- Merge dos campos existentes com novos
- Salva em localStorage
- Toast: "Evento atualizado com sucesso!"

**Exemplo**:
```tsx
const { updateEvent } = useEvent()

updateEvent('event-123', {
  status: 'published',
  registrations: 150
})
```

#### `deleteEvent(id: string): void`

Remove evento do sistema.

**Parâmetro**:
- `id`: UUID do evento

**Efeitos**:
- Remove de array events
- Salva em localStorage
- Toast: "Evento excluído com sucesso!"

**Exemplo**:
```tsx
const { deleteEvent } = useEvent()

deleteEvent('event-123')
```

#### `getEventById(id: string): Event | undefined`

Busca evento por ID.

**Retorna**: Objeto `Event` ou `undefined` se não encontrado

**Exemplo**:
```tsx
const { getEventById } = useEvent()

const event = getEventById('event-123')
if (event) {
  console.log(event.name)
}
```

#### `getEventModalities(eventId: string): string[]`

Lista modalidades associadas ao evento.

**Retorna**: Array de IDs de modalidades

**Exemplo**:
```tsx
const { getEventModalities } = useEvent()

const modalityIds = getEventModalities('event-123')
// ['modality-1', 'modality-2', 'modality-3']
```

#### `setEventModalities(eventId: string, modalityIds: string[]): void`

Associa modalidades a um evento.

**Parâmetros**:
- `eventId`: UUID do evento
- `modalityIds`: Array de IDs de modalidades

**Efeitos**:
- Salva associação em localStorage (`ge_event_modalities`)

**Exemplo**:
```tsx
const { setEventModalities } = useEvent()

setEventModalities('event-123', ['modality-1', 'modality-3'])
```

### Uso em Componentes

```tsx
import { useEvent } from '@/contexts/EventContext'

export default function EventsList() {
  const { events, deleteEvent } = useEvent()
  
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <button onClick={() => deleteEvent(event.id)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 🏆 ModalityContext

**Localização**: `src/contexts/ModalityContext.tsx`

Gerencia modalidades esportivas e suas configurações.

### Interface

```typescript
export interface Modality {
  id: string                              // UUID
  name: string                            // Nome (Futsal, Natação)
  type: 'coletiva' | 'individual'         // Tipo
  gender: 'feminino' | 'masculino' | 'misto'
  eventCategory?: string                  // Categoria específica
  
  minAthletes: number                     // Mínimo atletas
  maxAthletes: number                     // Máximo atletas
  maxEventsPerAthlete: number             // Máx eventos por atleta
  maxTeams: number                        // Máximo times
  minAge: number                          // Idade mínima
  maxAge: number                          // Idade máxima
}

interface ModalityContextType {
  modalities: Modality[]
  addModality: (modality: Omit<Modality, 'id'>) => void
  updateModality: (id: string, modality: Partial<Modality>) => void
  deleteModality: (id: string) => void
  getModalityById: (id: string) => Modality | undefined
}
```

### Métodos

#### `addModality(modalityData): void`

Cria nova modalidade esportiva.

**Exemplo**:
```tsx
const { addModality } = useModality()

addModality({
  name: 'Futsal Feminino',
  type: 'coletiva',
  gender: 'feminino',
  minAthletes: 5,
  maxAthletes: 12,
  maxEventsPerAthlete: 1,
  maxTeams: 16,
  minAge: 14,
  maxAge: 17
})
```

#### `updateModality(id: string, modalityData): void`

Atualiza modalidade existente.

#### `deleteModality(id: string): void`

Remove modalidade.

#### `getModalityById(id: string): Modality | undefined`

Busca modalidade por ID.

---

## 👥 ParticipantContext

**Localização**: `src/contexts/ParticipantContext.tsx`

Gerencia escolas, atletas, técnicos e inscrições de participantes.

### Interfaces

```typescript
export interface School {
  id: string
  name: string                            // Nome escola
  inep: string                            // Código INEP
  cnpj: string                            // CNPJ
  municipality: string                    // Município
  address: string                         // Endereço
  neighborhood: string                    // Bairro
  cep: string                             // CEP
  type: 'Publica' | 'Privada'
  sphere: 'Municipal' | 'Estadual' | 'Federal'
  directorName: string                    // Diretor
  landline: string                        // Telefone fixo
  mobile: string                          // Celular
  email: string
}

export interface Athlete {
  id: string
  schoolId: string                        // Link para escola
  name: string
  sex: 'Feminino' | 'Masculino'
  dob: Date                               // Data nascimento
  rg: string
  cpf: string
  nis?: string                            // NIS
  motherName: string                      // Nome da mãe
  motherCpf: string
}

export interface Technician {
  id: string
  schoolId: string
  name: string
  sex: 'Feminino' | 'Masculino'
  dob: Date
  cpf: string
  cref: string                            // Credencial de desportista
  email: string
  phone: string
  uniformSize: string                     // PP, P, M, G, GG
}

export interface Inscription {
  id: string
  schoolId: string
  athleteId: string
  eventId: string
  modalityId: string
  categoryId?: string
  status: 'Pendente' | 'Confirmada'
}

interface ParticipantContextType {
  school: School | null
  updateSchool: (data: Partial<School>) => void
  
  athletes: Athlete[]
  addAthlete: (data: Omit<Athlete, 'id' | 'schoolId'>) => void
  updateAthlete: (id: string, data: Partial<Athlete>) => void
  deleteAthlete: (id: string) => void
  
  technicians: Technician[]
  addTechnician: (data: Omit<Technician, 'id' | 'schoolId'>) => void
  updateTechnician: (id: string, data: Partial<Technician>) => void
  deleteTechnician: (id: string) => void
  
  inscriptions: Inscription[]
  addInscription: (data: Omit<Inscription, 'id' | 'schoolId' | 'status'>) => void
  deleteInscription: (id: string) => void
}
```

### Principais Métodos

#### Gerenciamento de Atletas

```tsx
const { athletes, addAthlete, updateAthlete, deleteAthlete } = useParticipant()

// Adicionar atleta
addAthlete({
  name: 'João Silva',
  sex: 'Masculino',
  dob: new Date('2008-05-15'),
  rg: '123456789',
  cpf: '123.456.789-00',
  motherName: 'Maria Silva',
  motherCpf: '987.654.321-00'
})

// Atualizar
updateAthlete('athlete-1', { name: 'João Pedro Silva' })

// Deletar
deleteAthlete('athlete-1')
```

#### Gerenciamento de Inscrições

```tsx
const { inscriptions, addInscription } = useParticipant()

// Inscrever atleta em evento/modalidade
addInscription({
  athleteId: 'athlete-1',
  eventId: 'event-1',
  modalityId: 'modality-1'
})
// Status padrão: 'Pendente'
```

---

## 📢 CommunicationContext

**Localização**: `src/contexts/CommunicationContext.tsx`

Gerencia avisos, boletins, resultados e regulamentos de eventos.

### Interfaces

```typescript
export interface Notice {
  id: string
  eventId: string
  title: string
  category: string
  description: string
  date: Date
  time: string                            // HH:MM
  author: string
  createdAt: Date
}

export interface Bulletin {
  id: string
  eventId: string
  title: string
  category: string
  description: string
  date: Date
  time: string
  author: string
  fileName: string                        // Nome arquivo
  createdAt: Date
}

export interface Result {
  id: string
  eventId: string
  categoryName: string
  champion: string
}

export interface Regulation {
  id: string
  eventId: string
  title: string
  category: string
  description: string
  date: Date
  time: string
  author: string
  fileName: string
  createdAt: Date
}

interface CommunicationContextType {
  notices: Notice[]
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void
  deleteNotice: (id: string) => void
  
  bulletins: Bulletin[]
  addBulletin: (bulletin: Omit<Bulletin, 'id' | 'createdAt'>) => void
  deleteBulletin: (id: string) => void
  
  results: Result[]
  addResult: (result: Omit<Result, 'id'>) => void
  updateResult: (id: string, result: Partial<Result>) => void
  deleteResult: (id: string) => void
  
  regulations: Regulation[]
  addRegulation: (regulation: Omit<Regulation, 'id' | 'createdAt'>) => void
  deleteRegulation: (id: string) => void
}
```

### Métodos

```tsx
const { 
  notices, addNotice, deleteNotice,
  bulletins, addBulletin, deleteBulletin,
  results, addResult, updateResult, deleteResult,
  regulations, addRegulation, deleteRegulation
} = useCommunication()

// Avisos
addNotice({
  eventId: 'event-1',
  title: 'Mudança de horário',
  category: 'Importante',
  description: 'O evento foi adiado...',
  date: new Date(),
  time: '14:30',
  author: 'João Admin'
})

// Boletins (downloads)
addBulletin({
  eventId: 'event-1',
  title: 'Regulamento Oficial',
  category: 'Documentos',
  description: 'Regulamento completo...',
  date: new Date(),
  time: '10:00',
  author: 'Maria',
  fileName: 'regulamento.pdf'
})

// Resultados
addResult({
  eventId: 'event-1',
  categoryName: 'Futsal Masculino',
  champion: 'Escola A'
})

// Regulamentos
addRegulation({
  eventId: 'event-1',
  title: 'Regulamento Geral',
  category: 'Regras',
  description: '...',
  date: new Date(),
  time: '09:00',
  author: 'Admin',
  fileName: 'regras.pdf'
})
```

---

## 🎨 ThemeContext

**Localização**: `src/contexts/ThemeContext.tsx`

Gerencia tema visual (light/dark mode).

### Interface

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
```

### Uso

```tsx
const { theme, toggleTheme } = useTheme()

return (
  <button onClick={toggleTheme}>
    Modo {theme === 'light' ? 'escuro' : 'claro'}
  </button>
)
```

---

## 🎣 Hooks Customizados

### useAuth()

Hook para acessar contexto de autenticação.

```tsx
const { user, isAuthenticated, isLoading, login, logout, hasPermission } = useAuth()
```

### useEvent()

Hook para acessar contexto de eventos.

```tsx
const { events, addEvent, updateEvent, deleteEvent, getEventById } = useEvent()
```

### useModality()

Hook para acessar contexto de modalidades.

```tsx
const { modalities, addModality, updateModality, deleteModality } = useModality()
```

### useParticipant()

Hook para acessar contexto de participantes.

```tsx
const { school, athletes, technicians, inscriptions, addAthlete, addInscription } = useParticipant()
```

### useCommunication()

Hook para acessar contexto de comunicação.

```tsx
const { notices, bulletins, results, regulations, addNotice, addBulletin } = useCommunication()
```

### useTheme()

Hook para acessar contexto de tema.

```tsx
const { theme, toggleTheme } = useTheme()
```

### useMobile()

Hook customizado para detectar viewport mobile.

```tsx
import { useIsMobile } from '@/hooks/use-mobile'

const isMobile = useIsMobile()

if (isMobile) {
  return <MobileLayout />
}
```

**Breakpoint**: < 768px (Tailwind md)

---

## ⚡ Padrões de Uso

### Usar múltiplos contextos

```tsx
export default function EventDashboard() {
  const { user } = useAuth()
  const { events } = useEvent()
  const { modalities } = useModality()
  const { notices } = useCommunication()
  
  return (
    // Combina dados de vários contextos
  )
}
```

### Filtrar dados com useMemo

```tsx
import { useMemo } from 'react'
import { useEvent } from '@/contexts/EventContext'

export default function PublishedEventsList() {
  const { events } = useEvent()
  
  const published = useMemo(() =>
    events.filter(e => e.status === 'published'),
    [events]
  )
  
  return (
    // Usa published
  )
}
```

### Validar permissões antes de renderizar

```tsx
const { hasPermission } = useAuth()

if (!hasPermission('criar_evento')) {
  return <AccessDenied />
}

return <EventWizard />
```

---

**Documento elaborado em**: Dezembro 2025  
**Próxima revisão**: Q1 2026
