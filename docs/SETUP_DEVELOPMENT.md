# Guia de Setup e Desenvolvimento

**Versão**: 0.0.48  
**Data**: Dezembro 2025

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação do Projeto](#instalação-do-projeto)
3. [Estrutura de Scripts](#estrutura-de-scripts)
4. [Desenvolvimento Local](#desenvolvimento-local)
5. [Build e Deploy](#build-e-deploy)
6. [Configurações](#configurações)
7. [Troubleshooting](#troubleshooting)
8. [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)

---

## 🔧 Pré-requisitos

### Obrigatório

- **Node.js** >= 18.0.0  
  - Verificar: `node --version`
  - Download: https://nodejs.org

- **npm** >= 9.0.0 (vem com Node.js)  
  - Verificar: `npm --version`

- **Git** (para versionamento)  
  - Verificar: `git --version`

### Recomendado

- **VS Code** com extensões:
  - `ES7+ React/Redux/React-Native snippets`
  - `Tailwind CSS IntelliSense`
  - `Prettier - Code formatter`
  - `ESLint`
  - `TypeScript Vue Plugin`

- **pnpm** (alternativa mais rápida ao npm)
  ```bash
  npm install -g pnpm@latest
  ```

---

## 💻 Instalação do Projeto

### 1. Clone o repositório

```bash
git clone <repository-url>
cd gerador-de-eventos
```

### 2. Instale as dependências

```bash
# Com npm (padrão)
npm install

# Ou com pnpm (recomendado - mais rápido)
pnpm install
```

### 3. Verifique a instalação

```bash
# Verificar node_modules
ls node_modules | head -10

# Verificar dependências críticas
npm list react react-router-dom tailwindcss
```

### 4. Inicialize git hooks (opcional)

```bash
# Se houver husky ou pre-commit hooks
npm run prepare
```

---

## 🚀 Estrutura de Scripts

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
# ou
npm start

# Porta: http://localhost:8080
# Hot Module Replacement (HMR) ativado automaticamente
```

### Build

```bash
# Build para produção (minificado, otimizado)
npm run build

# Gera: dist/ (pronto para deploy)

# Build para desenvolvimento (com sourcemaps)
npm run build:dev

# Preview da build (serve os arquivos)
npm run preview
```

### Qualidade de Código

```bash
# Linting com Oxlint (muito rápido)
npm run lint

# Linting com auto-fix
npm run lint:fix

# Formatação com Prettier
npm run format

# Testes (atualmente: echo)
npm test
npm run test:watch
```

---

## 🛠️ Desenvolvimento Local

### Estrutura do Servidor de Dev

```
http://localhost:8080
│
├── / (página principal)
│
├── /area-do-produtor/
│   ├── inicio (dashboard)
│   ├── cadastro-basico/evento (lista eventos)
│   └── ...
│
├── /area-do-participante/
│   ├── login
│   ├── inicio
│   └── ...
│
└── /evento/:slug/:id (público)
```

### Hot Module Replacement (HMR)

O Vite tem HMR automático. Qualquer alteração em `src/` atualiza o navegador instantaneamente sem reload completo.

```tsx
// Exemplo: Editar componente
// src/components/Button.tsx

// ANTES:
export function Button() {
  return <button>Clique</button>
}

// DEPOIS:
export function Button() {
  return <button className="bg-blue-500">Clique</button>
}

// ✨ Navegador atualiza em ~100ms sem perder estado
```

### Debugging

#### 1. Console do Navegador

```tsx
// No seu código
console.log('Variável:', myVariable)
console.warn('Aviso:', warning)
console.error('Erro:', error)

// Abrir DevTools: F12 ou Cmd+Option+I
```

#### 2. React DevTools (Extensão)

```bash
# Instale em Chrome/Firefox
# React Developer Tools (Facebook)

# Inspecionar componentes, props, estado
```

#### 3. Source Maps (Vite)

Em desenvolvimento, o Vite gera source maps automaticamente. Você pode:

- Colocar breakpoints no código original (não compilado)
- Inspecionar variáveis
- Step through código

```javascript
// DevTools → Sources → Encontre seu arquivo .tsx
// Clique no número da linha para breakpoint
```

#### 4. localStorage Inspector

```javascript
// Verificar dados salvos
Object.keys(localStorage)

// Ver conteúdo
JSON.parse(localStorage.getItem('ge_events'))

// Limpar tudo
localStorage.clear()
```

### Trabalhar com Contextos

```tsx
// Para debugar contexto, adicione em seu componente:
const { events } = useEvent()
console.log('Events do context:', events)

// Ou use React DevTools → Components → procure por Provider
```

---

## 🏗️ Build e Deploy

### Build para Produção

```bash
npm run build
```

**Resultado**: Pasta `dist/` pronta para deploy

```
dist/
├── index.html          (entry point)
├── assets/
│   ├── index-xxx.js    (bundled JS)
│   ├── index-xxx.css   (bundled CSS)
│   └── [outros chunks]
└── [static files]
```

### Verificar Build Localmente

```bash
npm run preview

# Acesse: http://localhost:4173
# Simula a build de produção
```

### Otimizações Automáticas

O Vite aplica automaticamente:
- ✅ Minificação JavaScript (uglify)
- ✅ Minificação CSS
- ✅ Tree-shaking (remove código não usado)
- ✅ Code splitting automático
- ✅ Gzip compression (no servidor)

### Requisitos de Deploy

#### Opção 1: Hosting Estático (Recomendado)

Plataformas: Vercel, Netlify, GitHub Pages, AWS S3 + CloudFront

```bash
# Vercel (mais simples)
npm i -g vercel
vercel

# Netlify
npm run build
# Drag & drop pasta dist/ no netlify.com

# GitHub Pages
npm run build
# Push dist/ para branch gh-pages
```

#### Opção 2: Servidor Node.js

```javascript
// server.js
import express from 'express'
import path from 'path'

const app = express()
const dist = path.resolve('./dist')

app.use(express.static(dist))

app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(3000)
```

```bash
npm run build
node server.js
```

---

## ⚙️ Configurações

### vite.config.ts

```typescript
export default defineConfig(({ mode }) => ({
  server: {
    host: '::', // Listen IPv6 + IPv4
    port: 8080,
  },
  build: {
    minify: mode !== 'development',
    sourcemap: mode === 'development',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
```

**Alias `@`**: Permite imports relativos

```tsx
// ✅ Preferir
import { Button } from '@/components/ui/button'

// ❌ Evitar
import { Button } from '../../../components/ui/button'
```

### tailwind.config.ts

```typescript
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary))',
      },
    },
  },
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,            // Requer tipagem completa
    "jsx": "react-jsx",        // React 19 novo JSX
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]          // Alias
    }
  }
}
```

### .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

### .oxlintrc.json

```json
{
  "rules": {
    "react/jsx-key": "error",
    "react/no-array-index-key": "warn"
  }
}
```

---

## 🐛 Troubleshooting

### Porta 8080 já em uso

```bash
# Encontrar processo usando porta
lsof -i :8080

# Matar processo (macOS/Linux)
kill -9 <PID>

# Ou usar outra porta
npm run dev -- --port 3000
```

### Erro: "Cannot find module '@/components/..."

```bash
# Verificar se @ alias está em vite.config.ts e tsconfig.json
# Reiniciar servidor Dev (Ctrl+C, depois npm run dev)

# Limpar cache (extremo)
rm -rf node_modules
rm package-lock.json
npm install
```

### localStorage não persiste

```typescript
// Verificar se está em navegador (não SSR)
if (typeof window !== 'undefined') {
  localStorage.setItem('key', JSON.stringify(data))
}

// Navegador em incognito bloqueia localStorage
// Usar IndexedDB como fallback em produção
```

### Build muito grande (> 500KB)

```bash
# Analisar tamanho
npm install -D vite-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'vite-plugin-visualizer'

export default {
  plugins: [visualizer()]
}
```

### Componente Shadcn não funciona

```bash
# Reinstalar Shadcn
npm install radix-ui eslint-plugin-react-hooks

# Verificar imports em components/ui/
# Deve ter (copy-paste from shadcn docs)
```

---

## 📝 Padrões de Desenvolvimento

### Git Workflow

```bash
# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer alterações
# 3. Commit
git add .
git commit -m "feat: descrever alteração"

# 4. Push
git push origin feature/nova-funcionalidade

# 5. Pull Request no GitHub
# 6. Merge após review
```

### Tipos de Commit

```
feat:     Nova funcionalidade
fix:      Correção de bug
refactor: Reestruturação sem alterar comportamento
style:    Formatação/estilo
docs:     Documentação
test:     Testes
chore:    Tarefas (dependências, build)
```

### Estrutura de Features

```typescript
// Criar nova página: src/pages/MyNewPage.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function MyNewPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/" />
  }
  
  return (
    <div>
      {/* Conteúdo */}
    </div>
  )
}
```

### Importar Componente Novo em App.tsx

```tsx
// src/App.tsx

import MyNewPage from './pages/MyNewPage'

// Adicionar rota
<Route path="/my-path" element={<MyNewPage />} />
```

### Testar Nova Página

```bash
npm run dev

# Abra http://localhost:8080/my-path
# Verifique console para erros
# Teste funcionalidades
```

### Submeter para Produção

```bash
# 1. Verificar tudo está funcionando
npm run lint
npm run build
npm run preview

# 2. Commit final
git add .
git commit -m "release: versão 0.0.49"

# 3. Push
git push origin main

# 4. Deploy automático (se CI/CD configurado)
# ou manualmente para Vercel/Netlify
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Shadcn UI](https://ui.shadcn.com/)

### Ferramentas Recomendadas

- **VS Code**: Melhor editor
- **Thunder Client**: Testar APIs (quando tiver backend)
- **React DevTools**: Debugar componentes
- **Redux DevTools**: Debugar estado (futuro)

---

**Documento elaborado em**: Dezembro 2025  
**Próxima revisão**: Q1 2026
