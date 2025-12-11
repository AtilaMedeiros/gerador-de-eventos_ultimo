# 📐 Padrões de Código

## 🔤 Nomenclatura (Português-BR)

Todos os nomes de **funções**, **variáveis**, **arquivos**, **tabelas** e **dados** devem ser definidos em **português do Brasil**, tanto na criação quanto na atualização.

### Regras por Tipo

| Tipo | Padrão | Exemplo | Aplicação |
|------|--------|---------|-----------|
| Funções/Variáveis | `camelCase` | `calcularTotalInscricoes` | TypeScript, Java, JavaScript |
| Componentes React | `PascalCase` | `CardInscricao` | `.tsx`, `.jsx` |
| Arquivos/Pastas | `kebab-case` | `card-inscricao.tsx` | Estrutura de pastas |
| Tabelas/Colunas (BD) | `snake_case` | `tb_inscricao`, `data_nascimento` | Oracle, PostgreSQL, MySQL |
| Constantes/Enums | `UPPER_SNAKE_CASE` | `LIMITE_INSCRICOES` | TypeScript, Java |

### Caracteres

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
