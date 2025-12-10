# Próximos Passos: Implementação Prática

## Status Atual ✅

**Fase 1: CONCLUÍDA**
- ✅ Análise completa da stack
- ✅ Mapeamento de 47+ rotas
- ✅ Classificação de 100+ componentes
- ✅ Análise de 83 dependências

**Fase 2: EM PROGRESSO (Documentação completa)**
- ✅ Guia de autenticação com cookies
- ✅ Guia de Server/Client Components
- ✅ Guia de migração TailwindCSS 4
- ⏳ Implementação prática pendente

---

## 🎯 Comandos para Executar AGORA

### Passo 1: Criar Projeto Next.js (5 min)

```bash
# Navegar para diretório pai
cd /Users/atilalavor/code/java/evento-esportivo/

# Criar novo projeto Next.js
npx create-next-app@latest frontend-nextjs \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack \
  --use-npm

# Aceitar todas as opções padrão quando perguntado
```

**Responder prompts:**
- Would you like to use TypeScript? → **Yes**
- Would you like to use ESLint? → **Yes**
- Would you like to use Tailwind CSS? → **Yes**
- Would you like to use `src/` directory? → **Yes**
- Would you like to use App Router? → **Yes**
- Would you like to customize the default import alias? → **No** (já configurado com @/*)

---

### Passo 2: Instalar Dependências Core (10 min)

```bash
cd frontend-nextjs

# Core: Forms & Validation
npm install @hookform/resolvers react-hook-form zod

# Core: Utilities
npm install class-variance-authority clsx tailwind-merge

# Themes
npm install next-themes

# Date utilities
npm install date-fns

# UI Utilities
npm install cmdk input-otp sonner vaul

# Carousel
npm install embla-carousel-react embla-carousel-autoplay

# Charts
npm install recharts

# PDF & Excel
npm install jspdf jspdf-autotable xlsx

# Icons
npm install lucide-react @heroicons/react

# Rich Text Editor (Tiptap)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-color \
  @tiptap/extension-font-family @tiptap/extension-link \
  @tiptap/extension-text-align @tiptap/extension-text-style
```

---

### Passo 3: Instalar Radix UI Components (5 min)

```bash
# Todos os componentes Radix UI usados no projeto
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio @radix-ui/react-avatar \
  @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-hover-card \
  @radix-ui/react-label @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu @radix-ui/react-popover \
  @radix-ui/react-progress @radix-ui/react-radio-group \
  @radix-ui/react-scroll-area @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slider \
  @radix-ui/react-slot @radix-ui/react-switch \
  @radix-ui/react-tabs @radix-ui/react-toast \
  @radix-ui/react-toggle @radix-ui/react-toggle-group \
  @radix-ui/react-tooltip
```

---

### Passo 4: Atualizar TailwindCSS para v4 (2 min)

```bash
# Atualizar Tailwind e dependências
npm install tailwindcss@latest postcss@latest autoprefixer@latest

# Plugins
npm install tailwindcss-animate@latest @tailwindcss/typography@latest

# DevDependencies
npm install --save-dev @types/jspdf
```

---

### Passo 5: Configurar shadcn-ui (15 min)

```bash
# Inicializar shadcn-ui
npx shadcn@latest init

# Responder prompts:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Instalar TODOS os componentes (um por um ou em lote)
npx shadcn@latest add accordion alert-dialog avatar badge breadcrumb \
  button calendar card carousel checkbox collapsible command \
  context-menu dialog drawer dropdown-menu form hover-card input \
  label menubar navigation-menu popover progress radio-group \
  resizable scroll-area select separator sheet sidebar slider sonner \
  switch table tabs textarea toast toggle toggle-group tooltip
```

---

### Passo 6: Copiar Configuração TailwindCSS (5 min)

```bash
# Abrir tailwind.config.ts do projeto Next.js
# Substituir TODO o conteúdo pelo código do guia:
# migration-docs/tailwind-v4-migration-guide.md (Seção 2)
```

**Arquivo a editar:** `frontend-nextjs/tailwind.config.ts`

**Copiar de:** `frontend-react/migration-docs/tailwind-v4-migration-guide.md`

---

### Passo 7: Copiar CSS Global (5 min)

```bash
# Copiar CSS variables do projeto atual
cp ../frontend-react/src/main.css ./src/app/globals.css

# Ajustar imports no topo:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

---

### Passo 8: Testar Build (2 min)

```bash
# Rodar servidor de desenvolvimento
npm run dev

# Abrir http://localhost:3000
# Verificar se página padrão do Next.js carrega
```

**Sucesso:**
- ✅ Servidor inicia sem erros
- ✅ Página abre no navegador
- ✅ Tailwind está funcionando

---

## 🔧 Estrutura de Arquivos Inicial

Após passos acima, você terá:

```
frontend-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home (será login)
│   │   ├── globals.css         # Estilos globais
│   │   └── favicon.ico
│   ├── components/
│   │   └── ui/                 # Componentes shadcn-ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       └── ... (35+ componentes)
│   ├── lib/
│   │   └── utils.ts            # Função cn() para classes
│   └── hooks/
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── public/
├── tailwind.config.ts          # Config TailwindCSS 4
├── tsconfig.json               # Config TypeScript
├── next.config.js              # Config Next.js
├── package.json
└── README.md
```

---

## 📝 Próximos Arquivos a Criar

### 1. Server Actions (Autenticação)

**Arquivo:** `src/app/actions/auth.ts`  
**Conteúdo:** Ver `migration-docs/auth-cookies-guide.md` (Seção 2)

```bash
mkdir -p src/app/actions
# Copiar código da seção 2 do guia
```

---

### 2. Middleware

**Arquivo:** `middleware.ts` (raiz do projeto, não em src/)  
**Conteúdo:** Ver `migration-docs/auth-cookies-guide.md` (Seção 3)

---

### 3. Contexts

**Diretório:** `src/contexts/`

```bash
mkdir -p src/contexts
```

Criar:
- `AuthContext.tsx` (ver guia, seção 4)
- `EventContext.tsx` (adaptar do projeto atual)
- `ModalityContext.tsx` (adaptar do projeto atual)
- `ThemeContext.tsx` (adaptar do projeto atual)
- `CommunicationContext.tsx` (adaptar do projeto atual)
- `ParticipantContext.tsx` (adaptar do projeto atual)

---

### 4. Providers Wrapper

**Arquivo:** `src/app/providers.tsx`  
**Conteúdo:** Ver `migration-docs/auth-cookies-guide.md` (depois da seção 4)

---

### 5. Root Layout

**Arquivo:** `src/app/layout.tsx` (substituir o existente)

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Gerador de Eventos Esportivos',
  description: 'Plataforma de gerenciamento de eventos esportivos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

---

### 6. Página de Login (Produtor)

**Arquivo:** `src/app/page.tsx` (substituir o existente)  
**Conteúdo:** Ver `migration-docs/auth-cookies-guide.md` (Seção 5)

---

## ⚡ Atalho: Script de Setup Automático

Criar arquivo `setup.sh` na raiz do `frontend-nextjs`:

```bash
#!/bin/bash

echo "🚀 Iniciando setup do projeto Next.js..."

# Instalar todas as dependências
echo "📦 Instalando dependências..."

npm install @hookform/resolvers react-hook-form zod \
  class-variance-authority clsx tailwind-merge \
  next-themes date-fns cmdk input-otp sonner vaul \
  embla-carousel-react embla-carousel-autoplay \
  recharts jspdf jspdf-autotable xlsx \
  lucide-react @heroicons/react \
  @tiptap/react @tiptap/starter-kit @tiptap/extension-color \
  @tiptap/extension-font-family @tiptap/extension-link \
  @tiptap/extension-text-align @tiptap/extension-text-style \
  @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio @radix-ui/react-avatar \
  @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-hover-card \
  @radix-ui/react-label @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu @radix-ui/react-popover \
  @radix-ui/react-progress @radix-ui/react-radio-group \
  @radix-ui/react-scroll-area @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slider \
  @radix-ui/react-slot @radix-ui/react-switch \
  @radix-ui/react-tabs @radix-ui/react-toast \
  @radix-ui/react-toggle @radix-ui/react-toggle-group \
  @radix-ui/react-tooltip \
  tailwindcss@latest postcss@latest autoprefixer@latest \
  tailwindcss-animate@latest @tailwindcss/typography@latest

npm install --save-dev @types/jspdf

echo "✅ Dependências instaladas!"

# Inicializar shadcn-ui
echo "🎨 Configurando shadcn-ui..."
npx shadcn@latest init -y

echo "📦 Instalando componentes shadcn-ui..."
npx shadcn@latest add accordion alert-dialog avatar badge breadcrumb \
  button calendar card carousel checkbox collapsible command \
  context-menu dialog drawer dropdown-menu form hover-card input \
  label menubar navigation-menu popover progress radio-group \
  scroll-area select separator sheet sidebar slider sonner \
  switch table tabs textarea toast toggle toggle-group tooltip -y

# Criar estrutura de diretórios
echo "📁 Criando estrutura de diretórios..."
mkdir -p src/app/actions
mkdir -p src/contexts
mkdir -p src/components/forms
mkdir -p src/hooks

echo "✨ Setup concluído!"
echo "📝 Próximos passos manuais:"
echo "   1. Copiar configuração TailwindCSS"
echo "   2. Criar Server Actions (auth.ts)"
echo "   3. Criar Middleware"
echo "   4. Criar Contexts"
echo "   5. Criar Providers"
echo "   6. Atualizar Root Layout"
echo "   7. Criar página de Login"
```

**Executar:**
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🎯 Resumo: O Que Fazer AGORA

### Imediato (30-45 min)
1. ✅ Criar projeto Next.js
2. ✅ Rodar script de setup OU instalar manualmente
3. ✅ Copiar TailwindCSS config
4. ✅ Testar `npm run dev`

### Hoje (2-3 horas)
5. ✅ Criar Server Actions (auth.ts)
6. ✅ Criar Middleware
7. ✅ Criar Contexts adaptados
8. ✅ Criar Providers wrapper
9. ✅ Atualizar Root Layout
10. ✅ Criar página de Login

### Esta Semana (Fase 3)
11. Criar estrutura de rotas (App Router)
12. Migrar páginas públicas
13. Migrar layouts
14. Testar autenticação

---

## 📊 Progresso Esperado

| Fase | Status | Tempo | Data Alvo |
|------|--------|-------|-----------|
| Fase 1: Análise | ✅ 100% | 1 dia | Concluído |
| Fase 2: Configuração | 🔄 40% | 1 dia | Hoje |
| Fase 3: Roteamento | ⏳ 0% | 5 dias | Próxima semana |
| Fase 4: Componentes | ⏳ 0% | 7 dias | Semana 3-4 |
| Fase 5: Dependências | ⏳ 0% | 2 dias | Semana 4 |
| Fase 6: Features | ⏳ 0% | 3 dias | Semana 5 |
| Fase 7: Otimizações | ⏳ 0% | 2 dias | Semana 5-6 |
| Fase 8: Testes | ⏳ 0% | 5 dias | Semana 6-7 |

**Total:** ~30 dias úteis (6 semanas)

---

**Documento criado em**: 10/12/2025  
**Status**: Fase 2 - Guias prontos, implementação pendente  
**Próximo passo**: Executar comandos de setup
