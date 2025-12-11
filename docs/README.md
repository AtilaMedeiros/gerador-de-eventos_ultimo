# 📚 Documentação - Gerador de Eventos

**Versão do Projeto**: 0.0.48  
**Data**: Dezembro 2025  
**Status**: Em Desenvolvimento

---

## 🎯 Bem-vindo à Documentação

Esta documentação profissional fornece toda a informação necessária para **entender, desenvolver e manter** o projeto **Gerador de Eventos**.

### 📖 Documentos Disponíveis

#### 1. **[PRD.md](./PRD.md)** - Product Requirements Document
**Para**: Product Managers, Stakeholders, Designers  
**Contém**:
- Visão geral e proposta de valor
- Objetivos do produto (primários e secundários)
- 4 públicos-alvo detalhados
- 10 funcionalidades principais com especificações
- Estrutura de dados completa
- 3 fluxos de usuário principais
- Stack técnico e estrutura de pastas
- Roadmap de desenvolvimento (4 fases)
- Critérios de aceitação

**Quando ler**: Entender o que o projeto faz e por quê

---

#### 2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura do Projeto
**Para**: Arquitetos, Tech Leads, Desenvolvedores Sênior  
**Contém**:
- Visão geral da arquitetura (diagrama)
- Stack técnico completo (React 19, Vite, TypeScript, Tailwind)
- Estrutura de pastas comentada
- 5 padrões de projeto principais
- Hierarquia de Contexts (7 contextos)
- Persistência de dados (localStorage)
- Fluxos de dados (Criar Evento, Inscrever Atleta)
- Boas práticas e anti-patterns

**Quando ler**: Entender como o projeto está organizado

---

#### 3. **[API_CONTEXTS.md](./API_CONTEXTS.md)** - Documentação de API
**Para**: Desenvolvedores, QA  
**Contém**:
- 6 Contextos documentados:
  - `AuthContext` (Autenticação)
  - `EventContext` (Eventos)
  - `ModalityContext` (Modalidades)
  - `ParticipantContext` (Escolas/Atletas/Inscrições)
  - `CommunicationContext` (Avisos/Boletins/Resultados)
  - `ThemeContext` (Tema Visual)
- Métodos com parâmetros, retornos e exemplos
- Interfaces TypeScript completas
- 6+ Custom Hooks
- Padrões de uso

**Quando ler**: Usar contextos e hooks em componentes

---

#### 4. **[SETUP_DEVELOPMENT.md](./SETUP_DEVELOPMENT.md)** - Setup e Desenvolvimento
**Para**: Desenvolvedores novos, DevOps  
**Contém**:
- Pré-requisitos (Node 18+, npm 9+)
- Passo a passo de instalação
- Todos os scripts npm explicados
- Desenvolvimento local (HMR, debugging)
- Build e deploy (Vercel, Netlify, Node.js)
- Configurações (Vite, Tailwind, TypeScript)
- Troubleshooting comum
- Git workflow e padrões

**Quando ler**: Preparar ambiente local ou deployar

---

#### 5. **[COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)** - Guia de Componentes
**Para**: Desenvolvedores Frontend, UI/UX  
**Contém**:
- ~50 componentes Shadcn UI com exemplos
- 10+ componentes customizados do projeto
- 3 layouts principais
- Padrão de formulários (Zod + React Hook Form)
- Validações comuns
- Padrões de design (cards, tabelas, wizard)
- Acessibilidade (WCAG AA)
- Responsividade (breakpoints, Mobile hooks)
- Componentes avançados

**Quando ler**: Criar interfaces e componentes

---

#### 6. **[UX-UI-FLOWCHART.md](./UX-UI-FLOWCHART.md)** - Flowchart Completo de UX/UI
**Para**: Product Designers, UX/UI, Product Managers, Desenvolvedores  
**Contém**:
- Flowchart completo em Mermaid com todas as rotas
- 3 áreas principais (Pública, Produtor, Participante)
- Fluxos de autenticação detalhados
- Componentes por página
- Navegação entre telas
- Ações e interações do usuário
- Controle de acesso e permissões
- Legenda de cores por área

**Quando ler**: Entender a jornada completa do usuário

---

#### 7. **[UX-UI-FLOWCHART-SIMPLIFIED.md](./UX-UI-FLOWCHART-SIMPLIFIED.md)** - Flowchart Simplificado
**Para**: Stakeholders, Novos Membros da Equipe  
**Contém**:
- Visão geral de alto nível
- Jornadas principais dos 3 perfis de usuário
- Arquitetura de componentes
- Fluxo de dados e contextos
- Sequência de autenticação
- Métricas e KPIs exibidos
- Tabela de funcionalidades por perfil
- Navegação por dispositivo (Desktop/Mobile)

**Quando ler**: Ter uma compreensão rápida do fluxo da aplicação

---

#### 8. **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)** - Schema do Banco de Dados
**Para**: DBAs, Backend Developers, Arquitetos  
**Contém**:
- Diagrama ER completo em Mermaid
- DDL SQL completo para PostgreSQL
- Descrição detalhada de 15 tabelas
- Índices e constraints
- Triggers para updated_at
- Queries comuns otimizadas
- Estratégias de migração
- Row Level Security (RLS)
- Views para dashboards e analytics

**Quando ler**: Implementar backend e banco de dados

---

#### 9. **[DATABASE-SCHEMA-SIMPLIFIED.md](./DATABASE-SCHEMA-SIMPLIFIED.md)** - Schema Simplificado
**Para**: Product Managers, Clientes, Usuários Finais  
**Contém**:
- Tabelas simplificadas com nomenclatura padronizada
- PK sempre como **id**
- FK sempre como **id_<tabela>**
- Descrição clara de 15 tabelas
- Diagrama de relacionamentos simplificado
- Resumo por área funcional
- Glossário de termos técnicos
- Principais fluxos de dados

**Quando ler**: Entender a estrutura do banco sem conhecimentos técnicos

---

#### 10. **[MIGRATION_GUIDELINES.md](./MIGRATION_GUIDELINES.md)** - Diretrizes de Migração (React → Next.js)
**Para**: Desenvolvedores na Migração  
**Contém**:
- Estrutura clara dos dois projetos (Origem vs Destino)
- Regras de fidelidade visual e funcional
- Roadmap da migração
- Checklists de validação

**Quando ler**: Antes de migrar qualquer componente ou página para o Next.js

---

#### 11. **[pitfall.md](./pitfall.md)** - Pitfalls e Aprendizados
**Para**: Todos os Desenvolvedores  
**Contém**:
- Catálogo de problemas recorrentes e soluções
- Padrões visuais a evitar (ex: cores pastel vs vibrantes)
- Erros técnicos comuns (ex: dark mode inputs)
- Template para registro de novos erros

**Quando ler**: Diariamente, para consultar e registrar novos aprendizados

---

## 🗂️ Estrutura de Documentação

```
docs/
├── README.md                        # Este arquivo
├── PRD.md                           # Requisitos do produto
├── ARCHITECTURE.md                  # Arquitetura técnica
├── API_CONTEXTS.md                  # API de contextos
├── SETUP_DEVELOPMENT.md             # Setup e desenvolvimento
├── COMPONENTS_GUIDE.md              # Guia de componentes
├── UX-UI-FLOWCHART.md              # Flowchart completo de UX/UI
├── UX-UI-FLOWCHART-SIMPLIFIED.md   # Flowchart simplificado
├── DATABASE-SCHEMA.md               # Schema do banco de dados (técnico)
└── DATABASE-SCHEMA-SIMPLIFIED.md    # Schema do banco (simplificado)
```

---

## 🚀 Como Começar

### Se você é novo no projeto

1. **Leia [PRD.md](./PRD.md)** (30 min) - Entenda o que é o projeto
2. **Leia [UX-UI-FLOWCHART-SIMPLIFIED.md](./UX-UI-FLOWCHART-SIMPLIFIED.md)** (15 min) - Visualize o fluxo da aplicação
3. **Leia [ARCHITECTURE.md](./ARCHITECTURE.md)** (30 min) - Entenda como está organizado
4. **Siga [SETUP_DEVELOPMENT.md](./SETUP_DEVELOPMENT.md)** (15 min) - Configure o ambiente
5. **Explore [API_CONTEXTS.md](./API_CONTEXTS.md)** (conforme necessário) - Use os contextos
6. **Consulte [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)** (conforme necessário) - Crie componentes

### Se você está fazendo design/UX

1. Consulte [UX-UI-FLOWCHART.md](./UX-UI-FLOWCHART.md) - Flowchart completo
2. Use [UX-UI-FLOWCHART-SIMPLIFIED.md](./UX-UI-FLOWCHART-SIMPLIFIED.md) - Para apresentações
3. Verifique requisitos em [PRD.md](./PRD.md)

### Se você precisa adicionar uma funcionalidade

1. Verifique requisitos em [PRD.md](./PRD.md)
2. Consulte o fluxo em [UX-UI-FLOWCHART.md](./UX-UI-FLOWCHART.md)
3. Escolha o contexto apropriado em [API_CONTEXTS.md](./API_CONTEXTS.md)
4. Use padrões em [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)
5. Siga boas práticas em [ARCHITECTURE.md](./ARCHITECTURE.md)

### Se você precisa fazer deploy

1. Siga instruções de deploy em [SETUP_DEVELOPMENT.md](./SETUP_DEVELOPMENT.md)
2. Verifique checklist em [PRD.md](./PRD.md#criterios-de-aceitação)

---

## 📊 Stack Técnico (Quick Reference)

```
Frontend Framework:   React 19.2.0
Build Tool:          Vite (Rolldown)
Language:            TypeScript 5.9
Routing:             React Router 6.30
State Management:    Context API (7 contextos)
UI Components:       Shadcn UI + Radix UI (~50 componentes)
CSS:                 Tailwind CSS 3.4
Forms:               React Hook Form + Zod
Notifications:       Sonner
Charts:              Recharts
Icons:               Lucide React
Linting:             Oxlint 1.29
Formatting:          Prettier 3.6
Database:            localStorage (mock) - Future: PostgreSQL/MongoDB
```

---

## 🎯 Principais Recursos

### Contextos Principais (7)

| Contexto | Responsabilidade | Principais Métodos |
|----------|-----------------|-------------------|
| **AuthContext** | Autenticação, Permissões | `login()`, `logout()`, `hasPermission()` |
| **EventContext** | Eventos CRUD | `addEvent()`, `updateEvent()`, `deleteEvent()` |
| **ModalityContext** | Modalidades esportivas | `addModality()`, `updateModality()` |
| **ParticipantContext** | Escolas, Atletas, Inscrições | `addAthlete()`, `addInscription()` |
| **CommunicationContext** | Avisos, Boletins, Resultados | `addNotice()`, `addBulletin()`, `addResult()` |
| **ThemeContext** | Tema Visual (light/dark) | `toggleTheme()` |
| **ParticipantProvider** | (Integrado em ParticipantContext) | - |

### Rotas Principais

```
/                                    # Login produtor
│
├── /evento/:slug/:id                # Página pública evento
├── /evento/:slug/:id/comunicacao    # Comunicação pública
│
├── /area-do-participante/
│   ├── login                        # Login participante
│   ├── cadastro                     # Registro
│   └── {inicio, atletas, técnicos, fichas, etc}
│
└── /area-do-produtor/
    ├── inicio                       # Dashboard
    ├── cadastro-basico/             # Cadastros (eventos, modalidades, etc)
    ├── evento/:eventId/             # Painel específico do evento
    └── {relatorios, perfil, config, etc}
```

### Estrutura de Pastas

```
src/
├── components/          # Componentes (60+)
├── contexts/            # Contextos (7)
├── pages/               # Páginas
├── lib/                 # Utilitários
├── hooks/               # Hooks customizados
├── App.tsx              # Router principal
└── main.tsx             # Entry point
```

---

## 🔐 Autenticação

### Roles e Permissões

```
admin        → Acesso total
producer     → Criar/editar eventos
school_admin → Gerenciar escola, atletas, técnicos
technician   → Visualizar atletas
```

### Mock Users (Desenvolvimento)

```
Email com "admin"   → Role: producer
Email com "escola"  → Role: school_admin
Email com "tecnico" → Role: technician
Qualquer outro      → Role: school_admin (padrão)

Senha: Qualquer string com 6+ caracteres
```

---

## 💾 Persistência de Dados

Todos os dados são salvos em **localStorage** com prefixo `ge_`:

```
ge_user                 # Usuário autenticado
ge_events               # Eventos
ge_event_modalities     # Associações evento-modalidade
ge_modalities           # Modalidades
ge_schools              # Escolas
ge_athletes             # Atletas
ge_technicians          # Técnicos
ge_inscriptions         # Inscrições
ge_comm_notices         # Avisos
ge_comm_bulletins       # Boletins
ge_comm_results         # Resultados
ge_comm_regulations     # Regulamentos
```

---

## 🛠️ Desenvolvimento

### Scripts Principais

```bash
npm run dev              # Desenvolvimento (localhost:8080)
npm run build            # Build produção
npm run preview          # Preview build
npm run lint             # Linting
npm run lint:fix         # Linting com auto-fix
npm run format           # Formatação com Prettier
```

### Padrões de Código

```tsx
// ✅ Preferir
- Componentes pequenos e reutilizáveis
- TypeScript strict mode
- Validação com Zod
- Componentes Shadcn UI
- Context API para estado
- Naming em português (código) + inglês (componentes)

// ❌ Evitar
- Componentes gigantes (> 300 linhas)
- any type
- Validação manual
- Inline styles
- Props drilling excessivo
```

---

## 📈 Roadmap

### Fase 1 - MVP ✅ (Atual)
- Autenticação localStorage
- CRUD eventos com wizard
- Gestão de modalidades
- Área participante
- Comunicação (avisos, boletins)
- Páginas públicas

### Fase 2 - Backend Integration 📋
- API REST
- Banco de dados (PostgreSQL/MongoDB)
- Autenticação JWT
- Email notifications

### Fase 3 - Funcionalidades Avançadas 📋
- Sistema de pagamento
- Certificados digitais
- Gamificação
- Upload validado

### Fase 4 - Escalabilidade 📋
- Mobile app (React Native)
- Live tracking
- IA e análise preditiva

---

## ❓ FAQ

### Como adicionar novo contexto?

1. Criar arquivo em `src/contexts/MyContext.tsx`
2. Definir interface e estado inicial
3. Criar provider e custom hook
4. Adicionar em `App.tsx`
5. Documentar em [API_CONTEXTS.md](./API_CONTEXTS.md)

### Como adicionar nova página?

1. Criar em `src/pages/MyPage.tsx`
2. Adicionar rota em `App.tsx`
3. Se precisa autenticação, envolver em `<ProtectedRoute>`

### Como usar localStorage manualmente?

```tsx
// Salvar
localStorage.setItem('ge_mykey', JSON.stringify(data))

// Carregar
const data = JSON.parse(localStorage.getItem('ge_mykey') || '{}')

// Limpar
localStorage.removeItem('ge_mykey')
localStorage.clear() // Tudo
```

### Como testar componente novo?

```bash
npm run dev
# Navegue para a rota
# Abra DevTools (F12)
# Console → teste funções
# Components → inspecione props
```

---

## 📞 Suporte

### Erros Comuns

**"Cannot find module '@/components/..."**
→ Reiniciar servidor (Ctrl+C, npm run dev)

**"localStorage is undefined"**
→ Verificar `if (typeof window !== 'undefined')`

**"Types are not assignable"**
→ Executar `npm run lint:fix`

**Porta 8080 em uso**
→ `npm run dev -- --port 3000`

### Recursos Externos

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Vite](https://vitejs.dev)

---

## 📝 Contribuindo

### Abrir Issue

Descreva:
1. O que esperava acontecer
2. O que realmente aconteceu
3. Passos para reproduzir

### Submeter PR

1. Criar branch: `git checkout -b feature/minha-feature`
2. Fazer alterações
3. Commit: `git commit -m "feat: descrição"`
4. Push: `git push origin feature/minha-feature`
5. Abrir Pull Request

---

## 📜 Licença

[Adicionar informação de licença conforme apropriado]

---

## 🎓 Histórico de Documentação

| Versão | Data | Alterações |
|--------|------|-----------|
| 0.0.48 | Dez/2025 | Documentação inicial |

---

**Última atualização**: Dezembro 2025  
**Próxima revisão**: Q1 2026  
**Mantenedor**: [Seu nome/time]

---

## 🔗 Referências Rápidas

- [PRD.md](./PRD.md) - Requisitos
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura
- [API_CONTEXTS.md](./API_CONTEXTS.md) - APIs
- [SETUP_DEVELOPMENT.md](./SETUP_DEVELOPMENT.md) - Setup
- [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) - Componentes
- [UX-UI-FLOWCHART.md](./UX-UI-FLOWCHART.md) - Flowchart Completo
- [UX-UI-FLOWCHART-SIMPLIFIED.md](./UX-UI-FLOWCHART-SIMPLIFIED.md) - Flowchart Simplificado
- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) - Schema do Banco de Dados (Técnico)
- [DATABASE-SCHEMA-SIMPLIFIED.md](./DATABASE-SCHEMA-SIMPLIFIED.md) - Schema Simplificado
