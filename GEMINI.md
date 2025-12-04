# Contexto do Projeto: Gerador de Eventos

## 📋 Visão Geral
Este é um projeto de aplicação frontend **React 19** construído com **Vite** e **TypeScript**. O objetivo é ser um "Gerador de Eventos" esportivos, permitindo o gerenciamento de inscrições, modalidades, escolas e atletas.

**Características Principais:**
- **Stack:** React 19, Vite, TypeScript, Tailwind CSS.
- **UI:** Shadcn UI (baseado em Radix UI) + Lucide React Icons.
- **Arquitetura:** Single Page Application (SPA) sem backend (Serverless/Backendless).
- **Persistência:** Todo o estado é persistido localmente usando `localStorage` (simulando um banco de dados).
- **Gerenciamento de Estado:** Context API (`src/contexts/`).
- **Roteamento:** React Router DOM com rotas públicas e protegidas (Produtor e Participante).
- **Formulários:** React Hook Form + Zod para validação.
- **Qualidade:** Oxlint (Linter) + Prettier (Formatador).

## 🔧 Comandos de Desenvolvimento

| Ação | Comando | Descrição |
| :--- | :--- | :--- |
| **Instalar** | `npm install` | Instala as dependências. |
| **Rodar (Dev)** | `npm run dev` | Inicia o servidor de desenvolvimento em `http://localhost:8080` (HMR ativo). |
| **Build** | `npm run build` | Compila o projeto para produção na pasta `dist/` (minificado). |
| **Preview** | `npm run preview` | Visualiza o build de produção localmente. |
| **Lint** | `npm run lint` | Executa o `oxlint` para análise estática rápida. |
| **Lint Fix** | `npm run lint:fix` | Tenta corrigir problemas de lint automaticamente. |
| **Formatar** | `npm run format` | Formata todo o código usando Prettier. |

> **Nota:** Não há testes automatizados configurados (`npm test` é um placeholder).

## 🏗️ Arquitetura e Padrões

### 1. Fluxo de Dados (Context API + LocalStorage)
O projeto não consome uma API externa. Os dados são gerenciados via React Context e sincronizados com o `localStorage`.
- **Contextos Principais:** `AuthContext` (Autenticação), `EventContext` (Eventos), `ParticipantContext` (Inscrições/Atletas), `ModalityContext` (Modalidades), `ThemeContext` (Temas).
- **Persistência:** Chaves no `localStorage` como `ge_events`, `ge_user`, `ge_schools`.

### 2. Estrutura de Diretórios (`src/`)
- `components/ui`: Componentes reutilizáveis do Shadcn UI (Button, Card, Dialog, etc.).
- `contexts/`: Provedores de estado global.
- `pages/dashboard`: Área administrativa (Produtor) - *Rotas protegidas*.
- `pages/participant`: Área de inscrição para atletas/escolas - *Rotas protegidas*.
- `pages/public`: Páginas públicas de visualização do evento.
- `lib/utils.ts`: Utilitários globais (ex: função `cn` para classes).
- `hooks/`: Hooks customizados (ex: `use-mobile`, `use-toast`).

### 3. Padrões de Componentes & UI
- **Shadcn UI:** Use componentes de `src/components/ui` sempre que possível.
- **Formulários:** Padrão **React Hook Form** + **Zod**.
  ```tsx
  const form = useForm({ resolver: zodResolver(schema) })
  // Use <Form>, <FormField>, <FormItem>, <FormControl>, <FormMessage>
  ```
- **Estilização:** Tailwind CSS utilitário. Use `cn()` para mesclar classes condicionalmente.
- **Responsividade:** Use o hook `useIsMobile()` ou classes `md:`, `lg:` do Tailwind.
- **Imports:** Use o alias `@/` para raiz de `src` (ex: `import { Button } from '@/components/ui/button'`).

### 4. Workflow de Desenvolvimento
- **Commits:** Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`).
- **Novas Funcionalidades:**
  1. Crie a página em `src/pages/`.
  2. Adicione a rota em `src/App.tsx` (verifique se é pública ou protegida).
  3. Se precisar de estado global, adicione/atualize um Contexto em `src/contexts/`.
  4. Valide inputs com Zod.

## 🐛 Troubleshooting Comum
- **Porta Ocupada:** O servidor roda na porta 8080. Se der erro, mate o processo (`kill -9 <PID>`) ou use outra porta.
- **Erro de Alias:** Se `@/` não for reconhecido, verifique `vite.config.ts` e `tsconfig.json`. Reinicie o servidor dev.
- **LocalStorage:** Se os dados não persistirem, verifique se `useEffect` está salvando corretamente e se não está usando aba anônima de forma restritiva.

## 📍 Rotas Principais
- `/` : Login do Produtor.
- `/area-do-produtor/inicio` : Dashboard administrativa.
- `/area-do-participante/inicio` : Área de inscrição.
- `/evento/:slug/:id` : Página pública do evento.

---
**Gerado automaticamente pelo Gemini CLI**
Baseado em: `README.md`, `package.json`, `docs/ARCHITECTURE.md`, `docs/SETUP_DEVELOPMENT.md`, `docs/COMPONENTS_GUIDE.md`.
