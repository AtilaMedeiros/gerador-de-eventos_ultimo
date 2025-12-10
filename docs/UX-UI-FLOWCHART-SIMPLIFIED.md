# Flowchart Simplificado de UX/UI - Gerador de Eventos

## 🎯 Visão Geral de Alto Nível

Este é um diagrama simplificado que mostra as principais jornadas do usuário na aplicação.

```mermaid
flowchart TB
    Start([👤 Usuário]) --> Decision{Tipo de Acesso}
    
    %% PÚBLICO
    Decision -->|🌐 Visitante| Public[📖 Área Pública]
    Public --> ViewEvent[Ver Evento]
    Public --> ViewNews[Ver Notícias]
    Public --> ViewDocs[Ver Documentos]
    ViewEvent --> Register{Deseja Participar?}
    Register -->|Sim| ParticipantAuth
    Register -->|Não| End1([Fim])
    
    %% PARTICIPANTE
    Decision -->|🏫 Escola/Atleta| ParticipantAuth[🔐 Login Participante]
    ParticipantAuth --> ParticipantArea[🎓 Área do Participante]
    ParticipantArea --> ManageSchool[Gerenciar Escola]
    ParticipantArea --> ManageAthletes[Gerenciar Atletas]
    ParticipantArea --> Subscribe[Fazer Inscrições]
    ParticipantArea --> PrintForms[Imprimir Fichas]
    ManageAthletes --> Subscribe
    Subscribe --> PrintForms
    PrintForms --> End2([Fim])
    
    %% PRODUTOR
    Decision -->|🎯 Organizador| ProducerAuth[🔐 Login Produtor]
    ProducerAuth --> ProducerArea[👔 Área do Produtor]
    ProducerArea --> CreateEvent[Criar Evento]
    ProducerArea --> ManageModalities[Gerenciar Modalidades]
    ProducerArea --> ManageParticipants[Gerenciar Participantes]
    ProducerArea --> Publish[Publicar Comunicados]
    CreateEvent --> ConfigEvent[Configurar Evento]
    ConfigEvent --> ManageModalities
    ManageModalities --> Publish
    ManageParticipants --> GenerateReports[Gerar Relatórios]
    GenerateReports --> End3([Fim])
    
    %% ESTILOS
    classDef publicStyle fill:#3b82f6,stroke:#1e40af,color:#fff,stroke-width:3px
    classDef participantStyle fill:#10b981,stroke:#059669,color:#fff,stroke-width:3px
    classDef producerStyle fill:#8b5cf6,stroke:#6d28d9,color:#fff,stroke-width:3px
    classDef authStyle fill:#ef4444,stroke:#b91c1c,color:#fff,stroke-width:3px
    
    class Public,ViewEvent,ViewNews,ViewDocs publicStyle
    class ParticipantAuth,ParticipantArea,ManageSchool,ManageAthletes,Subscribe,PrintForms participantStyle
    class ProducerAuth,ProducerArea,CreateEvent,ManageModalities,ManageParticipants,Publish,ConfigEvent,GenerateReports producerStyle
```

---

## 🔄 Jornadas Principais

### 1. Jornada do Visitante (Público)
```mermaid
journey
    title Jornada do Visitante
    section Descoberta
      Acessar site do evento: 5: Visitante
      Ver informações do evento: 5: Visitante
      Ler notícias e comunicados: 4: Visitante
    section Interesse
      Ver modalidades disponíveis: 4: Visitante
      Verificar prazos de inscrição: 5: Visitante
      Decidir participar: 5: Visitante
    section Conversão
      Clicar em "Fazer Inscrição": 5: Visitante
      Ir para login/cadastro: 5: Visitante
```

### 2. Jornada do Participante (Escola)
```mermaid
journey
    title Jornada da Escola/Atleta
    section Cadastro
      Criar conta da escola: 3: Escola
      Preencher dados institucionais: 4: Escola
      Confirmar cadastro: 5: Escola
    section Gestão
      Cadastrar atletas: 4: Escola
      Cadastrar técnicos: 4: Escola
      Visualizar eventos disponíveis: 5: Escola
    section Inscrição
      Selecionar modalidades: 5: Escola
      Inscrever atletas: 5: Escola
      Confirmar inscrições: 5: Escola
    section Documentação
      Gerar fichas de inscrição: 5: Escola
      Imprimir documentos: 5: Escola
      Acompanhar status: 4: Escola
```

### 3. Jornada do Produtor (Organizador)
```mermaid
journey
    title Jornada do Organizador
    section Planejamento
      Fazer login no sistema: 5: Produtor
      Criar novo evento: 4: Produtor
      Configurar datas e prazos: 4: Produtor
    section Configuração
      Adicionar modalidades: 5: Produtor
      Configurar identidade visual: 4: Produtor
      Definir regulamentos: 4: Produtor
    section Gestão
      Visualizar inscrições: 5: Produtor
      Gerenciar participantes: 5: Produtor
      Publicar comunicados: 5: Produtor
    section Relatórios
      Gerar relatórios: 5: Produtor
      Exportar dados: 5: Produtor
      Analisar métricas: 4: Produtor
```

---

## 🎨 Arquitetura de Componentes

### Estrutura por Área

```mermaid
graph LR
    A[Aplicação] --> B[Área Pública]
    A --> C[Área Participante]
    A --> D[Área Produtor]
    
    B --> B1[Header]
    B --> B2[Event Page]
    B --> B3[Footer]
    
    C --> C1[Sidebar]
    C --> C2[Dashboard]
    C --> C3[Atletas]
    C --> C4[Inscrições]
    
    D --> D1[Sidebar]
    D --> D2[Dashboard]
    D --> D3[Eventos]
    D --> D4[Modalidades]
    D --> D5[Participantes]
    
    style B fill:#3b82f6,color:#fff
    style C fill:#10b981,color:#fff
    style D fill:#8b5cf6,color:#fff
```

---

## 📊 Fluxo de Dados

### Contextos e Estado Global

```mermaid
graph TD
    App[App.tsx] --> AC[AuthContext]
    App --> EC[EventContext]
    App --> MC[ModalityContext]
    App --> PC[ParticipantContext]
    App --> TC[ThemeContext]
    App --> CC[CommunicationContext]
    
    AC --> LS1[(LocalStorage<br/>ge_user)]
    EC --> LS2[(LocalStorage<br/>ge_events)]
    PC --> LS3[(LocalStorage<br/>ge_schools)]
    
    AC -.->|Autenticação| Pages[Páginas]
    EC -.->|Eventos| Pages
    MC -.->|Modalidades| Pages
    PC -.->|Inscrições| Pages
    TC -.->|Tema| Pages
    CC -.->|Comunicação| Pages
    
    style AC fill:#ef4444,color:#fff
    style EC fill:#8b5cf6,color:#fff
    style MC fill:#f59e0b,color:#fff
    style PC fill:#10b981,color:#fff
    style TC fill:#3b82f6,color:#fff
    style CC fill:#ec4899,color:#fff
```

---

## 🔐 Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant L as Login Page
    participant A as AuthContext
    participant LS as LocalStorage
    participant P as Protected Route
    participant D as Dashboard
    
    U->>L: Acessa página de login
    L->>U: Exibe formulário
    U->>L: Envia credenciais
    L->>A: login(email, password)
    A->>A: Valida credenciais
    alt Credenciais válidas
        A->>LS: Salva usuário (ge_user)
        A->>L: ✅ Retorna sucesso
        L->>P: Redireciona
        P->>A: Verifica autenticação
        A->>P: ✅ Autenticado
        P->>D: Renderiza Dashboard
        D->>U: Exibe conteúdo
    else Credenciais inválidas
        A->>L: ❌ Retorna erro
        L->>U: Exibe mensagem de erro
    end
```

---

## 📱 Navegação por Dispositivo

### Desktop
```mermaid
graph LR
    D[Desktop] --> S[Sidebar Fixa]
    D --> C[Conteúdo Principal]
    D --> H[Header]
    
    S --> M[Menu Completo]
    C --> T[Tabelas Expandidas]
    C --> G[Gráficos]
    
    style D fill:#3b82f6,color:#fff
```

### Mobile
```mermaid
graph LR
    M[Mobile] --> HM[Header com Menu]
    M --> SC[Scroll Content]
    
    HM --> BM[Burger Menu]
    BM --> SD[Sidebar Drawer]
    SC --> TC[Tabelas Scrolláveis]
    SC --> GC[Gráficos Responsivos]
    
    style M fill:#10b981,color:#fff
```

---

## 📈 Métricas e KPIs Exibidos

### Dashboard do Produtor
- 📊 Total de Atletas Inscritos
- 🏫 Escolas Participantes (Públicas/Privadas)
- ⏰ Contadores Regressivos de Prazos
- 🏆 Estatísticas por Modalidade
- 📢 Feed de Atividades Recentes

### Dashboard do Participante
- 📅 Eventos Disponíveis
- ✅ Inscrições Confirmadas
- 👥 Atletas Cadastrados
- 📊 Distribuição por Gênero
- 🏆 Atletas por Categoria

---

## 🎯 Principais Funcionalidades por Perfil

| Funcionalidade | Público | Participante | Produtor |
|----------------|---------|--------------|----------|
| Ver Eventos | ✅ | ✅ | ✅ |
| Ver Comunicados | ✅ | ✅ | ✅ |
| Cadastrar Escola | ❌ | ✅ | ✅ |
| Gerenciar Atletas | ❌ | ✅ | ✅ |
| Fazer Inscrições | ❌ | ✅ | ❌ |
| Criar Eventos | ❌ | ❌ | ✅ |
| Gerenciar Modalidades | ❌ | ❌ | ✅ |
| Publicar Avisos | ❌ | ❌ | ✅ |
| Gerar Relatórios | ❌ | ✅ | ✅ |
| Configurar Tema | ❌ | ❌ | ✅ |

---

## 🚀 Próximos Passos Sugeridos

1. **UX Improvements**
   - Adicionar onboarding para novos usuários
   - Implementar tooltips contextuais
   - Criar atalhos de teclado

2. **Performance**
   - Implementar lazy loading de componentes
   - Adicionar cache de dados
   - Otimizar imagens

3. **Acessibilidade**
   - Melhorar navegação por teclado
   - Adicionar ARIA labels
   - Implementar modo de alto contraste

4. **Features**
   - Sistema de notificações em tempo real
   - Chat de suporte
   - Histórico de alterações

---

**Última Atualização**: 2025-12-10  
**Versão**: 1.0.0 Simplificada
