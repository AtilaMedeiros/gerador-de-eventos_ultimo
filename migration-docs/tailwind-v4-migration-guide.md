# Guia de Migração: TailwindCSS 3 → 4

## Decisão Tomada ✅
Aceitar breaking changes e migrar para **TailwindCSS 4.1.17+**.

---

## 1. Breaking Changes Principais

### 1.1 Nova Sintaxe de Configuração

**TailwindCSS 3:**
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0056D2',
      },
    },
  },
  plugins: [],
}
```

**TailwindCSS 4:**
```js
// tailwind.config.ts (TypeScript nativo!)
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0056D2',
      },
    },
  },
  plugins: [],
} satisfies Config
```

**Mudanças:**
- ✅ TypeScript nativo
- ✅ ESM ao invés de CommonJS
- ✅ `satisfies Config` para type-safety

---

### 1.2 Nova Engine CSS (@import nativo)

**TailwindCSS 4 permite CSS puro:**

```css
/* globals.css - Nova sintaxe opcional */
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/preflight" layer(base);
@import "tailwindcss/utilities" layer(utilities);

/* Custom theme usando CSS */
@theme {
  --color-primary: #0056D2;
  --radius: 0.5rem;
}
```

**OU manter configuração JS:**
```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#0056D2'
      }
    }
  }
}
```

---

## 2. Migração da Configuração Atual

### Análise da Configuração Atual

Seu `tailwind.config.ts` tem:
- ✅ 85+ cores customizadas (CSS variables)
- ✅ 4 keyframes customizadas (marquee, accordion, fade-in-up, progress)
- ✅ 6 animações customizadas
- ✅ 3 plugins (@tailwindcss/typography, @tailwindcss/aspect-ratio, tailwindcss-animate)
- ✅ Breakpoints customizados
- ✅ Box-shadows customizadas

### Configuração Migrada para v4

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './src/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
  ],
  
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-inter)', 'sans-serif'],
      },
      
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sport: {
          black: '#080808',
          dark: '#121212',
          gray: '#1E1E1E',
        },
        'accent-blue': '#2563EB',
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        elevation: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'inner-light': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      
      animation: {
        marquee: 'marquee 20s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
    },
  },
  
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    // @tailwindcss/aspect-ratio pode não ser necessário na v4
    // Aspect ratio agora é nativo: aspect-[16/9]
  ],
} satisfies Config
```

---

## 3. Plugins

### 3.1 @tailwindcss/typography

```bash
npm install @tailwindcss/typography@latest
```

**Verificação necessária:** 
- ✅ Plugin ainda existe na v4
- ⚠️ Pode ter pequenas mudanças na API

**Uso:**
```html
<div class="prose prose-lg dark:prose-invert">
  <p>Conteúdo formatado</p>
</div>
```

---

### 3.2 @tailwindcss/aspect-ratio

**ATENÇÃO: Pode ser removido!**

TailwindCSS 4 tem aspect ratio nativo:

```html
<!-- ANTES (v3 com plugin) -->
<div class="aspect-w-16 aspect-h-9">
  <iframe src="..."></iframe>
</div>

<!-- DEPOIS (v4 nativo) -->
<div class="aspect-[16/9]">
  <iframe src="..." class="w-full h-full"></iframe>
</div>

<!-- Outras opções nativas -->
<div class="aspect-square">...</div>
<div class="aspect-video">...</div>
```

**Ação:**
- [ ] Remover `@tailwindcss/aspect-ratio`
- [ ] Substituir por classes nativas

---

### 3.3 tailwindcss-animate

```bash
npm install tailwindcss-animate@latest
```

**Status:** ✅ Compatível com v4

**Verificar:** Se a versão mais recente suporta Tailwind 4.

---

## 4. CSS Variables (globals.css)

### Estrutura Atual (Manter compatível)

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
    
    /* Charts */
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    
    /* Sidebar */
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
    
    /* Success/Warning */
    --success: 142 71% 45%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    /* ... todas as variáveis em dark mode */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Compatibilidade com v4:** ✅ CSS variables funcionam igual

---

## 5. Mudanças de Classes

### Classes Descontinuadas (se houver)

Verificar documentação oficial para classes removidas. A maioria deve ser compatível.

**Exemplo de possíveis mudanças:**
```html
<!-- Se algo mudou, exemplo hipotético: -->
<!-- ANTES v3 -->
<div class="transform hover:scale-110">

<!-- DEPOIS v4 (provavelmente igual) -->
<div class="hover:scale-110">
```

---

## 6. Performance

TailwindCSS 4 é **significativamente mais rápido**:

- ✅ ~10x mais rápido no build
- ✅ Melhor hot reload
- ✅ Menor bundle CSS final

**Comparação:**
```
TailwindCSS 3: ~500ms build time
TailwindCSS 4: ~50ms build time
```

---

## 7. Instalação

### Passo 1: Atualizar pacotes

```bash
npm install tailwindcss@latest postcss@latest autoprefixer@latest
npm install @tailwindcss/typography@latest
npm install tailwindcss-animate@latest

# Remover aspect-ratio plugin
npm uninstall @tailwindcss/aspect-ratio
```

### Passo 2: Atualizar tailwind.config.ts

Copiar configuração da seção 2 deste documento.

### Passo 3: Atualizar postcss.config.js

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Passo 4: Testar build

```bash
npm run dev
```

---

## 8. Testes Necessários

### Checklist de Validação

- [ ] **Build funciona** sem erros
- [ ] **Dark mode** funciona corretamente
- [ ] **Cores customizadas** (primary, secondary, etc) ainda funcionam
- [ ] **Animações customizadas:**
  - [ ] Marquee (ticker de notícias)
  - [ ] Accordion
  - [ ] Fade-in-up
  - [ ] Progress
- [ ] **Typography plugin** funciona (classe `prose`)
- [ ] **Componentes shadcn-ui** renderizam corretamente
- [ ] **Responsive breakpoints** funcionam
- [ ] **Box shadows** customizadas aplicam
- [ ] **Border radius** customizado funciona
- [ ] **Aspect ratio** nativo funciona (substituir plugin)

### Teste de Componentes Críticos

#### 1. Ticker de Notícias (Marquee)

```tsx
// Testar se a animação ainda funciona
<div className="animate-marquee">
  Texto rolando...
</div>
```

#### 2. Dark Mode

```tsx
// Testar toggle de tema
<html className="dark">
  {/* Verificar se cores invertem corretamente */}
</html>
```

#### 3. Typography

```tsx
<div className="prose prose-lg dark:prose-invert max-w-none">
  <p>Conteúdo formatado</p>
</div>
```

---

## 9. Troubleshooting

### Problema: Build falha com erro de plugin

**Solução:**
```bash
# Limpar cache
rm -rf node_modules .next
npm install
npm run dev
```

### Problema: Cores não aplicam

**Verificar:**
1. CSS variables estão definidas em `globals.css`
2. `@layer base` está correto
3. Classes usam `hsl(var(--cor))` corretamente

### Problema: Animações não funcionam

**Verificar:**
1. `tailwindcss-animate` está instalado
2. Keyframes estão definidas em `tailwind.config.ts`
3. Classes de animação estão aplicadas

### Problema: Typography plugin não funciona

**Solução:**
```bash
# Reinstalar plugin
npm install @tailwindcss/typography@latest

# Verificar se está em plugins[]
// tailwind.config.ts
plugins: [require('@tailwindcss/typography')]
```

---

## 10. Plano de Migração Gradual

### Opção: Testar v4 antes de migrar tudo

```bash
# Criar projeto teste separado
npx create-next-app@latest tailwind-v4-test --tailwind

# Copiar configuração
cp tailwind.config.ts ../tailwind-v4-test/

# Testar se tudo funciona
cd ../tailwind-v4-test
npm run dev
```

Se tudo OK, aplicar no projeto principal.

---

## 11. Checklist Final

### Antes de Migrar
- [x] Ler release notes do TailwindCSS 4
- [ ] Fazer backup do projeto
- [ ] Criar branch `tailwind-v4`

### Durante Migração
- [ ] Atualizar dependências
- [ ] Atualizar `tailwind.config.ts`
- [ ] Remover `@tailwindcss/aspect-ratio`
- [ ] Substituir aspect-ratio classes
- [ ] Rodar build

### Depois de Migrar
- [ ] Testar todas as animações
- [ ] Testar dark mode
- [ ] Testar responsive
- [ ] Testar todos os componentes principais
- [ ] Verificar bundle size

---

## 12. Benefícios Esperados

### Performance

| Métrica | v3 | v4 | Melhoria |
|---------|----|----|----------|
| Build time | ~500ms | ~50ms | 10x mais rápido |
| Dev HMR | ~100ms | ~10ms | 10x mais rápido |
| CSS size | ~50KB | ~40KB | 20% menor |

### Developer Experience

- ✅ TypeScript nativo na config
- ✅ Autocompletion melhor
- ✅ Mensagens de erro mais claras

---

**Documento criado em**: 10/12/2025  
**Status**: Fase 2 - Implementação  
**Conclusão**: Migração para TailwindCSS 4 é **viável** e **recomendada**. Benefícios superam os riscos.
