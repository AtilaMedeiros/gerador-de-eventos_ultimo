# 🎊 Gerador de Eventos - Next.js 16

> Migração completa de React+Vite para Next.js 16 com App Router

**Status:** ✅ **80% CONCLUÍDO - APLICAÇÃO FUNCIONAL**

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Acessar aplicação
open http://localhost:3000
```

### Credenciais de Teste

**Produtor:**
- Email: `produtor@teste.com`
- Senha: `123456`

**Participante:**
- Email: `participante@teste.com`
- Senha: `123456`

---

## 📊 Progresso da Migração: 80%

| Componente | Status |
|---|---|
| ✅ Infraestrutura | 100% |
| ✅ Autenticação | 100% |
| ✅ Contexts (4/4) | 100% |
| ✅ Layouts | 100% |
| ✅ Componentes Base | 100% |
| ✅ Páginas Essenciais | 60% |
| 🔄 Formulários | 40% |

---

## 🎯 Funcionalidades

### ✅ Implementado

**Autenticação:**
- Login produtor/participante
- Logout
- Session com cookies
- Proteção de rotas
- Redirecionamentos automáticos

**Navegação:**
- Sidebar produtor (7 menus)
- Header produtor
- Sidebar participante (5 menus)
- Header participante
- Mobile responsive

**Área do Participante:**
- ✅ Dashboard
- ✅ Perfil da escola (formulário completo)
- ✅ Lista de atletas
- ✅ Gerenciamento de dados (contexts)

**Gerenciamento de Estado:**
- EventContext (eventos)
- ModalityContext (modalidades)
- ParticipantContext (escola/atletas/técnicos)
- AuthContext (autenticação)

**UI/UX:**
- Dark mode automático
- Toast notifications
- Loading states
- Error boundaries
- Formulários validados
- Busca de CEP

### ⏳ Em Desenvolvimento

- Formulário de atleta
- Páginas de eventos (produtor)
- Páginas de modalidades
- Rich Text Editor
- Exportação PDF/Excel

---

## 📁 Estrutura do Projeto

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── actions/          # Server Actions
│   │   ├── area-do-produtor/ # Área autenticada produtor
│   │   ├── area-do-participante/ # Área autenticada participante
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Login produtor
│   │   └── providers.tsx     # Context providers
│   ├── components/
│   │   ├── ui/               # ShadcnUI (26 componentes)
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── ParticipantSidebar.tsx
│   │   └── ParticipantHeader.tsx
│   ├── contexts/             # React Contexts (4)
│   ├── hooks/                # Custom hooks
│   └── lib/                  # Utilities
├── middleware.ts             # Route protection
├── tailwind.config.ts        # TailwindCSS config
└── package.json              # Dependencies
```

---

## 🛠️ Stack Tecnológica

### Core
- **Next.js** 16.0.8 (App Router)
- **React** 19.2.1
- **TypeScript** 5.x
- **Node.js** (ES Modules)

### Styling
- **TailwindCSS** 3.4.18
- **ShadcnUI** (Radix UI)
- **Lucide React** (ícones)
- **next-themes** (dark mode)

### Forms & Validation
- **React Hook Form** 7.x
- **Zod** 3.x

### State & Data
- React Context API
- LocalStorage (persistência)
- Server Actions
- Cookies (auth)

### Utilities
- **date-fns** (formatação datas)
- **Sonner** (toasts)
- **ViaCEP** (busca CEP)

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor dev (localhost:3000)

# Build
npm run build        # Compila para produção
npm run preview      # Preview do build

# Linting & Formatação
npm run lint         # Verifica código
npm run lint:fix     # Corrige problemas
npm run format       # Formata com Prettier
```

---

## 🗂️ Rotas Principais

### Públicas
- `/` - Login do produtor

### Produtor (Autenticado)
- `/area-do-produtor/inicio` - Dashboard
- `/area-do-produtor/eventos` - Eventos
- `/area-do-produtor/modalidades` - Modalidades

### Participante (Autenticado)
- `/area-do-participante/login` - Login
- `/area-do-participante/cadastro` - Cadastro
- `/area-do-participante/inicio` - Dashboard
- `/area-do-participante/escola` - Perfil da escola
- `/area-do-participante/atletas` - Lista de atletas

---

## 🔒 Autenticação

A autenticação é gerenciada via:
- **Server Actions** (`/src/app/actions/auth.ts`)
- **Cookies** (httpOnly, secure, sameSite)
- **Middleware** (`/middleware.ts`)

### Fluxo:
1. Login → Server Action valida credenciais
2. Se válido → Cria cookie de sessão
3. Middleware verifica cookie em cada request
4. Redireciona se não autenticado

---

## 💾 Persistência de Dados

Atualmente usando **LocalStorage** para:
- Eventos
- Modalidades
- Escola
- Atletas
- Técnicos
- Inscrições

**Fácil migrar para API/Banco de dados:**
1. Substituir `localStorage.getItem/setItem`
2. Por chamadas fetch/axios
3. Contexts já estão preparados

---

## 🎨 Temas e Estilos

### Dark Mode
- Automático (system preference)
- Toggle manual disponível
- Persistente via next-themes

### Design System
- TailwindCSS utility-first
- Componentes ShadcnUI
- Custom animations
- Responsive breakpoints

---

## 🐛 Troubleshooting

### Porta Ocupada
```bash
# MacOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
npx kill-port 3000
```

### Cache Issues
```bash
rm -rf .next
npm install
npm run dev
```

### TypeScript Errors
```bash
# Reiniciar VSCode
Cmd+Shift+P → "Reload Window"
```

---

## 📚 Documentação Adicional

- `MIGRATION_STATUS.md` - Progresso detalhado da migração
- `docs/` - Documentação do projeto original
- Código 100% comentado e tipado

---

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit mudanças (`git commit -m 'Add: nova feature'`)
4. Push para branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e confidencial.

---

## ✨ Características

- ✅ TypeScript 100%
- ✅ SSR + Client Components
- ✅ Server Actions (Next.js 15+)
- ✅ Protected Routes
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Form Validation (Zod)
- ✅ Toast Notifications
- ✅ Loading States
- ✅ Error Boundaries
- ✅ LocalStorage Persistence
- ✅ CEP Auto-complete

---

## 🎯 Roadmap

### Curto Prazo (1-2 semanas)
- [ ] Formulário de atletas
- [ ] Páginas de eventos (produtor)
- [ ] Páginas de modalidades
- [ ] Upload de imagens

### Médio Prazo (1 mês)
- [ ] Rich Text Editor (Tiptap)
- [ ] Exportação PDF/Excel
- [ ] Gráficos (Recharts)
- [ ] Integração com backend real

### Longo Prazo
- [ ] Testes automatizados (Jest)
- [ ] CI/CD Pipeline
- [ ] Deploy em produção
- [ ] Performance optimization

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique `MIGRATION_STATUS.md`
2. Consulte o código original em `/frontend-react/src/`
3. Entre em contato com o time de desenvolvimento

---

**Desenvolvido com ❤️ usando Next.js 16 + React 19**

**Última atualização:** 10 de Dezembro de 2025
