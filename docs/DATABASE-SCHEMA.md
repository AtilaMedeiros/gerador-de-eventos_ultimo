
# 📚 Database Schema (Spring Data JPA + DDL)

Documento refeito para servir como referência prática do schema relacional
orientado a Spring Data JPA. Contém:
- DDL SQL compatível com H2/Oracle (tipos genéricos onde aplicável)
- Exemplos de entidades JPA (Java) com anotações mínimas
- Índices, constraints e notas de migração (ex.: `id_keycloak`)

Obs: este arquivo substitui o panorama anterior por um artefato mais direto
para desenvolvimento backend com Spring Boot / Spring Data JPA.

---

## Convenções usadas aqui

- PK: `id BIGINT` com `@Id` e `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- Colunas audit: `acao CHAR(1)`, `data TIMESTAMP`, `id_usuario INTEGER`, `ativo CHAR(1)`
- Nomes de tabelas: `tb_<nome>` (singular, snake_case)
- Strings: `VARCHAR(255)` por padrão; use `TEXT` para campos longos
- Use indexes explícitos para FKs e colunas de busca (ex.: `cpf`, `slug`)

---

## DDL: tabelas principais (exemplos)

-- 1) `tb_usuario`
CREATE TABLE tb_usuario (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug VARCHAR(100) UNIQUE,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(50),
  senha_hash VARCHAR(255),
  papel_global VARCHAR(100),
  id_escola BIGINT NULL,
  id_keycloak VARCHAR(100) NULL,
  cargo_funcao VARCHAR(255),
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario BIGINT NULL,
  ativo CHAR(1) DEFAULT '1'
);
CREATE INDEX idx_tb_usuario_cpf ON tb_usuario(cpf);
CREATE INDEX idx_tb_usuario_email ON tb_usuario(email);

-- 2) `tb_evento`
CREATE TABLE tb_evento (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug VARCHAR(150) UNIQUE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  municipio VARCHAR(255),
  data_inicio TIMESTAMP NULL,
  data_fim TIMESTAMP NULL,
  data_inscricao_inicio TIMESTAMP NULL,
  data_inscricao_fim TIMESTAMP NULL,
  regulamento_url VARCHAR(400),
  logo_url VARCHAR(400),
  banner_url VARCHAR(400),
  favicon_url VARCHAR(400),
  id_tema BIGINT NULL,
  publicado CHAR(1) DEFAULT '0',
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario BIGINT NULL,
  ativo CHAR(1) DEFAULT '1'
);
CREATE INDEX idx_tb_evento_slug ON tb_evento(slug);

-- 3) `tb_tema`
CREATE TABLE tb_tema (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug VARCHAR(100) UNIQUE,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  cor_primaria VARCHAR(50),
  cor_secundaria VARCHAR(50),
  cor_fundo VARCHAR(50),
  cor_texto VARCHAR(50),
  fonte_titulo VARCHAR(200),
  fonte_corpo VARCHAR(200),
  tamanho_base INTEGER,
  espaco_base INTEGER,
  eh_padrao CHAR(1) DEFAULT '0',
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario BIGINT NULL,
  ativo CHAR(1) DEFAULT '1'
);

-- 4) `tb_escola`
CREATE TABLE tb_escola (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  inep VARCHAR(50) UNIQUE,
  cnpj VARCHAR(50),
  municipio VARCHAR(255),
  endereco VARCHAR(400),
  bairro VARCHAR(200),
  cidade VARCHAR(200),
  uf VARCHAR(2),
  cep VARCHAR(20),
  telefone VARCHAR(50),
  email VARCHAR(255),
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario BIGINT NULL,
  ativo CHAR(1) DEFAULT '1'
);
CREATE INDEX idx_tb_escola_inep ON tb_escola(inep);

-- 5) `tb_usuario_evento_papeis` (papéis por evento) — fonte de verdade para RBAC por evento
CREATE TABLE tb_usuario_evento_papeis (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_usuario BIGINT NOT NULL,
  id_evento BIGINT NOT NULL,
  papel_evento VARCHAR(100) NOT NULL,
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario_audit BIGINT NULL,
  ativo CHAR(1) DEFAULT '1',
  CONSTRAINT fk_uep_usuario FOREIGN KEY (id_usuario) REFERENCES tb_usuario(id),
  CONSTRAINT fk_uep_evento FOREIGN KEY (id_evento) REFERENCES tb_evento(id)
);
CREATE INDEX idx_uep_usuario_evento ON tb_usuario_evento_papeis(id_usuario, id_evento);

-- 6) `tb_usuario_escola_papeis` (papéis por escola)
CREATE TABLE tb_usuario_escola_papeis (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_usuario BIGINT NOT NULL,
  id_escola BIGINT NOT NULL,
  papel_escola VARCHAR(100) NOT NULL,
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario_audit BIGINT NULL,
  ativo CHAR(1) DEFAULT '1',
  CONSTRAINT fk_uesp_usuario FOREIGN KEY (id_usuario) REFERENCES tb_usuario(id),
  CONSTRAINT fk_uesp_escola FOREIGN KEY (id_escola) REFERENCES tb_escola(id)
);

-- 7) `tb_evento_escola` (escolas inscritas no evento)
CREATE TABLE tb_evento_escola (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_evento BIGINT NOT NULL,
  id_escola BIGINT NOT NULL,
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50),
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario_audit BIGINT NULL,
  ativo CHAR(1) DEFAULT '1',
  CONSTRAINT fk_ee_evento FOREIGN KEY (id_evento) REFERENCES tb_evento(id),
  CONSTRAINT fk_ee_escola FOREIGN KEY (id_escola) REFERENCES tb_escola(id)
);

-- 8) `tb_modalidade` e `tb_evento_modalidade`
CREATE TABLE tb_modalidade (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50),
  naipe VARCHAR(50),
  min_atletas INTEGER,
  max_atletas INTEGER,
  idade_minima INTEGER,
  idade_maxima INTEGER,
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo CHAR(1) DEFAULT '1'
);

CREATE TABLE tb_evento_modalidade (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_evento BIGINT NOT NULL,
  id_modalidade BIGINT NOT NULL,
  vagas INTEGER,
  versao INTEGER DEFAULT 1,
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo CHAR(1) DEFAULT '1',
  CONSTRAINT fk_em_evento FOREIGN KEY (id_evento) REFERENCES tb_evento(id),
  CONSTRAINT fk_em_modalidade FOREIGN KEY (id_modalidade) REFERENCES tb_modalidade(id)
);

-- 9) `tb_inscricao` e `tb_inscricao_atleta`
CREATE TABLE tb_inscricao (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_evento_escola BIGINT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50),
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo CHAR(1) DEFAULT '1',
  CONSTRAINT fk_ins_evento_escola FOREIGN KEY (id_evento_escola) REFERENCES tb_evento_escola(id)
);

CREATE TABLE tb_inscricao_atleta (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_inscricao BIGINT NOT NULL,
  id_atleta BIGINT NOT NULL,
  numero_competidor INTEGER,
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo CHAR(1) DEFAULT '1',
  CONSTRAINT fk_ia_inscricao FOREIGN KEY (id_inscricao) REFERENCES tb_inscricao(id)
);

-- 10) `tb_comunicacao`
CREATE TABLE tb_comunicacao (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_evento BIGINT NOT NULL,
  tipo VARCHAR(50),
  titulo VARCHAR(255),
  texto TEXT,
  metadados CLOB NULL,
  data_publicacao TIMESTAMP NULL,
  acao CHAR(1) DEFAULT 'C',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario BIGINT NULL,
  ativo CHAR(1) DEFAULT '1',
  CONSTRAINT fk_com_evento FOREIGN KEY (id_evento) REFERENCES tb_evento(id)
);

-- 11) `tb_login_auditoria`
CREATE TABLE tb_login_auditoria (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_usuario BIGINT NULL,
  id_evento BIGINT NULL,
  cpf_hash VARCHAR(128) NULL,
  ip_origem VARCHAR(100) NULL,
  user_agent VARCHAR(1024) NULL,
  sucesso CHAR(1) DEFAULT '0',
  motivo VARCHAR(255) NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  origem VARCHAR(50) DEFAULT 'app',
  metadados CLOB NULL
);

---

## Exemplos de entidades Spring Data JPA (resumo)

-- `Usuario` (exemplo mínimo)
```java
@Entity
@Table(name = "tb_usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 100)
    private String slug;

    private String nome;

    @Column(length = 20)
    private String cpf;

    private String email;

    private String senhaHash;

    private String idKeycloak; // nullable

    @Column(length = 1)
    private String ativo = "1";

    @CreationTimestamp
    private Instant data;
}
```

-- `UsuarioEventoPapel` (papéis por evento)
```java
@Entity
@Table(name = "tb_usuario_evento_papeis",
       indexes = {@Index(columnList = "id_usuario,id_evento")})
public class UsuarioEventoPapel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "id_evento")
    private Long idEvento;

    private String papelEvento;
}
```

Observação: prefira entidades enxutas e carregue relacionamentos pesados via queries ou DTOs.

---

## Notas operacionais e de migração

- Adicionar `id_keycloak` em `tb_usuario` permite mapear identidades do IdP.
- Política recomendada: popular `id_keycloak` por matching preferencial por `cpf` e fallback por `email`.
- Mantenha `senha_hash` apenas enquanto houver autenticação local ativa; remova após corte e após prazo de retenção.
- Crie jobs batch para sincronizar papéis do Keycloak → `tb_usuario_evento_papeis` (ou mantenha em Keycloak e sincronize para Casbin em memória por request).

### Exemplo de DDL de migração para `id_keycloak`
ALTER TABLE tb_usuario ADD COLUMN id_keycloak VARCHAR(100);
CREATE INDEX idx_tb_usuario_id_keycloak ON tb_usuario(id_keycloak);

---

## Próximos passos sugeridos

1. Validar tipos de dados para Oracle (ex.: `CLOB` ↔ `TEXT`, `GENERATED ALWAYS AS IDENTITY` ↔ sequences).
2. Gerar scripts de migração Flyway/Liquibase a partir deste DDL.
3. Gerar arquivo separado `migrations/2025xx_create-rbac-tables.sql` contendo DDL para `tb_papel`, `tb_permissao`, `tb_papel_permissao` e seeds iniciais.
4. Implementar sincronizador Keycloak → DB (webhook listener + job de reconciliação) e documentar mapeamentos (roleKeycloak → `papel_evento`).

Se desejar, eu gero agora o script SQL para as tabelas de RBAC (`tb_papel`, `tb_permissao`, `tb_papel_permissao`) e um script de migração para `id_keycloak`.
