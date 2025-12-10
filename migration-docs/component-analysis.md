# Análise de Componentes: Client vs Server Components

## Objetivo

Identificar quais componentes podem ser Server Components (renderizados no servidor) e quais precisam ser Client Components (marcados com `'use client'`) na migração para Next.js.

---

## Classificação

### ✅ Server Component
- Pode rodar no servidor
- Não usa hooks de estado (useState, useEffect, useContext, etc)
- Não usa event handlers (onClick, onChange, etc)
- Não usa Web APIs (localStorage, window, document)
- Pode fazer fetch de dados diretamente

### 🔴 Client Component
- Precisa de `'use client'` no topo do arquivo
- Usa hooks de React (useState, useEffect, useContext, useReducer, etc)
- Usa event handlers
- Usa Web APIs do browser
- Usa bibliotecas client-only

---

## 1. Contexts (todos 🔴 Client)

Todos os arquivos em `src/contexts/` precisam ser Client Components.

| Arquivo | Tipo | Motivo | Ação |
|---------|------|--------|------|
| `AuthContext.tsx` | 🔴 Client | useState, useEffect, localStorage | Adicionar `'use client'` |
| `EventContext.tsx` | 🔴 Client | useState, useEffect, localStorage | Adicionar `'use client'` |
| `ModalityContext.tsx` | 🔴 Client | useState, useEffect, localStorage | Adicionar `'use client'` |
| `ThemeContext.tsx` | 🔴 Client | useState, useEffect, localStorage | Adicionar `'use client'` |
| `CommunicationContext.tsx` | 🔴 Client | useState, useEffect, localStorage | Adicionar `'use client'` |
| `ParticipantContext.tsx` | 🔴 Client | useState, useEffect, localStorage | Adicionar `'use client'` |

---

## 2. Páginas Públicas

| Arquivo | Caminho Atual | Tipo | Motivo | Ação |
|---------|--------------|------|--------|------|
| `Login.tsx` | `src/pages/Login.tsx` | 🔴 Client | useForm, useNavigate, useAuth | `'use client'` |
| `EventPage.tsx` | `src/pages/public/EventPage.tsx` | 🔴 Client | useParams, useEvent, useState | `'use client'` |
| `EventCommunicationPage.tsx` | `src/pages/public/EventCommunicationPage.tsx` | 🔴 Client | useParams, useCommunication | `'use client'` |
| `EventRegulationsPage.tsx` | `src/pages/public/EventRegulationsPage.tsx` | 🔴 Client | useParams, useEvent, useState | `'use client'` |
| `ParticipantLogin.tsx` | `src/pages/participant/ParticipantLogin.tsx` | 🔴 Client | useForm, useAuth, useNavigate | `'use client'` |
| `ParticipantRegister.tsx` | `src/pages/participant/ParticipantRegister.tsx` | 🔴 Client | useForm, useAuth, useState | `'use client'` |
| `AccessDenied.tsx` | `src/pages/AccessDenied.tsx` | 🔴 Client | useNavigate | `'use client'` |
| `NotFound.tsx` | `src/pages/NotFound.tsx` | ✅ Server | Apenas exibe conteúdo | Pode ser Server |

> **Otimização Futura**: Algumas páginas públicas poderiam ser refatoradas para Server Components buscando dados do servidor, mas inicialmente manteremos tudo Client para facilitar migração.

---

## 3. Páginas da Área do Participante

| Arquivo | Tipo | Motivo Principal | Ação |
|---------|------|-----------------|------|
| `ParticipantHome.tsx` | 🔴 Client | useAuth, useEvent, useState | `'use client'` |
| `SchoolProfile.tsx` | 🔴 Client | useForm, useParticipant | `'use client'` |
| `AthletesList.tsx` | 🔴 Client | useParticipant, useState | `'use client'` |
| `AthleteForm.tsx` | 🔴 Client | useForm, useParams | `'use client'` |
| `AthleteInscription.tsx` | 🔴 Client | useForm, useModality | `'use client'` |
| `TechniciansList.tsx` | 🔴 Client | useParticipant, useState | `'use client'` |
| `TechnicianForm.tsx` | 🔴 Client | useForm, useState | `'use client'` |
| `TechnicianInscription.tsx` | 🔴 Client | useForm, useState | `'use client'` |
| `InscriptionForms.tsx` | 🔴 Client | useParticipant, useState | `'use client'` |
| `PrintableInscriptionForm.tsx` | 🔴 Client | useParams, useEffect | `'use client'` |

---

## 4. Páginas da Área do Produtor

### 4.1 Principais

| Arquivo | Tipo | Motivo | Ação |
|---------|------|--------|------|
| `DashboardHome.tsx` | 🔴 Client | useAuth, useEvent, useState | `'use client'` |
| `Profile.tsx` | 🔴 Client | useForm, useAuth | `'use client'` |
| `Settings.tsx` | 🔴 Client | useForm, useState | `'use client'` |
| `Reports.tsx` | 🔴 Client | useEvent, useState, jspdf | `'use client'` |

### 4.2 Cadastro Básico

| Arquivo | Tipo | Motivo | Ação |
|---------|------|--------|------|
| `EventsList.tsx` | 🔴 Client | useEvent, useNavigate | `'use client'` |
| `EventForm.tsx` | 🔴 Client | useForm, Tiptap | `'use client'` |
| `EventWizard.tsx` | 🔴 Client | useState, useNavigate | `'use client'` |
| `ModalitiesList.tsx` | 🔴 Client | useModality, useState | `'use client'` |
| `ModalityForm.tsx` | 🔴 Client | useForm, useState | `'use client'` |
| `VisualIdentityForm.tsx` | 🔴 Client | useForm, useState | `'use client'` |
| `UsersList.tsx` | 🔴 Client | useState, localStorage | `'use client'` |
| `UserForm.tsx` | 🔴 Client | useForm, useState | `'use client'` |
| `SchoolsList.tsx` | 🔴 Client | useState, useParticipant | `'use client'` |
| `SchoolForm.tsx` | 🔴 Client | useForm, useState | `'use client'` |
| `AthletesList.tsx` | 🔴 Client | useParticipant, useState | `'use client'` |
| `AthleteForm.tsx` | 🔴 Client | useForm, useState | `'use client'` |
| `AthleteModalities.tsx` | 🔴 Client | useParams, useState | `'use client'` |

### 4.3 Configuração de Evento

| Arquivo | Tipo | Motivo | Ação |
|---------|------|--------|------|
| `AssociateModalities.tsx` | 🔴 Client | useEvent, useState | `'use client'` |
| `ApplyVisualIdentity.tsx` | 🔴 Client | useEvent, useState | `'use client'` |
| `Communication.tsx` | 🔴 Client | useState, useNavigate | `'use client'` |
| `CommunicationContent.tsx` | 🔴 Client | useCommunication, useState | `'use client'` |
| `EventCommunication.tsx` | 🔴 Client | useParams, useState | `'use client'` |
| `EventProducers.tsx` | 🔴 Client | useForm, useState | `'use client'` |

### 4.4 Painel do Evento

| Arquivo | Tipo | Motivo | Ação |
|---------|------|--------|------|
| `EventPanelDashboard.tsx` | 🔴 Client | useParams, useEvent | `'use client'` |

---

## 5. Componentes UI (shadcn-ui)

Todos os componentes em `src/components/ui/` são Client Components pois usam Radix UI (client-only).

**Lista completa** (todos 🔴 Client):
- `accordion.tsx`
- `alert-dialog.tsx`
- `aspect-ratio.tsx`
- `avatar.tsx`
- `button.tsx`
- `card.tsx`
- `checkbox.tsx`
- `collapsible.tsx`
- `command.tsx`
- `context-menu.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `form.tsx`
- `hover-card.tsx`
- `input.tsx`
- `label.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `popover.tsx`
- `progress.tsx`
- `radio-group.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `slider.tsx`
- `sonner.tsx`
- `switch.tsx`
- `table.tsx`
- `tabs.tsx`
- `textarea.tsx`
- `toast.tsx`
- `toaster.tsx`
- `toggle.tsx`
- `toggle-group.tsx`
- `tooltip.tsx`

**Ação**: Todos já vêm com `'use client'` quando instalados via shadcn-ui CLI.

---

## 6. Componentes Customizados

Análise dos principais componentes customizados:

| Componente | Localização | Tipo | Motivo | Ação |
|------------|-------------|------|--------|------|
| `Layout` | `src/components/Layout.tsx` | 🔴 Client | useAuth, useState, sidebar | `'use client'` |
| `ParticipantLayout` | `src/components/ParticipantLayout.tsx` | 🔴 Client | useAuth, useState | `'use client'` |
| `ProtectedRoute` | `src/components/ProtectedRoute.tsx` | 🔴 Client | useAuth, useNavigate | **Remover** (usar middleware) |
| `ThemeToggle` | `src/components/ThemeToggle.tsx` | 🔴 Client | useTheme, onClick | `'use client'` |

### Componentes de Evento (src/pages/public/components/)

| Componente | Tipo | Motivo | Ação |
|------------|------|--------|------|
| `EventHero` | 🔴 Client | Usa botões interativos | `'use client'` |
| `PublicHeader` | 🔴 Client | Navigation, interatividade | `'use client'` |
| `NewsCarousel` | 🔴 Client | Embla Carousel | `'use client'` |
| `PublicPartners` | ✅ Server | Apenas exibe logos | **Pode ser Server** |
| `PublicSchedule` | ✅ Server | Apenas exibe dados | **Pode ser Server** |
| `PublicAbout` | ✅ Server | Apenas exibe texto | **Pode ser Server** |
| `PublicFooter` | ✅ Server | Links estáticos | **Pode ser Server** |

> **Otimização**: Alguns componentes de visualização poderiam ser Server Components, mas inicialmente marcaremos todos como Client para simplificar migração.

---

## 7. Hooks Customizados

Todos os hooks em `src/hooks/` são Client-only:

| Hook | Tipo | Ação |
|------|------|------|
| `use-mobile.tsx` | 🔴 Client | Mantém como está |
| `use-toast.ts` | 🔴 Client | Mantém como está |

**Novos hooks a criar:**
- `useViaCEP.ts` → 🔴 Client

---

## 8. Bibliotecas de Terceiros

### Client-Only (precisam de componentes marcados com 'use client')

| Biblioteca | Uso Atual | Ação |
|------------|-----------|------|
| `@tiptap/react` | Rich text editor | Todos os componentes que usam Tiptap precisam `'use client'` |
| `jspdf` + `jspdf-autotable` | Geração de PDF | Componentes que usam precisam `'use client'` |
| `embla-carousel-react` | Carousels | Componentes com carousel precisam `'use client'` |
| `react-hook-form` | Formulários | Todos os forms precisam `'use client'` |
| `recharts` | Gráficos | Componentes com gráficos precisam `'use client'` |
| `xlsx` | Export Excel | Componentes que exportam precisam `'use client'` |

### Server-Safe (podem ser usados em Server Components)

| Biblioteca | Uso | Notas |
|------------|-----|-------|
| `date-fns` | Formatação de datas | Pode ser usado no servidor |
| `zod` | Validação de schemas | Pode ser usado no servidor |
| `clsx` + `tailwind-merge` | Classes CSS | Pode ser usado no servidor |

---

## 9. Estratégia de Migração

### Fase 1: Marcar Tudo como Client (Abordagem Conservadora)
Inicialmente, marcar **TODOS** os componentes e páginas como Client Components (`'use client'`).

**Vantagens:**
- ✅ Migração mais rápida
- ✅ Menor risco de erros
- ✅ Funcionamento idêntico ao atual

**Desvantagens:**
- ❌ Não aproveita SSR/SSG do Next.js
- ❌ Bundle size maior no client

### Fase 2: Otimizar Gradualmente (Futuro)
Após migração funcionar, identificar componentes que podem ser Server Components:

**Candidatos:**
- Componentes de visualização pura (sem interatividade)
- Headers/Footers estáticos
- Páginas públicas de evento (buscar dados no servidor)

---

## 10. Checklist de Ações

### Imediato (Fase de Migração)
- [ ] Adicionar `'use client'` em **TODOS** os arquivos de Contexts
- [ ] Adicionar `'use client'` em **TODAS** as páginas
- [ ] Adicionar `'use client'` em **TODOS** os layouts
- [ ] Verificar se shadcn-ui components já têm `'use client'`
- [ ] Criar novo hook `useViaCEP` como Client Component

### Componentes a Remover
- [ ] `ProtectedRoute.tsx` → substituir por middleware ou verificação no layout

### Futuro (Otimização)
- [ ] Identificar componentes puramente visuais
- [ ] Refatorar componentes visuais para Server Components
- [ ] Mover busca de dados para Server Components
- [ ] Implementar Server Actions para mutations

---

## 11. Exemplo de Migração

### Antes (React + Vite)
```tsx
// src/pages/Login.tsx
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const form = useForm()
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const onSubmit = (data) => {
    login(data)
    navigate('/area-do-produtor/inicio')
  }
  
  return (/* JSX */)
}
```

### Depois (Next.js App Router)
```tsx
// app/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const form = useForm()
  const router = useRouter()
  const { login } = useAuth()
  
  const onSubmit = (data) => {
    login(data)
    router.push('/area-do-produtor/inicio')
  }
  
  return (/* JSX */)
}
```

**Mudanças:**
1. ✅ Adicionar `'use client'` no topo
2. ✅ Substituir `useNavigate` por `useRouter` do `next/navigation`
3. ✅ Substituir `navigate` por `router.push`
4. ✅ Manter resto do código idêntico

---

## 12. Resumo

| Categoria | Total | Server | Client |
|-----------|-------|--------|--------|
| **Contexts** | 6 | 0 | 6 |
| **Páginas Públicas** | 9 | 1 | 8 |
| **Páginas Participante** | 10 | 0 | 10 |
| **Páginas Produtor** | 28+ | 0 | 28+ |
| **Componentes UI** | 35+ | 0 | 35+ |
| **Componentes Custom** | 10+ | 3 | 7+ |
| **TOTAL ESTIMADO** | **100+** | **~4** | **~96** |

**Conclusão**: Aproximadamente **96% dos componentes precisam ser Client Components** na migração inicial.

---

**Documento criado em**: 10/12/2025  
**Status**: Fase 1 - Preparação  
**Próximo passo**: Análise de dependências
