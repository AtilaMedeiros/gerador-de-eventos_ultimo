# Convenções de Código

---

## 📐 Padrões de Código

### 🔤 Nomenclatura (Português-BR)

Todos os nomes de **funções**, **variáveis**, **arquivos**, **tabelas** e **dados** devem ser definidos em **português do Brasil**, tanto na criação quanto na atualização.

#### Regras por Tipo

| Tipo | Padrão | Exemplo | Aplicação |
|------|--------|---------|-----------|
| Funções/Variáveis | `camelCase` | `calcularTotalInscricoes` | TypeScript, Java, JavaScript |
| Componentes React | `PascalCase` | `CardInscricao` | `.tsx`, `.jsx` |
| Arquivos/Pastas | `kebab-case` | `card-inscricao.tsx` | Estrutura de pastas |
| Tabelas/Colunas (BD) | `snake_case` | `tb_inscricao`, `data_nascimento` | Oracle, PostgreSQL, MySQL |
| Constantes/Enums | `UPPER_SNAKE_CASE` | `LIMITE_INSCRICOES` | TypeScript, Java |

#### Caracteres

- ✅ **Permitidos:** letras, números (não no início), underscores `_`
- ❌ **Proibidos:** acentos, cedilhas, caracteres especiais nos identificadores
  - ❌ Errado: `calcularTota_Inscrições`, `data_nasc_aprov`
  - ✅ Correto: `calcularTotalInscricoes`, `data_nascimento_aprovada`

---

## 🔗 Integrações de Processo

### Pré-Validação Técnica
Verificar conformidade com padrões de nomenclatura antes de implementar:
- ESLint/Prettier validam convenções automaticamente
- Code review verifica aderência a esta documentação
- CI/CD pode bloquear commits com nomenclatura incorreta

### Auditoria Final
Checar e reportar aderência de nomenclatura nas entregas:
- [ ] Todos os nomes em português-BR
- [ ] Padrões de capitalização corretos
- [ ] Sem acentos ou caracteres especiais
- [ ] Consistência em todo o codebase

--

## 🌐 URLs Públicas e Padrão Slug + ID

Cada evento esportivo criado no sistema possui uma URL pública única baseada em **slug + ID**. Este padrão garante URLs legíveis e SEO-friendly, com identificação única via ID.

### Padrão: Slug + ID

**Formato:** `https://localhost:3000/evento/{slug}/{id_evento}`

**Descrição:**
- `{slug}` — Versão URL-friendly do nome do evento (minúsculas, separadas por hífen)
- `{id_evento}` — Identificador único do evento (numérico)

**Exemplos Práticos:**

```
Evento "Jogo de Futebol" (ID: 1)
  → URL: https://localhost:3000/evento/jogo-de-futebol/1

Evento "Copa Escolar 2025" (ID: 2)
  → URL: https://localhost:3000/evento/copa-escolar-2025/2

Evento "Campeonato de Voleibol Inter-Escolas" (ID: 123)
  → URL: https://localhost:3000/evento/campeonato-de-voleibol-inter-escolas/123
```

**Geração de Slug:**
- Converter nome para minúsculas
- Remover acentos e caracteres especiais
- Substituir espaços por hífens
- Exemplos: `"Jogo de Futebol"` → `jogo-de-futebol`

---

## 🔗 Integrações de Processo

### Pré-Validação Técnica
Verificar conformidade com padrões de nomenclatura antes de implementar:
- ESLint/Prettier validam convenções automaticamente
- Code review verifica aderência a esta documentação
- CI/CD pode bloquear commits com nomenclatura incorreta

### Auditoria Final
Checar e reportar aderência de nomenclatura nas entregas:
- [ ] Todos os nomes em português-BR
- [ ] Padrões de capitalização corretos
- [ ] Sem acentos ou caracteres especiais
- [ ] Consistência em todo o codebase

---

## Documentos Relacionados

- [Constraints](./constraints.md) — Regras fortes que não podem ser violadas
- [Pitfalls](./pitfalls.md) — Armadilhas e padrões de erros
- [Decisões Arquiteturais](../architecture/ADR.md) — Por que certos padrões são preferidos