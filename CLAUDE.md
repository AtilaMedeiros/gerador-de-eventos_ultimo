# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🎯 Project Overview

**Gerador de Eventos** is an event management system built with React that allows producers, schools, and participants to create, manage, and register for sporting events. The application supports event creation, athlete/technician management, real-time communication, and comprehensive reporting.

**Key Features:**
- Event creation and management (with wizard-based setup)
- Modalities (event categories) management
- Visual identity/theme customization
- Athlete and technician registration
- School-level participant management
- Dashboard with event-specific panels
- Real-time communication channels
- Role-based access control

---

## 🏗️ Architecture Overview

### Application Structure

The project follows a **Component-Based Architecture** with **Context API** for state management:

```
App (Router Root)
├── Auth Layer (AuthContext)
├── Global Providers
│   ├── EventProvider (event data & modalities)
│   ├── ModalityProvider (modality management)
│   ├── ThemeProvider (visual identity/theme)
│   ├── CommunicationProvider (notifications/messaging)
│   └── ParticipantProvider (athlete/technician data)
│
├── Layout Layers (3 main layouts)
│   ├── Layout (Producer/Admin Dashboard)
│   ├── EventPanelLayout (Event-specific management)
│   └── ParticipantLayout (School/Participant area)
│
└── Routes (Page Components)
    ├── /area-do-produtor (Protected admin routes)
    ├── /area-do-participante (Protected school routes)
    ├── /evento/:slug/:id (Public event page)
    └── /area-do-produtor/evento/:eventId (Event management)
```

### Data Flow Pattern

1. **Authentication** → AuthContext validates user session
2. **Global State** → 6 Context providers manage domain-specific state
3. **LocalStorage** → Data persisted to browser storage (key prefix: `ge_*`)
4. **Layouts** → Route-specific layouts provide UI structure
5. **Components** → Reusable Shadcn UI + custom components
6. **Forms** → React Hook Form + Zod validation

---

## 💻 Stack & Key Dependencies

### Core Framework
- **React 19.2** – Component framework with automatic batching
- **TypeScript 5.9** – Static typing (note: `strict: false` in tsconfig)
- **Vite (Rolldown 7.2.5)** – Build tool with HMR
- **React Router 6.30** – Client-side routing

### State Management & Forms
- **Context API** – 6 global contexts for state
- **React Hook Form 7.66** – Efficient form handling
- **Zod 3.25** – TypeScript-first schema validation

### UI & Styling
- **Shadcn UI** – Pre-built, accessible components (Radix UI based)
- **Tailwind CSS 3.4** – Utility-first styling
- **class-variance-authority** – CSS class variants
- **Lucide React 0.552** – SVG icons
- **Recharts 2.15** – Charts and data visualization

### Utilities
- **date-fns 4.1** – Date manipulation (careful: JS Date objects, not strings)
- **Sonner 2.0.7** – Toast notifications
- **Embla Carousel** – Responsive carousel component
- **input-otp** – OTP input component

### Code Quality
- **Oxlint 1.29** – Fast, production-ready linter
- **Prettier 3.6.2** – Code formatting
- **ESLint 9.39** – Static analysis

---

## 📁 Directory Structure

```
src/
├── main.tsx                          # React entry point
├── App.tsx                           # Route definitions & provider setup
├── main.css                          # Global styles (Tailwind directives)
│
├── contexts/                         # Global state management (6 contexts)
│   ├── AuthContext.tsx              # User authentication & permissions
│   ├── EventContext.tsx             # Event CRUD + modality associations
│   ├── ModalityContext.tsx          # Modality/category management
│   ├── ThemeContext.tsx             # Visual identity/theme state
│   ├── CommunicationContext.tsx     # Real-time notifications
│   └── ParticipantContext.tsx       # Athlete/technician data
│
├── components/
│   ├── ui/                          # Shadcn UI components (generated)
│   │   ├── button.tsx, input.tsx, etc.
│   │   └── [30+ pre-built components]
│   │
│   ├── Layout.tsx                   # Producer dashboard wrapper
│   ├── DashboardHeader.tsx          # Top navigation bar
│   ├── DashboardSidebar.tsx         # Navigation menu
│   ├── EventPanelLayout.tsx         # Event-specific wrapper
│   ├── EventPanelSidebar.tsx        # Event-scoped navigation
│   ├── ParticipantLayout.tsx        # School/participant wrapper
│   ├── ParticipantSidebar.tsx       # Participant navigation
│   ├── ProtectedRoute.tsx           # Auth guard wrapper
│   ├── EventPreview.tsx             # Event card preview component
│   ├── ThemePreview.tsx             # Visual identity preview
│   ├── FileUpload.tsx               # File upload utility
│   └── [custom feature components]
│
├── pages/
│   ├── Login.tsx                    # Public login page
│   ├── AccessDenied.tsx             # Permission denied page
│   ├── NotFound.tsx                 # 404 page
│   │
│   ├── dashboard/
│   │   ├── DashboardHome.tsx        # Producer home/dashboard
│   │   ├── Profile.tsx              # User profile settings
│   │   ├── Settings.tsx             # System settings
│   │   ├── Reports.tsx              # Global reports
│   │   │
│   │   ├── basic-registration/      # CRUD for core entities
│   │   │   ├── EventsList.tsx       # List events
│   │   │   ├── EventForm.tsx        # Create/edit event
│   │   │   ├── EventWizard.tsx      # Step-by-step event creation
│   │   │   ├── ModalitiesList.tsx   # List modalities
│   │   │   ├── ModalityForm.tsx     # Create/edit modality
│   │   │   ├── UsersList.tsx        # List system users
│   │   │   ├── UserForm.tsx         # Create/edit user
│   │   │   ├── VisualIdentityList.tsx
│   │   │   ├── VisualIdentityForm.tsx
│   │   │   ├── schemas.ts           # Zod validation schemas
│   │   │   └── components/          # Form sub-components
│   │   │
│   │   ├── event-config/            # Event-specific configuration
│   │   │   ├── AssociateModalities.tsx   # Link modalities to event
│   │   │   ├── ApplyVisualIdentity.tsx   # Apply theme to event
│   │   │   └── Communication.tsx         # Event messaging setup
│   │   │
│   │   ├── event-panel/             # Event dashboard (per-event)
│   │   │   ├── EventPanelDashboard.tsx
│   │   │   ├── EventSchools.tsx     # Schools in event
│   │   │   ├── EventAthletes.tsx    # Athletes in event
│   │   │   └── EventReports.tsx
│   │   │
│   │   └── [other admin pages]
│   │
│   ├── participant/                 # School/athlete area
│   │   ├── ParticipantLogin.tsx     # School login
│   │   ├── ParticipantRegister.tsx  # School registration
│   │   ├── ParticipantHome.tsx      # School home/dashboard
│   │   ├── SchoolProfile.tsx        # School info
│   │   ├── InscriptionForms.tsx     # List registration forms
│   │   ├── PrintableInscriptionForm.tsx
│   │   │
│   │   ├── athletes/
│   │   │   ├── AthletesList.tsx     # Manage athletes
│   │   │   ├── AthleteForm.tsx      # Add/edit athlete
│   │   │   └── AthleteInscription.tsx
│   │   │
│   │   └── technicians/
│   │       ├── TechniciansList.tsx  # Manage technicians
│   │       └── TechnicianForm.tsx   # Add/edit technician
│   │
│   └── public/
│       ├── EventPage.tsx            # Public event view
│       └── EventCommunicationPage.tsx
│
├── hooks/
│   ├── use-mobile.tsx               # Mobile breakpoint detection
│   └── use-toast.ts                 # Toast notification hook
│
└── lib/
    └── utils.ts                     # Utility functions (clsx/cn)
```

### Key Storage Keys (localStorage)
- `ge_user` – Authenticated user session
- `ge_events` – Event list (serialized with Date objects)
- `ge_event_modalities` – Event-modality associations
- `ge_modalities` – Modality definitions
- `ge_themes` – Visual identity/theme data
- `ge_communications` – Communication messages
- `ge_participants` – School/athlete/technician data

---

## 🚀 Development Commands

### Setup
```bash
npm install              # Install dependencies (uses pnpm workspace)
npm run dev              # Start dev server (http://localhost:8080)
```

### Code Quality
```bash
npm run lint             # Run Oxlint on src/
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
```

### Building
```bash
npm run build            # Optimize build for production (dist/)
npm run build:dev        # Build in development mode (sourcemaps)
npm run preview          # Preview production build locally
```

### Testing
```bash
npm test                 # Currently disabled (exit 0)
npm run test:watch       # Currently disabled (exit 0)
```

---

## 🔑 Context API Guide

### AuthContext
**Purpose**: User authentication, session management, role-based permissions

**Key Methods**:
- `login(email, password)` – Mock auth (dev: accepts any @email.com with password >= 6 chars)
- `logout()` – Clear session
- `hasPermission(permission)` – Check user permissions
- `isAuthenticated` – Boolean auth state

**Mock Users**:
- Email contains `admin` → Producer role
- Email contains `escola` → School admin role
- Email contains `tecnico` → Technician role
- Default → School admin

**Data Stored**: User object in `ge_user` (localStorage)

### EventContext
**Purpose**: Event CRUD operations and event-modality associations

**Key Methods**:
- `addEvent(eventData)` – Create with auto-generated UUID
- `updateEvent(id, eventData)` – Update fields
- `deleteEvent(id)` – Remove event
- `getEventById(id)` – Fetch single event
- `setEventModalities(eventId, modalityIds)` – Link modalities
- `getEventModalities(eventId)` – Get linked modalities

**Event Interface**:
```typescript
interface Event {
  id: string
  name: string
  startDate: Date          // JS Date object, NOT string
  endDate: Date
  location: string
  registrations: number
  capacity: number
  status: 'draft' | 'published' | 'closed'
  description?: string
  producerName?: string
  themeId?: string
  registrationCollectiveStart?: Date
  registrationCollectiveEnd?: Date
  registrationIndividualStart?: Date
  registrationIndividualEnd?: Date
  startTime?: string       // HH:MM format
  endTime?: string         // HH:MM format
}
```

**Important**: Date fields use `Date` objects. When serializing to localStorage, dates are stringified automatically. On restore, dates must be reconstructed with `new Date(dateString)`.

### ModalityContext
**Purpose**: Modality (event category) management

**Key Methods**:
- `addModality(modalityData)` – Create modality
- `updateModality(id, data)` – Update modality
- `deleteModality(id)` – Remove modality
- `getModalities()` – List all modalities

### ThemeContext
**Purpose**: Visual identity and theme customization

**Key Methods**:
- `setTheme(themeId)` – Apply theme to event
- `getTheme(themeId)` – Fetch theme data

### CommunicationContext
**Purpose**: Real-time communication/notifications

**Key Methods**:
- `sendMessage(eventId, message)` – Broadcast message
- `getMessages(eventId)` – Fetch event messages

### ParticipantContext
**Purpose**: Athlete and technician data for schools

**Key Methods**:
- `addAthlete(athlete)` – Register athlete
- `updateAthlete(id, data)` – Update athlete
- `getAthletes()` – List athletes

---

## 📐 Key Patterns & Best Practices

### Form Validation
- Use **Zod** schemas in `pages/dashboard/basic-registration/schemas.ts`
- Integrate with **React Hook Form** using `useForm<T>()` + `@hookform/resolvers`
- Example:
  ```typescript
  const schema = z.object({
    name: z.string().min(1, 'Nome obrigatório'),
    email: z.string().email('Email inválido'),
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  ```

### Date Handling
- Always use **Date objects** in state, never strings
- Use **date-fns** for formatting/parsing: `format(date, 'dd/MM/yyyy')`
- When storing to localStorage, JSON.stringify handles date→string conversion
- When restoring, explicitly convert: `new Date(jsonString.startDate)`

### Notifications
- **Success**: `toast.success('Mensagem')`  ← Uses Sonner
- **Error**: `toast.error('Erro')`
- **Info**: `toast.info('Info')`
- Contexts auto-trigger toasts on CRUD operations

### Component Composition
- Shadcn UI components are **unstyled primitives** (Radix UI wrapped with Tailwind)
- Customize via **className prop** with Tailwind utilities
- Use `cn()` helper (from `lib/utils.ts`) to merge class strings safely
- Example: `<Button className={cn('px-4', active && 'bg-blue-600')} />`

### Responsive Design
- Mobile-first approach with Tailwind breakpoints (sm, md, lg, xl, 2xl)
- Use `use-mobile` hook for detecting mobile screens
- Shadcn UI components have built-in responsive variants

### Protected Routes
- Wrap routes with `<ProtectedRoute>` component
- Automatically checks `isAuthenticated` from AuthContext
- Redirects unauthenticated users to login page

### localStorage Persistence
- Prefix all keys with `ge_` (event generator)
- Contexts handle read/write automatically in `useEffect`
- Data persists across page reloads
- JSON serialization handles most types (dates need special handling)

---

## 🔀 Routing & Navigation Structure

### Public Routes
- `/` → Login page
- `/evento/:slug/:id` → Public event page
- `/area-do-participante/login` → School login
- `/area-do-participante/cadastro` → School registration

### Protected Admin Routes (base: `/area-do-produtor`)
- `/inicio` → Dashboard home
- `/cadastro-basico/evento` → List events
- `/cadastro-basico/evento/novo` → Event wizard (step-by-step)
- `/cadastro-basico/evento/:id` → Edit event
- `/cadastro-basico/modalidades` → List/manage modalities
- `/cadastro-basico/identidade-visual` → List/manage themes
- `/cadastro-basico/usuarios` → List/manage users
- `/configurar-evento/modalidades` → Associate modalities to event
- `/configurar-evento/identidade-visual` → Apply theme to event
- `/configurar-evento/comunicacao` → Setup communication
- `/relatorios` → Global reports
- `/perfil` → User profile
- `/configuracoes` → System settings

### Protected Event-Specific Routes (base: `/area-do-produtor/evento/:eventId`)
- `/dashboard` → Event-specific dashboard
- `/atletas` → Athletes in event
- `/escolas` → Schools in event
- `/relatorios` → Event-specific reports
- `/modalidades` → Associate modalities (event-scoped)
- `/tema` → Apply theme (event-scoped)
- `/comunicacao` → Event communication

### Protected Participant Routes (base: `/area-do-participante`)
- `/inicio` → School/participant home
- `/escola` → School profile
- `/atletas` → List athletes
- `/atletas/novo` → Add athlete
- `/atletas/:id` → Edit athlete
- `/atletas/:id/inscricao` → Register athlete in event
- `/tecnicos` → List technicians
- `/tecnicos/novo` → Add technician
- `/fichas` → Registration forms

---

## 🎨 UI Components

### Shadcn UI Components Available
The project includes 30+ pre-built Shadcn UI components in `src/components/ui/`:

- **Inputs**: `button`, `input`, `select`, `textarea`, `checkbox`, `radio-group`, `toggle`, `switch`
- **Dialogs**: `dialog`, `alert-dialog`, `drawer`, `sheet`, `popover`
- **Navigation**: `tabs`, `accordion`, `navigation-menu`, `breadcrumb`, `pagination`
- **Display**: `card`, `label`, `badge`, `alert`, `separator`, `progress`, `scroll-area`
- **Forms**: `form`, `input-otp`
- **Data**: `chart`, `resizable`
- **Other**: `carousel`, `hover-card`, `tooltip`, `dropdown-menu`, `context-menu`

### Custom Components
- `EventPreview.tsx` – Event card/preview component
- `ThemePreview.tsx` – Theme/visual identity preview
- `FileUpload.tsx` – File upload utility

### Layout Components
- `DashboardHeader.tsx` – Producer dashboard header
- `DashboardSidebar.tsx` – Navigation menu
- `EventPanelSidebar.tsx` – Event-specific sidebar
- `ParticipantSidebar.tsx` – School sidebar

---

## ⚠️ Important Notes for Future Development

### TypeScript Configuration
- `strict: false` in `tsconfig.app.json` – Allows implicit `any` types
- Consider enabling `strict: true` for new code
- Use explicit types where possible for maintainability

### Mock Authentication
- Auth is **not production-ready** – Uses localStorage only
- Add real backend API integration when needed
- Current flow: email validation + localStorage session storage

### No Real Backend
- All data stored in localStorage (not persistent across devices)
- Add API endpoints to `/api` when integrating backend
- Context methods will need to call API instead of direct state updates

### Date Serialization
- **Critical**: When persisting Event objects with Date fields, ensure dates are reconstructed on restore
- JSON doesn't natively handle Date objects – they become strings
- See `EventContext.tsx` lines 105-131 for proper restoration pattern

### Event Wizard
- Located in `src/pages/dashboard/basic-registration/EventWizard.tsx`
- Step-by-step event creation with visual progress indicator
- Updates EventContext on completion

### Performance Considerations
- 6 contexts provide global state (consider extracting less-frequently-changed data)
- No memoization patterns currently in use
- For large datasets, consider implementing pagination/virtualization

---

## 🔍 Testing Strategy

- **Unit Tests**: Currently disabled (echo in package.json)
- **Integration Tests**: Manual testing via UI
- **E2E Tests**: Not set up
- **Future**: Consider adding Vitest/Jest + React Testing Library

---

## 📝 Code Style & Formatting

### Prettier Configuration (`.prettierrc`)
```json
{
  "semi": false,
  "singleQuote": true
}
```
- **No semicolons** at end of statements
- **Single quotes** for strings

### Oxlint Rules (`.oxlintrc.json`)
- Configured with opinionated defaults
- Run `npm run lint:fix` to auto-correct violations

### TypeScript Flags
- `strict: false` – Enables lenient type checking
- `noUnusedLocals: false` – Allows unused variables
- `noUnusedParameters: false` – Allows unused parameters
- `noImplicitAny: false` – Allows implicit any types

---

## 📚 Additional Resources

- **API Documentation**: `docs/API_CONTEXTS.md` – Detailed context method signatures
- **Component Guide**: `docs/COMPONENTS_GUIDE.md` – Shadcn UI usage
- **Architecture Details**: `docs/ARCHITECTURE.md` – Deep dive into design decisions
- **Setup Guide**: `docs/SETUP_DEVELOPMENT.md` – Environment setup
- **Product Requirements**: `docs/PRD.md` – Feature specifications
- **Main README**: `README.md` – Quick start guide

---

## 🚨 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Styles not appearing | Check Tailwind CSS paths in `tailwind.config.ts` (includes `src/**/*.{ts,tsx}`) |
| Date errors in forms | Ensure dates are `Date` objects, not strings (use `new Date()`) |
| Context undefined error | Verify component is wrapped by corresponding Provider in `App.tsx` |
| localStorage not persisting | Check `ge_` prefix in key names; browser storage may be cleared |
| Build fails with "Cannot find module" | Run `npm install` and check import paths (use `@/` alias) |
| Port 8080 in use | Change in `vite.config.ts` server config or kill existing process |

---

**Last Updated**: December 4, 2025
**Project Version**: 0.0.48
**Created for**: Claude Code AI Assistant
