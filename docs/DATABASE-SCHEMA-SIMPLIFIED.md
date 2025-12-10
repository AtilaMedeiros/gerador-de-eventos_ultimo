# Schema do Banco de Dados - Versão Simplificada

## 📊 Guia Rápido das Tabelas

Este documento apresenta uma **visão simplificada** do banco de dados do Gerador de Eventos.

### 🔑 Legenda
- **(PK)** = Chave Primária - Identificador único do registro
- **(FK)** = Chave Estrangeira - Relacionamento com outra tabela
- **(UK)** = Único - Valor não pode se repetir

---

## 📋 Lista de Tabelas

### 1. tb_usuarios

```
id (PK)
id_escola (FK)
email (UK)
senha_hash
nome
tipo
permissoes
criado_em
atualizado_em
```

**Relacionamentos:**
- Um usuário pode administrar uma escola
- Um usuário pode criar vários eventos

---

### 2. tb_identidades_visuais

```
id (PK)
id_usuario_criador (FK)
nome
cor_primaria
cor_secundaria
logo
css_customizado
criado_em
atualizado_em
```

**Relacionamentos:**
- Um tema pode ser usado em vários eventos
- Um tema é criado por um usuário

---

### 3. tb_eventos

```
id (PK)
id_identidade_visual (FK)
id_usuario_criador (FK)
nome
slug (UK)
descricao
local
data_inicio
data_fim
inscricao_individual_inicio
inscricao_individual_fim
inscricao_coletiva_inicio
inscricao_coletiva_fim
imagem_capa
logos_realizacao
logos_apoio
status
maximo_atletas
total_inscricoes
criado_em
atualizado_em
```

**Relacionamentos:**
- Um evento tem várias modalidades
- Um evento tem vários avisos/boletins/resultados
- Um evento usa um tema visual
- Um evento tem vários produtores

---

### 4. tb_modalidades

```
id (PK)
nome
tipo
genero
idade_minima
idade_maxima
categoria
regras
tamanho_minimo_equipe
tamanho_maximo_equipe
requer_equipe_tecnica
criado_em
atualizado_em
```

**Relacionamentos:**
- Uma modalidade pode estar em vários eventos
- Uma modalidade recebe várias inscrições

---

### 5. tb_escolas

```
id (PK)
id_usuario_admin (FK)
nome
tipo
cnpj (UK)
codigo_inep (UK)
telefone
email
endereco
cidade
estado
cep
nome_responsavel
cpf_responsavel
telefone_responsavel
criado_em
atualizado_em
```

**Relacionamentos:**
- Uma escola tem vários atletas
- Uma escola tem vários técnicos
- Uma escola é administrada por um usuário

---

### 6. tb_atletas

```
id (PK)
id_escola (FK)
nome
cpf (UK)
rg
data_nascimento
sexo
telefone
email
nome_responsavel
cpf_responsavel
telefone_responsavel
foto
info_medica
criado_em
atualizado_em
```

**Relacionamentos:**
- Um atleta pertence a uma escola
- Um atleta pode ter várias inscrições

---

### 7. tb_tecnicos

```
id (PK)
id_escola (FK)
nome
cpf (UK)
rg
data_nascimento
telefone
email
numero_registro
especialidade
foto
criado_em
atualizado_em
```

**Relacionamentos:**
- Um técnico pertence a uma escola
- Um técnico pode ter várias inscrições em eventos

---

### 8. tb_inscricoes

```
id (PK)
id_atleta (FK)
id_evento (FK)
id_modalidade (FK)
status
observacoes
inscrito_em
confirmado_em
criado_em
atualizado_em
```

**Relacionamentos:**
- Uma inscrição é de um atleta
- Uma inscrição é para um evento
- Uma inscrição é em uma modalidade

---

### 9. tb_inscricoes_tecnicos

```
id (PK)
id_tecnico (FK)
id_evento (FK)
id_modalidade (FK)
status
observacoes
inscrito_em
confirmado_em
criado_em
atualizado_em
```

**Relacionamentos:**
- Uma inscrição é de um técnico
- Uma inscrição é para um evento
- Pode ser vinculada a uma modalidade específica

---

### 10. tb_eventos_modalidades

```
id (PK)
id_evento (FK)
id_modalidade (FK)
maximo_inscricoes
inscricoes_atuais
regras_adicionais
criado_em
atualizado_em
```

**Relacionamentos:**
- Relaciona um evento com suas modalidades
- Permite configurações específicas da modalidade no evento

---

### 11. tb_produtores_eventos

```
id (PK)
id_evento (FK)
id_usuario (FK)
papel
permissoes
convidado_em
aceito_em
criado_em
atualizado_em
```

**Relacionamentos:**
- Permite múltiplos produtores por evento
- Define papel de cada produtor

---

### 12. tb_avisos

```
id (PK)
id_evento (FK)
id_usuario_criador (FK)
titulo
descricao
categoria
data
criado_em
atualizado_em
```

**Relacionamentos:**
- Um evento tem vários avisos
- Um aviso é criado por um usuário

---

### 13. tb_boletins

```
id (PK)
id_evento (FK)
id_usuario_criador (FK)
titulo
conteudo
url_arquivo
numero
publicado_em
criado_em
atualizado_em
```

**Relacionamentos:**
- Um evento tem vários boletins
- Um boletim é criado por um usuário

---

### 14. tb_regulamentos

```
id (PK)
id_evento (FK)
id_usuario_criador (FK)
titulo
url_arquivo
versao
ativo
publicado_em
criado_em
atualizado_em
```

**Relacionamentos:**
- Um evento tem vários regulamentos (versões)
- Um regulamento é criado por um usuário

---

### 15. tb_resultados

```
id (PK)
id_evento (FK)
id_modalidade (FK)
id_usuario_criador (FK)
titulo
conteudo
classificacoes
url_arquivo
publicado_em
criado_em
atualizado_em
```

**Relacionamentos:**
- Um evento tem vários resultados
- Um resultado pode ser específico de uma modalidade
- Um resultado é criado por um usuário

---

## 🔗 Diagrama de Relacionamentos

```
tb_usuarios
    ├─→ cria tb_eventos
    ├─→ administra tb_escolas
    ├─→ cria tb_identidades_visuais
    └─→ publica tb_avisos, tb_boletins, tb_resultados, tb_regulamentos

tb_eventos
    ├─→ usa tb_identidades_visuais
    ├─→ tem tb_eventos_modalidades
    ├─→ tem tb_produtores_eventos
    ├─→ recebe tb_inscricoes
    └─→ tem tb_avisos, tb_boletins, tb_resultados, tb_regulamentos

tb_escolas
    ├─→ tem tb_atletas
    └─→ tem tb_tecnicos

tb_atletas
    └─→ faz tb_inscricoes em tb_modalidades

tb_modalidades
    ├─→ associada a tb_eventos_modalidades
    └─→ recebe tb_inscricoes
```

---

## 📊 Resumo por Área Funcional

### 👥 Gestão de Usuários e Permissões
- **tb_usuarios** - Todos os usuários do sistema
- **tb_produtores_eventos** - Produtores vinculados a eventos

### 🎯 Eventos
- **tb_eventos** - Eventos esportivos
- **tb_identidades_visuais** - Temas visuais dos eventos
- **tb_eventos_modalidades** - Modalidades disponíveis por evento

### 🏆 Esportes
- **tb_modalidades** - Catálogo de modalidades esportivas

### 🏫 Instituições e Pessoas
- **tb_escolas** - Escolas participantes
- **tb_atletas** - Atletas cadastrados
- **tb_tecnicos** - Técnicos/Treinadores

### 📝 Inscrições
- **tb_inscricoes** - Inscrições de atletas
- **tb_inscricoes_tecnicos** - Inscrições de técnicos

### 📢 Comunicação
- **tb_avisos** - Avisos e notícias
- **tb_boletins** - Boletins técnicos
- **tb_regulamentos** - Regulamentos do evento
- **tb_resultados** - Resultados e classificações

---

## 🎯 Principais Fluxos de Dados

### 1. Cadastro de Escola e Atletas
```
tb_usuarios → tb_escolas → tb_atletas
```

### 2. Criação de Evento
```
tb_usuarios → tb_eventos → tb_eventos_modalidades
```

### 3. Inscrição de Atleta
```
tb_atletas → tb_inscricoes ← tb_eventos + tb_modalidades
```

### 4. Publicação de Comunicados
```
tb_usuarios → tb_avisos/tb_boletins/tb_resultados → tb_eventos
```

---

## 💡 Informações Importantes

### Padrão de Nomenclatura
- **Tabelas**: Sempre com prefixo `tb_` (ex: `tb_usuarios`, `tb_eventos`)
- **Chave Primária**: Sempre `id (PK)` - primeiro campo
- **Chaves Estrangeiras**: Sempre `id_<nome_tabela>` (ex: `id_evento`, `id_usuario`) - logo após o PK
- **Demais campos**: Após todos os IDs

### Ordem dos Campos
1. **id (PK)** - Sempre primeiro
2. **id_<tabela> (FK)** - Todas as chaves estrangeiras em seguida
3. **Campos regulares** - Restante dos campos
4. **criado_em** - Penúltimo campo
5. **atualizado_em** - Último campo

### Campos Padrão em Todas as Tabelas
- **id (PK)** - Identificador único (UUID)
- **criado_em** - Data e hora de criação
- **atualizado_em** - Data e hora da última atualização

### Campos Únicos Importantes
- **email** em tb_usuarios
- **cpf** em tb_atletas e tb_tecnicos
- **slug** em tb_eventos
- **cnpj** e **codigo_inep** em tb_escolas

### Valores Especiais

**Tipos de Usuário** (campo `tipo` em tb_usuarios):
- admin
- produtor
- admin_escola
- tecnico

**Status de Evento** (campo `status` em tb_eventos):
- rascunho
- publicado
- em_andamento
- finalizado
- cancelado

**Tipos de Modalidade** (campo `tipo` em tb_modalidades):
- individual
- coletiva

**Gênero** (campo `genero` em tb_modalidades):
- Masculino
- Feminino
- Misto

**Sexo** (campo `sexo` em tb_atletas):
- Masculino
- Feminino

**Tipo de Escola** (campo `tipo` em tb_escolas):
- Pública
- Particular

**Status de Inscrição** (campo `status` em tb_inscricoes):
- pendente
- confirmada
- cancelada
- rejeitada

**Categoria de Aviso** (campo `categoria` em tb_avisos):
- Geral
- Urgente
- Plantão
- Informativo

**Papel do Produtor** (campo `papel` em tb_produtores_eventos):
- proprietario
- colaborador

---

## 📖 Glossário

| Termo | Significado |
|-------|-------------|
| **PK (Primary Key)** | Chave primária - identifica unicamente cada registro |
| **FK (Foreign Key)** | Chave estrangeira - cria relacionamento entre tabelas |
| **UK (Unique)** | Campo com valor único - não pode haver duplicação |
| **UUID** | Identificador único universal (32 caracteres) |
| **Slug** | URL amigável (ex: "jogos-escolares-2025") |
| **Hash** | Senha criptografada de forma irreversível |

---

## 📋 Exemplo de Dados

### tb_usuarios
```
id: a1b2c3d4-e5f6-4789-a0b1-c2d3e4f56789
id_escola: e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8901
email: joao.silva@escola.com.br
nome: João Silva
tipo: admin_escola
```

### tb_eventos
```
id: f7e8d9c0-b1a2-4536-9e8f-7d6c5b4a3210
id_identidade_visual: null
id_usuario_criador: a1b2c3d4-e5f6-4789-a0b1-c2d3e4f56789
nome: Jogos Escolares 2025
slug: jogos-escolares-2025
status: publicado
```

### tb_atletas
```
id: c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f
id_escola: e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8901
nome: Maria Santos
cpf: 123.456.789-00
data_nascimento: 2010-05-15
sexo: Feminino
```

### tb_inscricoes
```
id: d5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f90
id_atleta: c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f
id_evento: f7e8d9c0-b1a2-4536-9e8f-7d6c5b4a3210
id_modalidade: a9b0c1d2-e3f4-4567-8901-2a3b4c5d6e7f
status: confirmada
```

---

**Versão**: 1.0.2  
**Data**: 2025-12-10  
**Baseado em**: [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)
