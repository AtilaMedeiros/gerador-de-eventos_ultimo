# AI Agent Instructions - Gerador de Eventos

**Project**: Gerador de Eventos (Event Management System)  
**Framework**: React 19.2 + TypeScript 5.9 + Vite  
**Version**: 0.0.48

---

## 🏗️ Architecture Overview

This is a **Context API-driven React application** managing school sports events with dual authentication systems. The project uses **localStorage for all data persistence** (no backend) with mock data patterns.

### Critical Data Flow

1. **Authentication** → `AuthContext` → localStorage `ge_user`
2. **Event CRUD** → `EventContext` → localStorage `ge_events`, `ge_event_modalities`
3. **Participants** → `ParticipantContext` → localStorage `ge_schools`, `ge_athletes`, `ge_inscriptions`, `ge_technicians`
4. **Communication** → `CommunicationContext` → localStorage `ge_comm_*`
5. **Modalities** → `ModalityContext` → localStorage `ge_modalities`

**Key Pattern**: All contexts sync to localStorage automatically via `useEffect` hooks. On mount, contexts hydrate from localStorage.

### 7 Context Providers (Always Nested in This Order)

```tsx
<AuthProvider>           // Must be first (used by other contexts)
  <EventProvider>
    <ModalityProvider>
      <ThemeProvider>
        <CommunicationProvider>
          <ParticipantProvider>
            <TooltipProvider>
              {children}
```

**Location**: `src/contexts/` - Each context exports `useAuth()`, `useEvent()`, etc.

---

## 🗺️ Routing Structure

### Producer Dashboard Routes (Protected)
```
/area-do-produtor/
  ├── inicio                           # Dashboard home
  ├── cadastro-basico/
  │   ├── evento, evento/novo, evento/:id
  │   ├── evento/novo-wizard            # 3-step wizard
  │   ├── modalidades, modalidades/:id
  │   └── identidade-visual, usuarios
  ├── evento/:eventId/                  # Event-specific panel
  │   ├── inicio, escolas, atletas, relatorios
  └── {relatorios, perfil, config}
```

### Participant Routes (Dual Login)
```
/area-do-participante/
  ├── login, cadastro                  # Public
  ├── {inicio, atletas, tecnicos}      # Protected
  ├── inscricoes                       # Protected
  └── imprimir/:eventId/:modalityId    # Public
```

### Public Routes (No Auth)
```
/evento/:slug/:id                       # Public event page
/evento/:slug/:id/comunicacao           # Public communication
```

---

## 🔑 Authentication & Authorization

### User Roles
- **admin**: Full system access (mock: email includes "admin")
- **producer**: Create/manage events (default role)
- **school_admin**: Manage school, athletes, technicians (mock: email includes "escola")
- **technician**: View athletes only (mock: email includes "tecnico")

### Implementation
```tsx
const { user, hasPermission } = useAuth()
hasPermission('criar_evento')  // Returns boolean

// Protected Component
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**Location**: `src/components/ProtectedRoute.tsx` - Redirects to `/` if not authenticated

---

## 📦 Context APIs - Quick Reference

### EventContext
- **Key Methods**: `addEvent()`, `updateEvent()`, `deleteEvent()`, `getEventById()`
- **Key State**: `events`, `eventModalities`
- **localStorage**: `ge_events`, `ge_event_modalities`
- **Event Interface**: Has 12+ properties (name, dates, capacity, status, theme, slug, etc.)

### ParticipantContext
- **Key Methods**: `addSchool()`, `addAthlete()`, `addInscription()`, `addTechnician()`
- **Key State**: `schools`, `athletes`, `technicians`, `inscriptions`
- **localStorage**: `ge_schools`, `ge_athletes`, `ge_technicians`, `ge_inscriptions`
- **Critical**: Manages school-to-athlete-to-inscription relationships

### CommunicationContext
- **4 Types**: Notices (`avisos`), Bulletins (`boletins`), Results (`resultados`), Regulations (`regulamentos`)
- **Key Methods**: `addNotice()`, `addBulletin()`, `addResult()`, `addRegulation()`
- **localStorage**: `ge_comm_notices`, `ge_comm_bulletins`, `ge_comm_results`, `ge_comm_regulations`

### ModalityContext
- **Key Methods**: `addModality()`, `updateModality()`, `deleteModality()`
- **Key State**: `modalities`
- **localStorage**: `ge_modalities`
- **Properties**: min/max athletes, age ranges, gender categories

**Full API Docs**: See `/docs/API_CONTEXTS.md`

---

## 🎨 Component Patterns

### Shadcn UI Components (~50)
Import from `@/components/ui/`: `Button`, `Card`, `Dialog`, `Form`, `Input`, `Select`, `Table`, `Tabs`, `Badge`, `Toast`, `Alert`, `Accordion`, `Skeleton`, etc.

**Form Pattern** (Very Common)
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { eventFormSchema, type EventFormValues } from './schemas'

const form = useForm<EventFormValues>({
  resolver: zodResolver(eventFormSchema),
  mode: 'all',
  defaultValues: { /* ... */ }
})

const onSubmit = (data: EventFormValues) => { /* ... */ }

return <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form></Form>
```

**Location**: `src/pages/dashboard/basic-registration/schemas.ts` contains all Zod schemas

### Layout Components
- **Dashboard**: Sidebar + Header + Content (src/components/Layout.tsx)
- **EventPanel**: Event-specific layout for producers
- **Participant**: Participant area layout

### Custom Components (Project-Specific)
- `ProtectedRoute`: Authentication wrapper
- `EventPreview`: Event card preview
- `DashboardHeader`, `DashboardSidebar`: Main navigation
- `FileUpload`: Image/file upload component
- `ThemePreview`: Visual theme preview

---

## 💾 localStorage Pattern (Critical)

**All data is persisted with `ge_` prefix:**
```tsx
// Save
localStorage.setItem('ge_events', JSON.stringify(eventsArray))

// Load (in context useEffect)
const stored = localStorage.getItem('ge_events')
if (stored) { events = JSON.parse(stored) }

// Clear
localStorage.removeItem('ge_user')
localStorage.clear()
```

**Data Serialization**: `Date` objects are automatically stringified; parse them back when needed.

---

## 🛠️ Build & Development

### Scripts
```bash
npm run dev              # Start Vite dev server (localhost:8080)
npm run build            # Production build → dist/
npm run lint             # Oxlint checks
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier formatting
```

### Development Server
- **Port**: 8080 (IPv4 & IPv6)
- **HMR**: Hot Module Replacement enabled
- **TypeScript**: Strict mode (`@/*` alias to `src/*`)

### Build Output
- **Mode**: Minified for production (sourcemaps in dev)
- **Directory**: `dist/` folder

---

## 📋 Project-Specific Conventions

### File Organization
- **`/src/components/ui/`**: Shadcn UI components (read-only, regenerated)
- **`/src/components/`**: Custom project components
- **`/src/pages/`**: Page components organized by section
- **`/src/contexts/`**: Global state (7 contexts)
- **`/src/hooks/`**: Custom hooks (`use-mobile.tsx`, `use-toast.ts`)
- **`/src/lib/utils.ts`**: Utility functions (cn() for classnames)

### Naming Conventions
- **Components**: PascalCase (EventForm.tsx)
- **Utils/Hooks**: camelCase (useAuth, utils.ts)
- **localStorage Keys**: `ge_` prefix + snake_case (ge_user, ge_events)
- **Routes**: kebab-case (/area-do-produtor, /cadastro-basico)
- **Portuguese**: Code comments and data labels; English: component names

### Event Wizard Pattern
Three-step form with state tracking:
```tsx
const [currentStep, setCurrentStep] = useState(1)
const [eventId, setEventId] = useState<string | undefined>()

// Step 1: EventForm creates event, returns ID
// Step 2: AssociateModalities uses eventId
// Step 3: ApplyVisualIdentity finalizes
```
**Location**: `src/pages/dashboard/basic-registration/EventWizard.tsx`

### Multi-Tab Interfaces
Communication interface uses Tabs component for 4 sections:
```tsx
<Tabs defaultValue="avisos">
  <TabsList>
    <TabsTrigger value="avisos">Avisos</TabsTrigger>
    {/* ... */}
  </TabsList>
</Tabs>
```
**Location**: `src/pages/dashboard/event-config/Communication.tsx`

---

## ⚠️ Common Pitfalls

1. **Forgetting localStorage sync**: Always use `useEffect` to persist context changes
2. **Not nesting providers correctly**: AuthProvider must wrap others
3. **Props drilling**: Use context instead of passing through multiple components
4. **Missing Zod schemas**: All forms have schemas in `schemas.ts` file in same directory
5. **Not checking `isLoading`**: AuthContext loads async; verify before rendering protected content

---

## 🚀 Typical Development Tasks

### Add New Event Property
1. Update Event interface in `EventContext.tsx`
2. Add Zod field to `eventFormSchema` in `EventForm/schemas.ts`
3. Add form field component in `EventForm.tsx`
4. Update localStorage structure if needed

### Add New User Role
1. Extend `User` type in `AuthContext.tsx`
2. Add mock login logic
3. Add permission checks with `hasPermission()`
4. Create/update protected routes

### Add Communication Type
1. Add type to `CommunicationContext.tsx`
2. Add methods: `add{Type}()`, `update{Type}()`, `delete{Type}()`
3. Add localStorage key `ge_comm_{type}`
4. Add Tab in `Communication.tsx` page

---

## 📚 Documentation

Comprehensive docs in `/docs`:
- **PRD.md**: Product requirements & features
- **ARCHITECTURE.md**: Design patterns & decisions
- **API_CONTEXTS.md**: Complete API reference
- **SETUP_DEVELOPMENT.md**: Developer setup guide
- **COMPONENTS_GUIDE.md**: UI patterns & accessibility

---

## 🔗 Key Files at a Glance

| File | Purpose |
|------|---------|
| `src/App.tsx` | Router & provider nesting |
| `src/contexts/AuthContext.tsx` | Authentication & roles |
| `src/components/ProtectedRoute.tsx` | Auth guards |
| `src/lib/utils.ts` | Utilities (cn, formatters) |
| `vite.config.ts` | Build config (port 8080, alias @) |
| `tsconfig.json` | TypeScript config (strict mode) |

---

## 📌 Questions? Check These First

- **"How do I access user data?"** → `const { user } = useAuth()`
- **"How do I modify events?"** → Use `EventContext` methods
- **"How do I persist data?"** → localStorage sync in context useEffect
- **"How do I add a form?"** → Copy pattern from EventForm.tsx + create Zod schema
- **"How do I create a page?"** → Add route in App.tsx, wrap with `<ProtectedRoute>` if needed
