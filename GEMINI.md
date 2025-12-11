# Contexto do Projeto: Gerador de Eventos (React + Next.js)

## 📋 Visão Geral e Migração
Este repositório está em um **estágio de transição/migração**. Ele contém dois projetos principais coexistindo:

1.  **Projeto Legado (React/Vite):** Localizado na raiz/src. É a **referência de design e funcionalidade** (Ultra Premium).
2.  **Projeto Novo (Next.js):** Localizado em `nextjs-app`. É o destino final da migração, reconstruindo a aplicação com tecnologias mais modernas (Server Components, Next Auth, etc).

**Status:** Migração Ativa. O objetivo é replicar a qualidade visual do projeto React no Next.js.

---

## 🏗️ Estrutura do Monorepo (Implícito)

| Caminho | Tecnologia | Descrição | Status Visual | Porta Padrão |
| :--- | :--- | :--- | :--- | :--- |
| `/src` | React 19 + Vite | **Fonte da Verdade**. Design validado e aprovado. | 🟢 Gold Standard | `8080` |
| `/nextjs-app` | Next.js 15 (App Router) | **Em Construção**. Deve espelhar o React. | 🟡 Em Progresso | `3000` |

---

## 🔧 Workflow de Migração (Regra de Ouro)

> **"Consulte o antigo antes de codar o novo."**

Ao implementar uma feature no `nextjs-app`:
1.  Abra o projeto React (`src/**`) e veja como foi feito.
2.  Copie os códigos hexadecimais de cor, valores de sombra e timings de animação.
3.  Adapte para Tailwind/Shadcn no Next.js, mas **mantenha a fidelidade visual**.
4.  Consulte `docs/MIGRATION_GUIDELINES.md` para detalhes.

---

## 📚 Documentação Essencial

A pasta `docs/` é a fonte oficial de conhecimento. Leia nesta ordem:

1.  **[PRD.md](./docs/PRD.md):** Para entender as regras de negócio.
2.  **[MIGRATION_GUIDELINES.md](./docs/MIGRATION_GUIDELINES.md):** Guia específico de como portar código.
3.  **[pitfall.md](./docs/pitfall.md):** Erros comuns já identificados (ex: cores lavadas no Next.js).
4.  **[ARCHITECTURE.md](./docs/ARCHITECTURE.md):** Visão técnica geral.

---

## 🚀 Comandos Rápidos

### Projeto React (Referência)
```bash
npm install     # Na raiz
npm run dev     # Roda em localhost:8080
```

### Projeto Next.js (Destino)
```bash
cd nextjs-app
npm install
npm run dev     # Roda em localhost:3000
```

---

## 🐛 Troubleshooting

*   **Cores diferentes?** Verifique `pitfall.md`. O Next.js tende a usar cores padrão do Tailwind (Slate/Gray) enquanto o projeto React usa gradientes customizados. **Sempre prefira o visual do React.**
*   **Erro de Contexto?** O Next.js usa Server Components por padrão. Lembre-se de adicionar `'use client'` no topo de arquivos que usam Hooks (`useState`, `useContext`).

---
**Gerado Atualizado pelo Gemini**
Baseado na estrutura atual de migração.
