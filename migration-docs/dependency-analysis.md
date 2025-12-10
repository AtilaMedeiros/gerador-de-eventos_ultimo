# Análise de Dependências: React+Vite → Next.js

## Stack Atual vs Stack Alvo

| Categoria | Atual | Alvo | Ação |
|-----------|-------|------|------|
| **Framework** | React 19.2.0 + Vite | React 19.2.0 + Next.js ≥16.0.3 | Adicionar Next.js, remover Vite |
| **TypeScript** | 5.9.3 | 5.9.3 | Manter versão |
| **CSS** | TailwindCSS 3.4.18 | TailwindCSS ≥4.1.17 | **Upgrade (breaking changes)** |
| **UI Library** | shadcn-ui (Radix UI) | shadcn-ui ≥0.9.5 | Atualizar componentes |
| **Formulários** | React Hook Form + Zod | React Hook Form + Zod | Manter |
| **Gráficos** | Recharts | Recharts | Manter |
| **Ícones** | Lucide React | Lucide + Heroicons | Adicionar Heroicons |
| **Roteamento** | React Router DOM 6.30.2 | Next.js App Router | **Mudar completamente** |

---

## 1. Dependências a **MANTER**

Estas dependências são compatíveis com Next.js e serão mantidas:

### Core UI & Forms
```json
{
  "@hookform/resolvers": "^5.2.2",
  "react-hook-form": "^7.66.1",
  "zod": "^3.25.76",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0"
}
```

### Radix UI Components (todos compatíveis)
```json
{
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-alert-dialog": "^1.1.15",
  "@radix-ui/react-aspect-ratio": "^1.1.8",
  "@radix-ui/react-avatar": "^1.1.11",
  "@radix-ui/react-checkbox": "^1.3.3",
  "@radix-ui/react-collapsible": "^1.1.12",
  "@radix-ui/react-context-menu": "^2.2.16",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-hover-card": "^1.1.15",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-menubar": "^1.1.16",
  "@radix-ui/react-navigation-menu": "^1.2.14",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-progress": "^1.1.8",
  "@radix-ui/react-radio-group": "^1.3.8",
  "@radix-ui/react-scroll-area": "^1.2.10",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-separator": "^1.1.8",
  "@radix-ui/react-slider": "^1.3.6",
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-switch": "^1.2.6",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-toast": "^1.2.15",
  "@radix-ui/react-toggle": "^1.1.10",
  "@radix-ui/react-toggle-group": "^1.1.11",
  "@radix-ui/react-tooltip": "^1.2.8"
}
```

### Rich Text Editor
```json
{
  "@tiptap/react": "^3.13.0",
  "@tiptap/starter-kit": "^3.13.0",
  "@tiptap/extension-color": "^3.13.0",
  "@tiptap/extension-font-family": "^3.13.0",
  "@tiptap/extension-link": "^3.13.0",
  "@tiptap/extension-text-align": "^3.13.0",
  "@tiptap/extension-text-style": "^3.13.0"
}
```
**Nota**: Funciona com Next.js, mas componentes que usam Tiptap precisam de `'use client'`.

### Ícones
```json
{
  "lucide-react": "^0.552.0"
}
```
**Ação**: Manter + adicionar `@heroicons/react`.

### Utilities & Data
```json
{
  "date-fns": "^4.1.0",
  "cmdk": "^1.1.1",
  "input-otp": "^1.4.2",
  "sonner": "^2.0.7",
  "vaul": "^1.1.2"
}
```

### Carousel
```json
{
  "embla-carousel-react": "^8.6.0",
  "embla-carousel-autoplay": "^8.6.0"
}
```
**Compatível**, mas precisa de `'use client'`.

### Charts
```json
{
  "recharts": "^2.15.4"
}
```
**Compatível**, mas precisa de `'use client'`.

### PDF & Excel
```json
{
  "jspdf": "^3.0.4",
  "jspdf-autotable": "^5.0.2",
  "xlsx": "^0.18.5"
}
```
**Compatíveis**, mas precisam de `'use client'`.

### Legacy (remover eventualmente)
```json
{
  "react-quill": "^2.0.0",
  "react-icons": "^5.5.0"
}
```
**Nota**: `react-quill` parece não estar sendo usado (Tiptap está ativo). Verificar e remover. `react-icons` também pode ser removido se usar apenas Lucide + Heroicons.

---

## 2. Dependências a **REMOVER**

### Vite & Build Tools
```json
{
  "vite": "npm:rolldown-vite@^7.2.5",
  "@vitejs/plugin-react": "^5.1.1"
}
```
**Ação**: Remover. Next.js tem seu próprio bundler.

### React Router
```json
{
  "react-router-dom": "^6.30.2"
}
```
**Ação**: Remover. Next.js App Router substitui completamente.

### Resizable Panels (se não usado)
```json
{
  "react-resizable-panels": "^3.0.6"
}
```
**Ação**: Verificar uso. Se não usado, remover.

---

## 3. Dependências a **ATUALIZAR**

### TailwindCSS (Breaking Changes!)
```json
// Atual
{
  "tailwindcss": "^3.4.18",
  "@tailwindcss/typography": "^0.5.19",
  "@tailwindcss/aspect-ratio": "^0.4.2"
}

// Alvo
{
  "tailwindcss": "^4.1.17",
  "@tailwindcss/typography": "@next", // verificar compatibilidade v4
  // @tailwindcss/aspect-ratio pode ser descontinuado na v4
}
```

**Breaking Changes TailwindCSS 3→4**:
- Nova sintaxe de configuração (opcional CSS ao invés de JS)
- Alguns plugins podem ter mudado
- Performance melhorada
- Verificar se `tailwindcss-animate` é compatível

### shadcn-ui
```json
{
  "shadcn-ui": "^0.9.5"
}
```
**Nota**: shadcn-ui não é instalado como pacote npm. Os componentes são copiados para o projeto. Precisaremos reinstalar todos via CLI.

### next-themes
```json
{
  "next-themes": "^0.4.6"
}
```
**Ação**: Manter e garantir configuração correta no Next.js.

---

## 4. Dependências a **ADICIONAR**

### Next.js
```bash
npm install next@latest
```

### Heroicons
```bash
npm install @heroicons/react
```

### TypeScript Types para Next.js
```bash
npm install --save-dev @types/node
```

### Opcional: Axios (se precisar fazer requests)
Se decidir usar Server Components com fetch de dados:
```bash
npm install axios
```

---

## 5. DevDependencies

### Manter
```json
{
  "@types/node": "^24.10.1",
  "@types/react": "^19.2.6",
  "@types/react-dom": "^19.2.3",
  "autoprefixer": "^10.4.22",
  "postcss": "^8.5.6",
  "prettier": "3.6.2",
  "typescript": "^5.9.3"
}
```

### Adicionar (Next.js específico)
```bash
npm install --save-dev @next/bundle-analyzer
```

### Remover ou Substituir

#### ESLint Config
```json
// Remover
{
  "@eslint/js": "^9.39.1",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^6.1.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "typescript-eslint": "^8.47.0"
}

// Adicionar (Next.js já configura ESLint)
{
  "eslint": "^8",
  "eslint-config-next": "latest"
}
```

#### Oxlint (opcional)
```json
{
  "oxlint": "^1.29.0"
}
```
**Ação**: Pode manter se quiser linting extra rápido, ou remover e usar apenas ESLint do Next.js.

---

## 6. Verificação de Compatibilidade

### ✅ Totalmente Compatível

| Dependência | Versão Atual | Status | Notas |
|-------------|--------------|--------|-------|
| React | 19.2.0 | ✅ | Next.js 16 suporta React 19 |
| TypeScript | 5.9.3 | ✅ | Totalmente compatível |
| Radix UI | Variadas | ✅ | Todos os componentes funcionam |
| React Hook Form | 7.66.1 | ✅ | Funciona perfeitamente |
| Zod | 3.25.76 | ✅ | Funciona perfeitamente |
| date-fns | 4.1.0 | ✅ | Server e client safe |
| Recharts | 2.15.4 | ✅ | Client component |
| jspdf | 3.0.4 | ✅ | Client component |
| xlsx | 0.18.5 | ✅ | Client component |

### ⚠️ Requer Ajustes

| Dependência | Versão | Issue | Solução |
|-------------|--------|-------|---------|
| TailwindCSS | 3.4.18 | Breaking changes na v4 | Seguir guia de migração |
| tailwindcss-animate | 1.0.7 | Verificar compatibilidade v4 | Testar após upgrade |
| @tailwindcss/typography | 0.5.19 | Pode ter breaking changes | Atualizar junto com Tailwind |
| @tiptap/react | 3.13.0 | Client-only | Marcar componentes com 'use client' |

### ❌ Incompatível / Remover

| Dependência | Motivo | Substituição |
|-------------|--------|--------------|
| react-router-dom | Next.js tem roteamento próprio | Next.js App Router |
| vite | Next.js usa bundler próprio | Next.js built-in |
| @vitejs/plugin-react | Específico do Vite | Não necessário |

---

## 7. Comandos de Instalação

### Passo 1: Criar novo projeto Next.js
```bash
cd /Users/atilalavor/code/java/evento-esportivo/
mkdir frontend-nextjs
cd frontend-nextjs
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

### Passo 2: Instalar dependências mantidas
```bash
# Core
npm install @hookform/resolvers react-hook-form zod
npm install class-variance-authority clsx tailwind-merge

# Radix UI (todos)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio
npm install @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible
npm install @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar
npm install @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress
npm install @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select
npm install @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot
npm install @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast
npm install @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

# Tiptap
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-color
npm install @tiptap/extension-font-family @tiptap/extension-link
npm install @tiptap/extension-text-align @tiptap/extension-text-style

# Ícones
npm install lucide-react @heroicons/react

# Utilities
npm install date-fns cmdk input-otp sonner vaul next-themes

# Carousel
npm install embla-carousel-react embla-carousel-autoplay

# Charts
npm install recharts

# PDF & Excel
npm install jspdf jspdf-autotable xlsx
npm install --save-dev @types/jspdf
```

### Passo 3: Instalar shadcn-ui
```bash
npx shadcn@latest init
# Seguir prompts interativos

# Instalar todos os componentes usados
npx shadcn@latest add accordion alert-dialog aspect-ratio avatar button card
npx shadcn@latest add checkbox collapsible command context-menu dialog
npx shadcn@latest add dropdown-menu form hover-card input label menubar
npx shadcn@latest add navigation-menu popover progress radio-group scroll-area
npx shadcn@latest add select separator sheet sidebar slider sonner switch
npx shadcn@latest add table tabs textarea toast toggle toggle-group tooltip
```

### Passo 4: Atualizar TailwindCSS para v4
```bash
npm install tailwindcss@latest postcss@latest autoprefixer@latest
npm install tailwindcss-animate@latest
npm install @tailwindcss/typography@latest
```

### Passo 5: DevDependencies
```bash
npm install --save-dev @next/bundle-analyzer
npm install --save-dev eslint-config-next
```

---

## 8. Verificação de package.json Final

```json
{
  "name": "gerador-eventos-nextjs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write ."
  },
  "dependencies": {
    "next": "^16.0.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    
    "@hookform/resolvers": "^5.2.2",
    "react-hook-form": "^7.66.1",
    "zod": "^3.25.76",
    
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    
    "@tiptap/react": "^3.13.0",
    "@tiptap/starter-kit": "^3.13.0",
    "@tiptap/extension-color": "^3.13.0",
    "@tiptap/extension-font-family": "^3.13.0",
    "@tiptap/extension-link": "^3.13.0",
    "@tiptap/extension-text-align": "^3.13.0",
    "@tiptap/extension-text-style": "^3.13.0",
    
    "lucide-react": "^0.552.0",
    "@heroicons/react": "^2.1.0",
    
    "date-fns": "^4.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "cmdk": "^1.1.1",
    "input-otp": "^1.4.2",
    "sonner": "^2.0.7",
    "vaul": "^1.1.2",
    "next-themes": "^0.4.6",
    
    "embla-carousel-react": "^8.6.0",
    "embla-carousel-autoplay": "^8.6.0",
    
    "recharts": "^2.15.4",
    
    "jspdf": "^3.0.4",
    "jspdf-autotable": "^5.0.2",
    "xlsx": "^0.18.5",
    
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.6",
    "@types/react-dom": "^19.2.3",
    "@types/jspdf": "^2.0.0",
    
    "typescript": "^5.9.3",
    
    "tailwindcss": "^4.1.17",
    "@tailwindcss/typography": "^0.5.19",
    "postcss": "^8.5.6",
    "autoprefixer": "^10.4.22",
    
    "eslint": "^8",
    "eslint-config-next": "latest",
    
    "prettier": "^3.6.2",
    
    "@next/bundle-analyzer": "^16.0.3"
  }
}
```

---

## 9. Checklist de Ações

### Análise
- [x] Listar todas as dependências atuais
- [x] Classificar (manter/remover/atualizar/adicionar)
- [x] Verificar compatibilidade com Next.js
- [x] Identificar breaking changes

### Instalação
- [ ] Criar novo projeto Next.js
- [ ] Instalar dependências mantidas
- [ ] Atualizar TailwindCSS para v4
- [ ] Reinstalar shadcn-ui components
- [ ] Adicionar Heroicons
- [ ] Verificar package.json final
- [ ] Testar build inicial

### Verificação
- [ ] Todas as dependências instaladas
- [ ] Sem conflitos de versão
- [ ] Build Next.js funciona
- [ ] ESLint configurado
- [ ] Prettier configurado
- [ ] TypeScript sem erros

---

## 10. Riscos e Mitigações

### Risco 1: TailwindCSS 4 Breaking Changes
**Impacto**: Alto  
**Probabilidade**: Alta  
**Mitigação**: 
- Ler documentação de upgrade oficial
- Testar configuração customizada (keyframes, colors)
- Manter v3 como fallback temporário

### Risco 2: Plugins TailwindCSS Incompatíveis
**Impacto**: Médio  
**Probabilidade**: Média  
**Mitigação**:
- Verificar cada plugin individualmente
- Buscar alternativas se necessário
- Alguns utilitários podem ser reimplementados

### Risco 3: Conflitos de Versão
**Impacto**: Médio  
**Probabilidade**: Baixa  
**Mitigação**:
- Usar `npm ls` para verificar árvore de dependências
- Resolver peer dependency warnings
- Usar `--legacy-peer-deps` apenas se necessário

---

**Documento criado em**: 10/12/2025  
**Status**: Fase 1 - Preparação  
**Próximo passo**: Configuração inicial do Next.js
