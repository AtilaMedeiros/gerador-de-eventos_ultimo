# 📋 Perfis e Papéis do Sistema

> Observação de nomenclatura:
> • Antes o **Produtor** era chamado de **Comissão**  
> • Antes o **Participante** era chamado de **Responsável**  
> (Esses nomes NÃO são mais utilizados no sistema.)


## 👥 Perfis Globais (Papel Global)

| Perfil | Descrição | Armazenado em | Login |
|--------|-----------|---------------|-------|
| **Administrador** | Acesso total ao sistema | `tb_usuario.papel_global = 'administrador'` | email + senha |
| **Produtor** | Cria e gerencia eventos | `tb_usuario.papel_global = 'produtor'` | email + senha |
| **Participante** | Inscreve atletas pela escola | `tb_usuario.papel_global = 'participante'` | email + senha (per event; INEP identifica a escola e o evento) |

---

## 🎭 Papéis por Evento

Vinculados a: `tb_usuario_evento_papeis`

| Papel | Escopo | Permissões Principais |
|-------|--------|----------------------|
| **Proprietario** | Um por evento (criador) | Editar evento, publicar, dar permissões, inscrever atletas |
| **Assistente** | Vários por evento | Editar evento, inscrever atletas, editar inscrições |
| **Observador** | Vários por evento | Ver evento, exportar relatório |

---

## 🏫 Papéis por Escola

Vinculados a: `tb_usuario_escola_papeis`

| Papel | Escopo | Permissões Principais | Login |
|-------|--------|----------------------|-------|
| **Responsável** | Gerencia a escola | Criar técnicos, inscrever atletas, editar qualquer atleta | email + senha (per event; tipoUsuario=responsavel; INEP para contexto) |
| **Técnico** | Técnico genérico ou de modalidade | Inscrever atletas, editar seus atletas, exportar relatório | email + senha (per event; tipoUsuario=tecnico) |

---

> **Nota:** as credenciais de Participantes (Responsáveis e Técnicos) são locais ao evento; cada edição exige novo cadastro/convite e novos tokens, mesmo que o CPF seja o mesmo. A ligação com o evento é feita via `tb_usuario_escola_papeis` e `tb_evento_escola`, garantindo isolamento absoluto.

## 📊 Resumo Visual

```
ADMINISTRADOR (Global)
├── Acesso total

PRODUTOR (Global → Por Evento)
├── Proprietario (1 por evento)
├── Assistente (vários por evento)
└── Observador (vários por evento)

PARTICIPANTE (Global → Escola)
├── Responsável (da escola)
└── Técnico (genérico)
```
