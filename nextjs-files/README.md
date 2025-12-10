# 🚀 Setup do Projeto Next.js - Gerador de Eventos

## Arquivos Prontos para Copiar

Esta pasta contém todos os arquivos necessários para iniciar o projeto Next.js migrado.

---

## 📋 Passo a Passo de Instalação

### 1. Criar Projeto Next.js (5 min)

```bash
# Navegar para o diretório pai
cd /Users/atilalavor/code/java/evento-esportivo/

# Criar novo projeto Next.js
npx create-next-app@latest frontend-nextjs \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm

# Responder aos prompts:
# - TypeScript: Yes
# - ESLint: Yes  
# - Tailwind CSS: Yes
# - src/ directory: Yes
# - App Router: Yes
# - Turbopack: No
# - Customize import alias: No
```

---

### 2. Executar Script de Setup (10 min)

```bash
cd frontend-nextjs

# Copiar e executar script de instalação
cp ../frontend-react/nextjs-files/setup.sh ./
chmod +x setup.sh
./setup.sh
```

**O script irá:**
- ✅ Instalar todas as dependências (60+ pacotes)
- ✅ Atualizar TailwindCSS para v4
- ✅ Inicializar shadcn-ui
- ✅ Instalar todos os componentes shadcn-ui
- ✅ Criar estrutura de diretórios

---

### 3. Copiar Arquivos de Configuração (2 min)

```bash
# Ainda no diretório frontend-nextjs

# Copiar TailwindCSS config
cp ../frontend-react/nextjs-files/tailwind.config.ts ./

# Copiar Middleware
cp ../frontend-react/nextjs-files/middleware.ts ./
```

---

### 4. Copiar Arquivos da Aplicação (5 min)

```bash
# Copiar Server Actions
cp ../frontend-react/nextjs-files/app/actions/auth.ts ./src/app/actions/

# Copiar Contexts
mkdir -p ./src/contexts
cp ../frontend-react/nextjs-files/contexts/AuthContext.tsx ./src/contexts/

# Copiar App files
cp ../frontend-react/nextjs-files/app/providers.tsx ./src/app/
cp ../frontend-react/nextjs-files/app/layout.tsx ./src/app/
cp ../frontend-react/nextjs-files/app/page.tsx ./src/app/

# Copiar página do Dashboard
mkdir -p ./src/app/area-do-produtor/inicio
cp ../frontend-react/nextjs-files/app/area-do-produtor/inicio/page.tsx ./src/app/area-do-produtor/inicio/
```

---

### 5. Copiar CSS Global (3 min)

```bash
# Copiar CSS do projeto atual
cp ../frontend-react/src/main.css ./src/app/globals.css
```

**Depois, editar `./src/app/globals.css` e garantir que o topo tenha:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Resto do CSS... */
```

---

### 6. Testar o Projeto (1 min)

```bash
npm run dev
```

**Abrir:** http://localhost:3000

**Você deverá ver:**
- ✅ Página de login do produtor
- ✅ Estilo bonito (TailwindCSS funcionando)
- ✅ Formulário com validação

**Testar login:**
- Email: `produtor@teste.com`
- Senha: qualquer texto (mínimo 6 caracteres)

**Após login:**
- ✅ Redireciona para `/area-do-produtor/inicio`
- ✅ Dashboard aparece
- ✅ Botão de logout funciona

---

## 📁 Estrutura Final

```
frontend-nextjs/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── auth.ts              ✅ Server Actions
│   │   ├── area-do-produtor/
│   │   │   └── inicio/
│   │   │       └── page.tsx         ✅ Dashboard
│   │   ├── layout.tsx               ✅ Root Layout
│   │   ├── page.tsx                 ✅ Login Produtor
│   │   ├── providers.tsx            ✅ Client Providers
│   │   └── globals.css              ✅ Estilos globais
│   ├── components/
│   │   └── ui/                      ✅ 35+ componentes shadcn
│   ├── contexts/
│   │   └── AuthContext.tsx          ✅ Context de Auth
│   ├── lib/
│   │   └── utils.ts                 ✅ Utilities
│   └── hooks/
│       ├── use-mobile.tsx           ✅ Hook mobile
│       └── use-toast.ts             ✅ Hook toast
├── middleware.ts                    ✅ Proteção de rotas
├── tailwind.config.ts               ✅ Config Tailwind 4
├── next.config.ts                   ✅ Config Next.js
├── tsconfig.json                    ✅ Config TypeScript
└── package.json                     ✅ Dependências

```

---

## ✅ Checklist de Verificação

Após instalação, verificar:

### Build e Servidor
- [ ] `npm run dev` funciona sem erros
- [ ] http://localhost:3000 abre
- [ ] Console sem erros críticos

### Autenticação
- [ ] Página de login renderiza
- [ ] Formulário valida campos
- [ ] Login com `produtor@teste.com` funciona
- [ ] Redireciona para `/area-do-produtor/inicio`
- [ ] Dashboard aparece com nome do usuário
- [ ] Logout funciona e volta para login

### Middleware
- [ ] Tentar acessar `/area-do-produtor/inicio` sem login → redireciona para `/`
- [ ] Após login, tentar acessar `/` → redireciona para dashboard

### Estilos
- [ ] TailwindCSS está aplicando estilos
- [ ] Dark mode funciona (se houver toggle)
- [ ] Componentes shadcn-ui renderizam corretamente
- [ ] Gradients e sombras aparecem

---

## 🎯 Próximos Passos

Após tudo funcionando:

1. **Migrar mais páginas** (seguir `migration-docs/route-mapping.md`)
2. **Criar API routes** se necessário
3. **Implementar banco de dados** (Supabase/Firebase/Prisma)
4. **Migrar componentes** do projeto antigo
5. **Adicionar feature ViaCEP**

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/components/ui/button'"

**Solução:**
```bash
npx shadcn@latest add button
```

### Erro: "Module not found: Can't resolve 'tailwindcss-animate'"

**Solução:**
```bash
npm install tailwindcss-animate
```

### Erro: Estilos não aplicam

**Solução:**
1. Verificar se `@tailwind` directives estão no topo do `globals.css`
2. Reiniciar dev server: `Ctrl+C` e `npm run dev`
3. Limpar cache: `rm -rf .next`

### Login não funciona

**Solução:**
1. Verificar console do navegador para erros
2. Verificar se Server Actions estão em `src/app/actions/auth.ts`
3. Verificar se middleware está na raiz (não em `src/`)

---

## 📊 Comparação: Antes vs Depois

| Aspecto | React + Vite | Next.js 16 |
|---------|--------------|------------|
| **Autenticação** | localStorage | Cookies httpOnly ✅ |
| **Roteamento** | React Router | App Router ✅ |
| **Renderização** | Client-side only | Server + Client ✅ |
| **SEO** | Ruim | Excelente ✅ |
| **Build Time** | ~5s | ~2s ✅ |
| **Bundle Size** | Grande | Otimizado ✅ |
| **Security** | Vulnerável (XSS) | Seguro ✅ |

---

## 🎉 Sucesso!

Se você chegou até aqui e tudo está funcionando:

**🎊 PARABÉNS! 🎊**

Você migrou com sucesso para:
- ✅ Next.js 16+ com App Router
- ✅ Autenticação com cookies httpOnly
- ✅ TailwindCSS 4
- ✅ Server Components otimizados
- ✅ Middleware de proteção de rotas

**Próxima fase:** Migrar as demais rotas e componentes! 🚀

---

**Documento criado em**: 10/12/2025  
**Tempo estimado de setup**: 25-30 minutos  
**Dificuldade**: Média
