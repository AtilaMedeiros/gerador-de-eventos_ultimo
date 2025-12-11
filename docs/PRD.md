# Product Requirements Document (PRD)
## Gerador de Eventos - Plataforma de Gestão de Eventos Esportivos Escolares

**Versão**: 0.0.48  
**Data**: Dezembro 2025  
**Status**: Em Desenvolvimento

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Objetivos do Produto](#objetivos-do-produto)
3. [Públicos-Alvo](#públicos-alvo)
4. [Funcionalidades Principais](#funcionalidades-principais)
5. [Estrutura de Dados](#estrutura-de-dados)
6. [Fluxos de Usuário](#fluxos-de-usuário)
7. [Arquitectura e Stack Técnico](#arquitectura-e-stack-técnico)
8. [Plano de Desenvolvimento](#plano-de-desenvolvimento)

---

## 🎯 Visão Geral

**Gerador de Eventos** é uma plataforma web completa e profissional para a gestão integrada de eventos esportivos escolares. O sistema oferece uma solução unificada para produtores de eventos, escolas, atletas e técnicos, permitindo a criação, configuração, inscrição e acompanhamento de competições esportivas em tempo real.

### Proposta de Valor

- **Para Produtores**: Criar e gerenciar eventos com wizard intuitivo, controlar inscrições e gerar relatórios detalhados
- **Para Escolas**: Inscrever atletas e técnicos de forma simples, imprimir documentos e acompanhar participação
- **Para Atletas**: Visualizar eventos disponíveis e acompanhar sua inscrição
- **Para Público**: Acessar informações públicas do evento, comunicados e resultados

---

## 🎯 Objetivos do Produto

### Objetivos Primários

1. **Simplificar Criação de Eventos**: Implementar wizard guiado de 3 etapas (Informações → Modalidades → Identidade Visual)
2. **Centralizar Inscrições**: Plataforma única para inscrições coletivas (escolas) e individuais (atletas)
3. **Profissionalizar Comunicação**: Sistema integrado de avisos, boletins, resultados e regulamentos
4. **Automatizar Documentação**: Gerar e imprimir fichas de inscrição sem intermediários
5. **Fornecer Inteligência**: Relatórios e analytics sobre participação, distribuição e trends

### Objetivos Secundários

- Personalizar experiência visual de cada evento
- Criar comunidade e engajamento de participantes
- Reduzir tempo administrativo manual
- Oferecer experiência mobile-first responsiva

---

## 👥 Públicos-Alvo

### 1. **Produtor de Eventos** (Admin/Producer)
- **Responsabilidade**: Criar, configurar e gerenciar eventos
- **Exemplos**: Secretaria de Esportes, Organizadoras de Eventos, Federações
- **Necessidades**:
  - Criar eventos com múltiplas etapas (wizard)
  - Definir modalidades esportivas
  - Aplicar identidade visual/tema
  - Gerenciar usuários do sistema
  - Visualizar e validar inscrições
  - Gerar relatórios de participação

### 2. **Diretor/Responsável de Escola** (School Admin)
- **Responsabilidade**: Gerenciar participação da escola no evento
- **Exemplos**: Diretores, Coordenadores Pedagógicos
- **Necessidades**:
  - Cadastrar e gerenciar atletas da escola
  - Cadastrar técnicos responsáveis
  - Inscrever atletas em eventos/modalidades
  - Imprimir fichas de inscrição
  - Acompanhar status de inscrições

### 3. **Técnico Esportivo** (Technician)
- **Responsabilidade**: Apoiar na gestão de atletas
- **Exemplos**: Professores de Educação Física, Técnicos
- **Necessidades**:
  - Visualizar atletas da escola
  - Consultar inscrições
  - Acompanhar resultados

### 4. **Público Externo** (Visitante)
- **Responsabilidade**: Consumir informações sobre evento
- **Exemplos**: Potenciais participantes, pais de atletas
- **Necessidades**:
  - Ver informações do evento (datas, local, modalidades)
  - Acessar comunicados e avisos
  - Visualizar resultados
  - Entrar na área restrita (login participante)

---

## 🚀 Funcionalidades Principais

### **1. Autenticação e Autorização**

#### 1.1 Sistema de Login Dual
- **Login Produtor**: Rota `/` → Dashboard do produtor
- **Login Participante**: Rota `/area-do-participante/login` → Área da escola

#### 1.2 Roles e Permissões
```
- admin: Acesso total ao sistema
- producer: Criar/editar eventos, gerenciar usuários
- school_admin: Gerenciar escola, atletas, técnicos, inscrições
- technician: Visualizar atletas e inscrições da escola
```

#### 1.3 Funcionalidades
- Validação de email e senha (mínimo 6 caracteres)
- Persistência de sessão em localStorage (`ge_user`)
- Logout com confirmação
- Verificação de permissões granulares

---

### **2. Gerenciamento de Eventos**

#### 2.1 Event Wizard (Criação Guiada)
**Fluxo de 3 etapas**:
1. **Informações Básicas** (Settings)
   - Nome do evento
   - Datas e horários de início/fim
   - Local
   - Descrição e produtor
   - Datas de inscrição (coletiva e individual)

2. **Modalidades** (List)
   - Seleção e associação de modalidades
   - Configuração de capacidade por modalidade

3. **Identidade Visual** (Layout)
   - Aplicação de tema/personalização
   - Definição de cores e visual

#### 2.2 CRUD de Eventos
- **Create**: Novo evento via wizard
- **Read**: Listar todos, filtrar por status
- **Update**: Editar evento existente
- **Delete**: Remover evento (soft delete recomendado)

#### 2.3 Estados do Evento
- `draft`: Rascunho, não publicado
- `published`: Publicado, visível para participantes
- `closed`: Fechado, inscrições encerradas
- `archived`: Arquivado

#### 2.4 Estrutura do Evento
```typescript
interface Event {
  id: string                              // UUID
  name: string                            // Nome do evento
  description?: string                    // Descrição detalhada
  startDate: Date                         // Data de início
  endDate: Date                           // Data de término
  startTime?: string                      // Hora início (HH:MM)
  endTime?: string                        // Hora fim (HH:MM)
  location: string                        // Local do evento
  registrations: number                   // Total de inscrições
  capacity: number                        // Capacidade máxima
  status: 'draft' | 'published' | 'closed' | 'archived'
  
  // Dados do Produtor
  producerName?: string                   // Nome do produtor
  producerDescription?: string            // Descrição do produtor
  
  // Configuração Visual
  themeId?: string                        // ID do tema aplicado
  
  // Datas de Inscrição
  registrationCollectiveStart?: Date      // Início inscrição coletiva
  registrationCollectiveEnd?: Date        // Fim inscrição coletiva
  registrationIndividualStart?: Date      // Início inscrição individual
  registrationIndividualEnd?: Date        // Fim inscrição individual
}
```

#### 2.5 Mock Data
- 3 eventos pré-configurados: Tech Summit 2025, Maratona Escolar, Torneio de Robótica
- Persistência em localStorage (`ge_events`)
- Suporte a edição/exclusão com localStorage sync

---

### **3. Modalidades Esportivas**

#### 3.1 Gestão de Modalidades
- CRUD completo (Create, Read, Update, Delete)
- Associação a eventos específicos
- Definição de regras por modalidade

#### 3.2 Estrutura da Modalidade
```typescript
interface Modality {
  id: string                              // UUID
  name: string                            // Nome (ex: Futsal, Natação)
  type: 'coletiva' | 'individual'        // Tipo de competição
  gender: 'feminino' | 'masculino' | 'misto'  // Gênero
  eventCategory?: string                  // Categoria específica
  
  // Configurações
  minAthletes: number                     // Mínimo de atletas
  maxAthletes: number                     // Máximo de atletas
  maxEventsPerAthlete: number             // Máximo de eventos por atleta
  maxTeams: number                        // Máximo de times
  minAge: number                          // Idade mínima
  maxAge: number                          // Idade máxima
}
```

#### 3.3 Mock Modalities
- Futsal (5-12 atletas, masculino, coletivo)
- Natação 50m Livre (feminino, individual)
- Vôlei Misto (6-14 atletas, misto, coletivo)

#### 3.4 Associações
- Armazenadas em localStorage (`ge_event_modalities`)
- Estrutura: `{ eventId: modalityId[] }`

---

### **4. Identidade Visual (Themes)**

#### 4.1 Funcionalidades
- CRUD de temas/estilos
- Aplicação de tema a eventos
- Preview em tempo real

#### 4.2 Customizações Suportadas
- Cores primárias, secundárias, acentos
- Logo e imagens do evento
- Paleta customizada
- Fonte (através de Tailwind)

#### 4.3 Rotas
- `/area-do-produtor/cadastro-basico/identidade-visual` (CRUD)
- `/area-do-produtor/evento/:id/tema` (Aplicar ao evento)

---

### **5. Dashboard de Produtor**

#### 5.1 Home Dashboard
**Rota**: `/area-do-produtor/inicio`

**Cards Informativos**:
- Total de atletas inscritos
- Número de eventos ativos
- Total de inscrições confirmadas
- Próximos eventos

**Abas de Conteúdo**:
1. **Eventos Recentes**: Listagem com status
2. **Próximos Eventos**: Countdown para datas importantes
3. **Atalhos Rápidos**: Links para criar evento, gerenciar modalidades

#### 5.2 Navegação Principal
```
/area-do-produtor/
├── inicio                      (Dashboard Home)
├── cadastro-basico/
│   ├── evento
│   │   ├── (lista)
│   │   ├── novo (Event Wizard)
│   │   └── :id (editar)
│   ├── modalidades
│   │   ├── (lista)
│   │   └── :id (editar)
│   ├── identidade-visual
│   │   ├── (lista)
│   │   ├── novo
│   │   └── :id (editar)
│   └── usuarios
│       ├── (lista)
│       ├── novo
│       └── :id (editar)
├── configurar-evento/ (Legacy - será descontinuado)
│   ├── modalidades
│   ├── identidade-visual
│   └── comunicacao
├── evento/:eventId/ (Event Panel - por evento)
│   ├── dashboard
│   ├── relatorios
│   ├── escolas
│   ├── atletas
│   ├── modalidades
│   ├── tema
│   └── comunicacao
├── relatorios              (Reports & Analytics)
├── perfil                  (User Profile)
└── configuracoes           (Settings)
```

---

### **6. Painel do Evento (Event Panel)**

#### 6.1 Rota
`/area-do-produtor/evento/:eventId`

#### 6.2 Subseções
- **Dashboard**: Stats específicas do evento
- **Relatórios**: Gráficos e dados de participação
- **Escolas**: Lista de escolas participantes
- **Atletas**: Lista de atletas inscritos
- **Modalidades**: Gerenciar modalidades do evento
- **Tema**: Aplicar identidade visual
- **Comunicação**: Avisos, boletins, resultados, regulamentos

---

### **7. Comunicação**

#### 7.1 Tipos de Comunicação
```typescript
// Avisos (Notices)
interface Notice {
  id: string
  eventId: string
  title: string
  category: string
  description: string
  date: Date
  time: string
  author: string
  createdAt: Date
}

// Boletins (Bulletins) - Downloads
interface Bulletin {
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

// Resultados
interface Result {
  id: string
  eventId: string
  categoryName: string
  champion: string
}

// Regulamentos
interface Regulation {
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
```

#### 7.2 Rotas
- Producer: `/area-do-produtor/evento/:eventId/comunicacao`
- Public: `/evento/:slug/:id/comunicacao`

#### 7.3 Funcionalidades
- Criar/editar/deletar avisos, boletins, resultados, regulamentos
- Upload de arquivos para boletins/regulamentos
- Publicação temporizada
- Visibilidade pública automática

---

### **8. Área do Participante**

#### 8.1 Login e Autenticação
- **Rota**: `/area-do-participante/login`
- Login/Registro de escolas
- Persistência de sessão
- Suporte a múltiplas escolas (estrutura)

#### 8.2 Dashboard
**Rota**: `/area-do-participante/inicio`

**Funcionalidades**:
- Cards: Eventos abertos, Inscrições confirmadas, Total de atletas
- Tabela de eventos disponíveis
- Status de inscrição por evento

#### 8.3 Perfil da Escola
**Rota**: `/area-do-participante/escola`

**Campos**:
- Nome, INEP, CNPJ
- Endereço completo (Rua, Bairro, CEP, Município)
- Tipo (Pública/Privada), Esfera (Municipal/Estadual/Federal)
- Diretor responsável
- Contato (Telefone fixo, celular, email)

#### 8.4 Gerenciamento de Atletas
**Rotas**:
- `/area-do-participante/atletas` (Lista)
- `/area-do-participante/atletas/novo` (Criar)
- `/area-do-participante/atletas/:id` (Editar)
- `/area-do-participante/atletas/:id/inscricao` (Inscrever)

**Campos do Atleta**:
```typescript
interface Athlete {
  id: string
  schoolId: string
  name: string
  sex: 'Feminino' | 'Masculino'
  dob: Date                               // Data de nascimento
  rg: string
  cpf: string
  nis?: string                            // Número de Inscrição Social
  motherName: string                      // Nome da mãe
  motherCpf: string
}
```

#### 8.5 Gerenciamento de Técnicos
**Rotas**:
- `/area-do-participante/tecnicos` (Lista)
- `/area-do-participante/tecnicos/novo` (Criar)
- `/area-do-participante/tecnicos/:id` (Editar)

**Campos do Técnico**:
```typescript
interface Technician {
  id: string
  schoolId: string
  name: string
  sex: 'Feminino' | 'Masculino'
  dob: Date
  cpf: string
  cref: string                            // Credencial de Desportista
  email: string
  phone: string
  uniformSize: string                     // PP, P, M, G, GG
}
```

#### 8.6 Fichas de Inscrição
**Rota**: `/area-do-participante/fichas`

**Funcionalidades**:
- Visualizar todas as fichas geradas
- Filtrar por evento/modalidade
- Imprimir/Download PDF
- Reimpressão de fichas antigas

**Rota de Impressão**:
- `/area-do-participante/imprimir/:eventId/:modalityId`
- Formato print-friendly
- Pronto para PDF

---

### **9. Páginas Públicas**

#### 9.1 Página do Evento
**Rota**: `/evento/:slug/:id`

**Padrão de URL (Slug + ID)**:
Cada evento possui uma URL pública única formada por uma versão amigável do nome (slug) seguida do ID numérico/UUID.
*   **Formato:** `https://domain.com/evento/{slug}/{id_evento}`
*   **Exemplos:**
    *   `.../evento/jogo-de-futebol/1`
    *   `.../evento/copa-escolar-2025/123`
*   **Geração de Slug**: Minúsculas, sem acentos, espaços substituídos por hífens.

**Objetivo**: URLs legíveis e SEO-friendly com identificação única robusta via ID.

**Componentes**:
- **PublicHeader**: Menu navegação, logo
- **PublicHero**: Imagem destaque, título, CTA
- **PublicTicker**: Notícias rápidas em ticker
- **PublicNews**: Grid de notícias
- **PublicAbout**: Missão, valores, features (Inclusão, Talento, Cidadania)
- **PublicPartners**: Patrocinadores/Parceiros
- **PublicFooter**: Links, contato, redes sociais

#### 9.2 Página de Comunicação Pública
**Rota**: `/evento/:slug/:id/comunicacao`

**Abas**:
- **Avisos**: Notícias e avisos do evento
- **Boletins**: Downloads de documentos oficiais
- **Resultados**: Campeões e placares
- **Regulamentos**: Documentos regulatórios

---

### **10. Relatórios**

#### 10.1 Funcionalidades
- Relatório de inscrições (por evento, modalidade, escola)
- Relatório de atletas (por sexo, faixa etária, deficiência)
- Taxa de participação (confirmadas vs. totais)
- Tendências temporais

#### 10.2 Visualizações
- Gráficos com Recharts (Bar, Pie, Line)
- Tabelas filtráveis e exportáveis
- Estatísticas em cards

#### 10.3 Rota
- `/area-do-produtor/relatorios` (Global)
- `/area-do-produtor/evento/:eventId/relatorios` (Por evento)

---

## 📊 Estrutura de Dados

### **Fluxo de Estado Global (Context API)**

```
AuthContext
├── user: User | null
├── isAuthenticated: boolean
├── login(email, password): Promise<boolean>
└── hasPermission(permission): boolean

EventContext
├── events: Event[]
├── addEvent(event): Event
├── updateEvent(id, event): void
├── deleteEvent(id): void
└── getEventModalities(eventId): string[]

ModalityContext
├── modalities: Modality[]
├── addModality(modality): void
├── updateModality(id, modality): void
└── deleteModality(id): void

ParticipantContext
├── school: School | null
├── athletes: Athlete[]
├── technicians: Technician[]
├── inscriptions: Inscription[]
├── addAthlete(data): void
├── addInscription(data): void
└── [... mais métodos CRUD]

CommunicationContext
├── notices: Notice[]
├── bulletins: Bulletin[]
├── results: Result[]
├── regulations: Regulation[]
└── [... métodos para CRUD]

ThemeContext
├── theme: 'light' | 'dark'
└── toggleTheme(): void
```

### **Persistência em localStorage**

```
ge_user                     // Usuário autenticado
ge_events                   // Lista de eventos
ge_event_modalities         // Associações evento-modalidade
ge_schools                  // Escolas cadastradas
ge_athletes                 // Atletas
ge_technicians              // Técnicos
ge_inscriptions             // Inscrições
ge_comm_notices             // Avisos
ge_comm_bulletins           // Boletins
ge_comm_results             // Resultados
ge_comm_regulations         // Regulamentos
ge_modalities               // Modalidades
```

---

## 🔄 Fluxos de Usuário

### **Fluxo 1: Produtor Criar Evento**
```
1. Login (/) → Email admin ou similar
2. Dashboard (/area-do-produtor/inicio)
3. Criar Evento (/area-do-produtor/cadastro-basico/evento/novo)
   → Event Wizard
   → Etapa 1: Preencher Informações Básicas
   → Etapa 2: Selecionar Modalidades
   → Etapa 3: Aplicar Tema Visual
4. Salvar e Redirect → Lista de Eventos
5. Acompanhar via Event Panel (/area-do-produtor/evento/:id/dashboard)
```

### **Fluxo 2: Escola Inscrever Atleta**
```
1. Login Participante (/area-do-participante/login)
   → Email com "escola" ou similar
2. Dashboard (/area-do-participante/inicio)
   → Ver eventos abertos em tabela
3. Atletas (/area-do-participante/atletas)
   → Novo Atleta (/atletas/novo)
   → Preencher dados (nome, RG, CPF, mãe)
   → Salvar
4. Inscrever em Evento (/atletas/:id/inscricao)
   → Selecionar evento
   → Selecionar modalidade
   → Confirmar
5. Fichas (/area-do-participante/fichas)
   → Imprimir/Download PDF
```

### **Fluxo 3: Público Visualizar Evento**
```
1. Acessar página pública (/evento/:slug/:id)
2. Visualizar:
   → Hero com dados do evento
   → News/Ticker
   → Sobre evento
   → Parceiros
3. Acessar Comunicação (/evento/:slug/:id/comunicacao)
   → Avisos
   → Boletins (download)
   → Resultados
   → Regulamentos
4. Login Participante (Link no header)
```

---

## 🏗️ Arquitectura e Stack Técnico

### **Frontend Stack**
- **Framework**: React 19.2.0
- **Build Tool**: Vite (com Rolldown)
- **Linguagem**: TypeScript 5.9
- **Roteamento**: React Router DOM 6.30
- **Estado Global**: Context API (7 contextos)
- **Formulários**: React Hook Form 7.66 + Zod 3.25
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS 3.4
- **Notificações**: Sonner 2.0.7
- **Gráficos**: Recharts 2.15
- **Ícones**: Lucide React 0.552
- **Data/Hora**: date-fns 4.1
- **Carrossel**: Embla Carousel 8.6

### **Qualidade de Código**
- **Linter**: Oxlint 1.29
- **Formatador**: Prettier 3.6
- **TypeScript**: Strict Mode
- **ESLint**: React Hooks + Refresh plugins

### **Estrutura de Pastas**

```
src/
├── components/
│   ├── ui/                          # Componentes Shadcn UI
│   ├── DashboardHeader.tsx          # Header do dashboard
│   ├── DashboardSidebar.tsx         # Sidebar do dashboard
│   ├── EventPanelLayout.tsx         # Layout por evento
│   ├── EventPanelSidebar.tsx        # Sidebar do evento
│   ├── Layout.tsx                   # Layout principal
│   ├── ParticipantLayout.tsx        # Layout participante
│   ├── ParticipantHeader.tsx
│   ├── ParticipantSidebar.tsx
│   ├── ProtectedRoute.tsx           # HOC para rotas protegidas
│   ├── ThemePreview.tsx
│   └── [outros]
│
├── contexts/
│   ├── AuthContext.tsx              # Autenticação e permissões
│   ├── EventContext.tsx             # Eventos
│   ├── ModalityContext.tsx          # Modalidades
│   ├── ParticipantContext.tsx       # Escolas, atletas, técnicos, inscrições
│   ├── CommunicationContext.tsx     # Avisos, boletins, resultados
│   ├── ThemeContext.tsx             # Dark/Light mode
│   └── [outros]
│
├── hooks/
│   ├── use-mobile.tsx               # Detectar mobile
│   └── use-toast.ts                 # Toast notifications
│
├── lib/
│   └── utils.ts                     # Funções utilitárias (cn, etc)
│
├── pages/
│   ├── Login.tsx                    # Login produtor
│   ├── AccessDenied.tsx             # 403 - Acesso negado
│   ├── NotFound.tsx                 # 404 - Página não encontrada
│   ├── Index.tsx                    # Índice/home
│   │
│   ├── dashboard/                   # Área do Produtor
│   │   ├── DashboardHome.tsx        # Home/Dashboard
│   │   ├── Profile.tsx              # Perfil do usuário
│   │   ├── Reports.tsx              # Relatórios gerais
│   │   ├── Settings.tsx             # Configurações
│   │   │
│   │   ├── basic-registration/      # Cadastro Básico
│   │   │   ├── EventsList.tsx
│   │   │   ├── EventForm.tsx
│   │   │   ├── EventWizard.tsx      # ⭐ Wizard 3 etapas
│   │   │   ├── ModalitiesList.tsx
│   │   │   ├── ModalityForm.tsx
│   │   │   ├── UsersList.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── VisualIdentityList.tsx
│   │   │   ├── VisualIdentityForm.tsx
│   │   │   ├── components/
│   │   │   └── schemas.ts           # Validações Zod
│   │   │
│   │   ├── event-config/            # Configuração por Evento
│   │   │   ├── AssociateModalities.tsx
│   │   │   ├── ApplyVisualIdentity.tsx
│   │   │   ├── Communication.tsx     # ⭐ Comunicação multi-abas
│   │   │   └── communication-tabs/
│   │   │       ├── NoticesTab.tsx
│   │   │       ├── BulletinsTab.tsx
│   │   │       ├── ResultsTab.tsx
│   │   │       └── RegulationsTab.tsx
│   │   │
│   │   └── event-panel/             # Painel por Evento (:eventId)
│   │       ├── EventPanelDashboard.tsx
│   │       ├── EventSchools.tsx
│   │       ├── EventAthletes.tsx
│   │       └── EventReports.tsx
│   │
│   ├── participant/                 # Área do Participante
│   │   ├── ParticipantLogin.tsx
│   │   ├── ParticipantRegister.tsx
│   │   ├── ParticipantHome.tsx      # Dashboard
│   │   ├── SchoolProfile.tsx        # Perfil escola
│   │   ├── InscriptionForms.tsx     # Fichas de inscrição
│   │   ├── PrintableInscriptionForm.tsx
│   │   │
│   │   ├── athletes/
│   │   │   ├── AthletesList.tsx
│   │   │   ├── AthleteForm.tsx
│   │   │   └── AthleteInscription.tsx
│   │   │
│   │   └── technicians/
│   │       ├── TechniciansList.tsx
│   │       └── TechnicianForm.tsx
│   │
│   └── public/                      # Páginas Públicas
│       ├── EventPage.tsx            # Página do evento
│       ├── EventCommunicationPage.tsx # Comunicação pública
│       └── components/
│           ├── PublicHeader.tsx
│           ├── PublicHero.tsx
│           ├── PublicNews.tsx
│           ├── PublicAbout.tsx
│           ├── PublicPartners.tsx
│           ├── PublicFooter.tsx
│           ├── PublicTicker.tsx
│           └── [outros]
│
├── App.tsx                          # Router principal
├── main.tsx                         # Entry point
├── main.css                         # Estilos globais
└── vite-env.d.ts                   # Tipagem Vite
```

---

## 📈 Plano de Desenvolvimento

### **Fase 1 - MVP (Atual)**
- ✅ Autenticação básica com localStorage
- ✅ CRUD de eventos com wizard
- ✅ Gestão de modalidades
- ✅ Área do participante
- ✅ Inscrições e fichas
- ✅ Comunicação (avisos, boletins, resultados)
- ✅ Páginas públicas
- ✅ Relatórios básicos

### **Fase 2 - Backend Integration**
- [ ] API REST (Node.js/Express, NestJS ou Python/FastAPI)
- [ ] Banco de dados (PostgreSQL, MongoDB)
- [ ] Autenticação JWT
- [ ] Validação server-side
- [ ] Email notifications

### **Fase 3 - Funcionalidades Avançadas**
- [ ] Sistema de pagamento para inscrições
- [ ] Certificados digitais
- [ ] Gamificação (rankings, badges)
- [ ] Upload de documentos validados
- [ ] Integração com sistemas bancários

### **Fase 4 - Escalabilidade**
- [ ] Mobile app (React Native)
- [ ] Live tracking de eventos
- [ ] Integração redes sociais
- [ ] IA para recomendações
- [ ] Análise preditiva

---

## ✅ Critérios de Aceitação

### **Funcionalidade**
- [ ] Todos os CRUDs funcionando sem erros
- [ ] Fluxos de usuário completados conforme PRD
- [ ] Validações aplicadas em todos os formulários
- [ ] localStorage sincronizado corretamente

### **Performance**
- [ ] Tempo de carregamento < 2s
- [ ] Bundle size < 500KB (gzip)
- [ ] 60 FPS em scroll/animações

### **UX/Design**
- [ ] Responsivo em mobile (< 768px)
- [ ] Contrast ratio WCAG AA
- [ ] Navegação intuitiva e consistente

### **Qualidade de Código**
- [ ] TypeScript strict mode
- [ ] Zero erros ESLint/Oxlint
- [ ] Componentes reutilizáveis
- [ ] Documentação inline

---

## 📞 Suporte e Manutenção

### **Escalabilidade Futura**
- Migração para BaaS (Firebase, Supabase)
- CDN para assets estáticos
- Server-side caching com Redis
- Database clustering para alta disponibilidade

### **Roadmap Técnico**
- [ ] Testes unitários (Vitest)
- [ ] E2E testing (Playwright, Cypress)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Mixpanel, Google Analytics)

---

**Documento elaborado em**: Dezembro 2025  
**Próxima revisão**: Q1 2026
