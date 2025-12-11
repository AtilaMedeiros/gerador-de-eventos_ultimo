# 🧭 Diretrizes de Migração (React → Next.js)

Este documento centraliza o contexto e as regras primordiais para o processo de migração do projeto.

---

## 🏗️ Estrutura do Workspace

O repositório contém dois projetos distintos que coexistem durante a fase de migração:

1.  **Projeto Antigo (Origem/Referência):**
    *   **Caminho:** `frontend-react/src`
    *   **Tecnologia:** React (Vite/CRA)
    *   **Função:** É a **FONTE DA VERDADE** para design, funcionalidades, regras de negócio e "look & feel" (Premium/Ultra Premium).
    *   **Porta Típica:** `localhost:8080`

2.  **Projeto Novo (Destino):**
    *   **Caminho:** `frontend-react/nextjs-app`
    *   **Tecnologia:** Next.js (App Router), Tailwind CSS, Shadcn UI.
    *   **Função:** É o novo codebase que está sendo construído.
    *   **Porta Típica:** `localhost:3000`

---

## 🎯 Objetivo Principal

**Migrar o projeto React antigo para Next.js mantendo ou superando a qualidade visual e funcional.**

*   **Fidelidade Visual:** O novo projeto deve replicar as cores, gradientes, sombras, animações e a estética "Ultra Premium" do projeto antigo.
*   **Melhoria de Código:** Aproveitar a migração para refatorar, usar Tipagem (TypeScript) estrita e componentes modernos (Shadcn/Radix), mas **sem perder a identidade visual**.
*   **Comparação Constante:** Antes de finalizar uma tarefa, sempre se pergunte: *"Isso está tão bonito/funcional quanto no projeto antigo?"*. Se a resposta for "não" ou "está diferente", ajuste para igualar a referência.

---

## 🧠 Como usar esse contexto

Ao receber uma tarefa de "consertar" ou "implementar" algo no Next.js:

1.  **Analise a Origem:** Primeiro, vá até `frontend-react/src` e encontre o componente ou página equivalente. Veja como ele foi feito lá (CSS, estruturas, lógica).
2.  **Identifique a Diferença:** Compare com o que está em `frontend-react/nextjs-app`.
3.  **Portar com Melhorias:** Traga a lógica visual (classes, cores hexadecimais, efeitos) para o Next.js, adaptando para a sintaxe do Tailwind se necessário, mas mantendo o resultado visual idêntico.

---

## 📚 Pitfalls & Aprendizados (Referência Rápida)

*   [Pitfalls Gerais](./pitfall.md) - Erros comuns e padrões a evitar.
