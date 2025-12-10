# Mapeamento de Rotas: React Router → Next.js App Router

## Sumário
- **Total de Rotas**: 60+
- **Rotas Públicas**: 7
- **Rotas Protegidas (Produtor)**: 35+
- **Rotas Protegidas (Participante)**: 15+

---

## 1. Rotas Públicas

| # | Rota Atual (React Router) | Nova Rota (Next.js App Router) | Componente Atual | Tipo | Notas |
|---|---|---|---|---|---|
| 1 | `/` | `app/page.tsx` | `Login.tsx` | Público | Login do Produtor |
| 2 | `/evento/:slug/:id` | `app/evento/[slug]/[id]/page.tsx` | `EventPage.tsx` | Público | Página pública do evento |
| 3 | `/evento/:slug/:id/comunicacao` | `app/evento/[slug]/[id]/comunicacao/page.tsx` | `EventCommunicationPage.tsx` | Público | Comunicação do evento |
| 4 | `/evento/:slug/:id/regulamentos` | `app/evento/[slug]/[id]/regulamentos/page.tsx` | `EventRegulationsPage.tsx` | Público | Regulamentos do evento |
| 5 | `/area-do-participante/login` | `app/area-do-participante/login/page.tsx` | `ParticipantLogin.tsx` | Público | Login do participante |
| 6 | `/area-do-participante/cadastro` | `app/area-do-participante/cadastro/page.tsx` | `ParticipantRegister.tsx` | Público | Cadastro de escola |
| 7 | `/area-do-participante/imprimir/:eventId/:modalityId` | `app/area-do-participante/imprimir/[eventId]/[modalityId]/page.tsx` | `PrintableInscriptionForm.tsx` | Público | Formulário de impressão |
| 8 | `/acesso-negado` | `app/acesso-negado/page.tsx` | `AccessDenied.tsx` | Público | Acesso negado |
| 9 | `*` | `app/not-found.tsx` | `NotFound.tsx` | Público | 404 |

---

## 2. Rotas Protegidas - Área do Participante

**Layout**: `app/area-do-participante/layout.tsx` (ParticipantLayout)

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 10 | `/area-do-participante/inicio` | `app/area-do-participante/inicio/page.tsx` | `ParticipantHome.tsx` | Dashboard do participante |
| 11 | `/area-do-participante/escola` | `app/area-do-participante/escola/page.tsx` | `SchoolProfile.tsx` | Perfil da escola |
| 12 | `/area-do-participante/atletas` | `app/area-do-participante/atletas/page.tsx` | `AthletesList.tsx` | Lista de atletas |
| 13 | `/area-do-participante/atletas/novo` | `app/area-do-participante/atletas/novo/page.tsx` | `AthleteForm.tsx` | Novo atleta |
| 14 | `/area-do-participante/atletas/:id` | `app/area-do-participante/atletas/[id]/page.tsx` | `AthleteForm.tsx` | Editar atleta |
| 15 | `/area-do-participante/atletas/:id/inscricao` | `app/area-do-participante/atletas/[id]/inscricao/page.tsx` | `AthleteInscription.tsx` | Inscrição em modalidade |
| 16 | `/area-do-participante/tecnicos` | `app/area-do-participante/tecnicos/page.tsx` | `TechniciansList.tsx` | Lista de técnicos |
| 17 | `/area-do-participante/tecnicos/novo` | `app/area-do-participante/tecnicos/novo/page.tsx` | `TechnicianForm.tsx` | Novo técnico |
| 18 | `/area-do-participante/tecnicos/:id` | `app/area-do-participante/tecnicos/[id]/page.tsx` | `TechnicianForm.tsx` | Editar técnico |
| 19 | `/area-do-participante/tecnicos/:id/inscricao` | `app/area-do-participante/tecnicos/[id]/inscricao/page.tsx` | `TechnicianInscription.tsx` | Inscrição em modalidade |
| 20 | `/area-do-participante/fichas` | `app/area-do-participante/fichas/page.tsx` | `InscriptionForms.tsx` | Fichas de inscrição |

---

## 3. Rotas Protegidas - Área do Produtor (Global)

**Layout**: `app/area-do-produtor/layout.tsx` (Layout)

### 3.1 Dashboard e Principais

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 21 | `/area-do-produtor/inicio` | `app/area-do-produtor/inicio/page.tsx` | `DashboardHome.tsx` | Dashboard principal |
| 22 | `/area-do-produtor/perfil` | `app/area-do-produtor/perfil/page.tsx` | `Profile.tsx` | Perfil do usuário |
| 23 | `/area-do-produtor/configuracoes` | `app/area-do-produtor/configuracoes/page.tsx` | `Settings.tsx` | Configurações |
| 24 | `/area-do-produtor/relatorios` | `app/area-do-produtor/relatorios/page.tsx` | `Reports.tsx` | Relatórios |
| 25 | `/area-do-produtor/publicacoes` | `app/area-do-produtor/publicacoes/page.tsx` | `Communication.tsx` | Comunicação global |

### 3.2 Cadastro Básico - Eventos

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 26 | `/area-do-produtor/evento` | `app/area-do-produtor/evento/page.tsx` | `EventsList.tsx` | Lista de eventos |
| 27 | `/area-do-produtor/evento/novo` | `app/area-do-produtor/evento/novo/page.tsx` | `EventWizard.tsx` | Wizard de criação |
| 28 | `/area-do-produtor/evento/:id` | `app/area-do-produtor/evento/[id]/page.tsx` | `EventForm.tsx` | Editar evento |
| 29 | `/area-do-produtor/evento/:id/produtor` | `app/area-do-produtor/evento/[id]/produtor/page.tsx` | `EventProducers.tsx` | Produtores do evento |
| 30 | `/area-do-produtor/evento/:id/comunicacao` | `app/area-do-produtor/evento/[id]/comunicacao/page.tsx` | `EventCommunication.tsx` | Comunicação do evento |

### 3.3 Cadastro Básico - Modalidades

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 31 | `/area-do-produtor/modalidades` | `app/area-do-produtor/modalidades/page.tsx` | `ModalitiesList.tsx` | Lista de modalidades |
| 32 | `/area-do-produtor/modalidades/:id` | `app/area-do-produtor/modalidades/[id]/page.tsx` | `ModalityForm.tsx` | Editar modalidade |

### 3.4 Cadastro Básico - Identidade Visual

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 33 | `/area-do-produtor/identidade-visual` | `app/area-do-produtor/identidade-visual/page.tsx` | `ApplyVisualIdentity.tsx` | Aplicar tema |
| 34 | `/area-do-produtor/identidade-visual/novo` | `app/area-do-produtor/identidade-visual/novo/page.tsx` | `VisualIdentityForm.tsx` | Criar novo tema |

### 3.5 Cadastro Básico - Usuários

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 35 | `/area-do-produtor/usuarios` | `app/area-do-produtor/usuarios/page.tsx` | `UsersList.tsx` | Lista de usuários |
| 36 | `/area-do-produtor/usuarios/novo` | `app/area-do-produtor/usuarios/novo/page.tsx` | `UserForm.tsx` | Novo usuário |
| 37 | `/area-do-produtor/usuarios/:id` | `app/area-do-produtor/usuarios/[id]/page.tsx` | `UserForm.tsx` | Editar usuário |

### 3.6 Cadastro Básico - Escolas (Admin)

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 38 | `/area-do-produtor/escolas` | `app/area-do-produtor/escolas/page.tsx` | `SchoolsList.tsx` | Lista de escolas |
| 39 | `/area-do-produtor/escolas/novo` | `app/area-do-produtor/escolas/novo/page.tsx` | `SchoolForm.tsx` | Nova escola |
| 40 | `/area-do-produtor/escolas/:id` | `app/area-do-produtor/escolas/[id]/page.tsx` | `SchoolForm.tsx` | Editar escola |

### 3.7 Cadastro Básico - Atletas (Admin)

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 41 | `/area-do-produtor/atletas` | `app/area-do-produtor/atletas/page.tsx` | `AdminAthletesList.tsx` | Lista de atletas |
| 42 | `/area-do-produtor/atletas/novo` | `app/area-do-produtor/atletas/novo/page.tsx` | `AdminAthleteForm.tsx` | Novo atleta |
| 43 | `/area-do-produtor/atletas/:id` | `app/area-do-produtor/atletas/[id]/page.tsx` | `AdminAthleteForm.tsx` | Editar atleta |
| 44 | `/area-do-produtor/atletas/:id/modalidades` | `app/area-do-produtor/atletas/[id]/modalidades/page.tsx` | `AthleteModalities.tsx` | Modalidades do atleta |

### 3.8 Configurar Evento (Global/Legacy)

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 45 | `/area-do-produtor/configurar-evento/modalidades` | `app/area-do-produtor/configurar-evento/modalidades/page.tsx` | `AssociateModalities.tsx` | Associar modalidades |
| 46 | `/area-do-produtor/configurar-evento/identidade-visual` | `app/area-do-produtor/configurar-evento/identidade-visual/page.tsx` | `ApplyVisualIdentity.tsx` | Aplicar tema (legacy) |

---

## 4. Rotas Protegidas - Painel Específico do Evento

**Layout**: `app/area-do-produtor/evento/[eventId]/layout.tsx` (Layout com sidebar específico do evento)

| # | Rota Atual | Nova Rota | Componente | Notas |
|---|---|---|---|---|
| 47 | `/area-do-produtor/evento/:eventId/dashboard` | `app/area-do-produtor/evento/[eventId]/dashboard/page.tsx` | `EventPanelDashboard.tsx` | Dashboard do evento |

> **Nota**: O painel específico do evento tem apenas o dashboard implementado atualmente. Outras rotas podem ser adicionadas futuramente.

---

## 5. Estrutura de Diretórios Proposta

```
src/app/
├── layout.tsx                                      # Root layout
├── page.tsx                                        # "/" - Login Produtor
├── not-found.tsx                                   # 404
├── loading.tsx                                     # Loading global
├── error.tsx                                       # Error global
├── globals.css                                     # Estilos globais
├── providers.tsx                                   # Client component com Contexts
│
├── acesso-negado/
│   └── page.tsx                                    # Acesso negado
│
├── evento/
│   └── [slug]/
│       └── [id]/
│           ├── page.tsx                            # Página pública
│           ├── comunicacao/
│           │   └── page.tsx
│           └── regulamentos/
│               └── page.tsx
│
├── area-do-participante/
│   ├── layout.tsx                                  # Layout participante
│   ├── loading.tsx
│   ├── error.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── cadastro/
│   │   └── page.tsx
│   ├── imprimir/
│   │   └── [eventId]/
│   │       └── [modalityId]/
│   │           └── page.tsx
│   ├── inicio/
│   │   └── page.tsx
│   ├── escola/
│   │   └── page.tsx
│   ├── atletas/
│   │   ├── page.tsx
│   │   ├── novo/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── inscricao/
│   │           └── page.tsx
│   ├── tecnicos/
│   │   ├── page.tsx
│   │   ├── novo/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── inscricao/
│   │           └── page.tsx
│   └── fichas/
│       └── page.tsx
│
└── area-do-produtor/
    ├── layout.tsx                                  # Layout produtor
    ├── loading.tsx
    ├── error.tsx
    ├── inicio/
    │   └── page.tsx
    ├── perfil/
    │   └── page.tsx
    ├── configuracoes/
    │   └── page.tsx
    ├── relatorios/
    │   └── page.tsx
    ├── publicacoes/
    │   └── page.tsx
    ├── evento/
    │   ├── page.tsx
    │   ├── novo/
    │   │   └── page.tsx
    │   ├── [id]/
    │   │   ├── page.tsx
    │   │   ├── layout.tsx                          # Layout do painel do evento
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   ├── produtor/
    │   │   │   └── page.tsx
    │   │   └── comunicacao/
    │   │       └── page.tsx
    │   └── ...
    ├── modalidades/
    │   ├── page.tsx
    │   └── [id]/
    │       └── page.tsx
    ├── identidade-visual/
    │   ├── page.tsx
    │   └── novo/
    │       └── page.tsx
    ├── usuarios/
    │   ├── page.tsx
    │   ├── novo/
    │   │   └── page.tsx
    │   └── [id]/
    │       └── page.tsx
    ├── escolas/
    │   ├── page.tsx
    │   ├── novo/
    │   │   └── page.tsx
    │   └── [id]/
    │       └── page.tsx
    ├── atletas/
    │   ├── page.tsx
    │   ├── novo/
    │   │   └── page.tsx
    │   └── [id]/
    │       ├── page.tsx
    │       └── modalidades/
    │           └── page.tsx
    └── configurar-evento/
        ├── modalidades/
        │   └── page.tsx
        └── identidade-visual/
            └── page.tsx
```

---

## 6. Mudanças na Navegação

### 6.1 React Router → Next.js

**Antes (React Router):**
```tsx
import { Link, useNavigate, useParams } from 'react-router-dom'

function Component() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  return (
    <Link to="/area-do-produtor/evento">Eventos</Link>
    <button onClick={() => navigate('/area-do-produtor/inicio')}>Dashboard</button>
  )
}
```

**Depois (Next.js):**
```tsx
'use client'

import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

function Component() {
  const router = useRouter()
  const { id } = useParams()
  
  return (
    <Link href="/area-do-produtor/evento">Eventos</Link>
    <button onClick={() => router.push('/area-do-produtor/inicio')}>Dashboard</button>
  )
}
```

### 6.2 Protected Routes

**Antes (React Router):**
```tsx
<Route path="/area-do-produtor" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route path="inicio" element={<DashboardHome />} />
</Route>
```

**Depois (Next.js):**
```tsx
// app/area-do-produtor/layout.tsx
'use client'

export default function ProducerLayout({ children }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated])
  
  return <>{children}</>
}
```

---

## 7. Checklist de Migração por Rota

### Fase 1: Rotas Públicas (Prioridade Alta)
- [ ] `/` - Login Produtor
- [ ] `/evento/:slug/:id` - Página do Evento
- [ ] `/evento/:slug/:id/comunicacao` - Comunicação
- [ ] `/evento/:slug/:id/regulamentos` - Regulamentos
- [ ] `/area-do-participante/login` - Login Participante
- [ ] `/area-do-participante/cadastro` - Cadastro
- [ ] `/acesso-negado` - Acesso Negado
- [ ] `*` - 404

### Fase 2: Área do Participante (Prioridade Alta)
- [ ] Layout + proteção
- [ ] Início
- [ ] Escola
- [ ] Atletas (lista, novo, editar, inscrição)
- [ ] Técnicos (lista, novo, editar, inscrição)
- [ ] Fichas
- [ ] Imprimir formulário

### Fase 3: Área do Produtor - Core (Prioridade Alta)
- [ ] Layout + proteção
- [ ] Dashboard
- [ ] Eventos (lista, novo, editar)
- [ ] Modalidades
- [ ] Perfil
- [ ] Configurações

### Fase 4: Área do Produtor - Cadastro Básico (Prioridade Média)
- [ ] Identidade Visual
- [ ] Usuários
- [ ] Escolas
- [ ] Atletas (admin)
- [ ] Relatórios
- [ ] Comunicação

### Fase 5: Área do Produtor - Configurações de Evento (Prioridade Média)
- [ ] Produtores do evento
- [ ] Comunicação do evento
- [ ] Associar modalidades
- [ ] Aplicar identidade visual

### Fase 6: Painel Específico do Evento (Prioridade Baixa)
- [ ] Dashboard do evento

---

## 8. Observações Importantes

1. **Rotas Dinâmicas**: Next.js usa `[param]` ao invés de `:param`
2. **Navegação**: `<Link>` usa `href` ao invés de `to`
3. **Hooks**: `useRouter` e `useParams` do `next/navigation` (não `react-router-dom`)
4. **Client Components**: Todas as páginas com hooks precisam de `'use client'`
5. **Layouts**: Usar layouts aninhados para evitar repetição
6. **Loading/Error**: Criar arquivos especiais para cada seção

---

**Documento criado em**: 10/12/2025  
**Status**: Fase 1 - Preparação  
**Próximo passo**: Análise de Client/Server Components
