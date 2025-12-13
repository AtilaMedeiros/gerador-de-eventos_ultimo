# Documentação de Regras de Negócio

Este documento centraliza as principais regras de negócio do sistema "Gerador de Eventos", extraídas da análise do código fonte e da implementação da Camada de Serviços.

---

## 1. Atores e Hierarquia (RBAC)

O sistema define papeis com hierarquias estritas de criação e visualização.

### Funções Globais (`GlobalRole`)
Definem o que o usuário pode fazer no sistema como um todo.
1.  **Administrador (`admin`)**: Acesso irrestrito. Pode criar qualquer outro usuário.
2.  **Produtor (`producer`)**: Pode criar seus próprios eventos e gerenciar sua equipe. Pode criar usuários do tipo "Produtor" (membros de equipe) ou "Responsável de Escola" (via convite/cadastro).
3.  **Responsável de Escola (`school_admin`)**: Focado na gestão de uma escola específica e seus atletas.
4.  **Técnico (`technician`)**: (Planejado) Subordinado à escola, faz inscrições.

**Regra de Criação de Usuários:**
- **Admin** -> Cria Admin, Produtor, Escola.
- **Produtor** -> Cria Produtor (Equipe), Escola.
- **Escola** -> Cria Técnico, Aluno (Atleta).
- *Restrição:* Ninguém abaixo de Admin pode criar um Admin.

### Funções por Evento (`EventRole`)
Definem permissões específicas dentro do escopo de um evento.
1.  **Proprietário (`owner`)**: Quem criou o evento. Pode editar tudo, publicar e deletar.
2.  **Assistente (`assistant`)**: Membro da equipe com permissão de edição (dados do evento, regulamentos), mas não pode deletar o evento.
3.  **Observador (`observer`)**: Apenas visualiza dados e relatórios. Não edita.

**Automação:** Ao criar um evento, o usuário criador recebe automaticamente o papel de `owner` para aquele evento.

---

## 2. Eventos

### Ciclo de Vida
1.  **Rascunho (`draft`)**: Estado inicial. Disponível apenas para a equipe (Owner/Assistant).
2.  **Publicado (`published`)**: Disponível na área pública e para inscrições (se dentro do prazo).

### Equipe do Evento
- Um evento pode ter múltiplos produtores associados.
- Um usuário pode ser `owner` do Evento A e `observer` do Evento B.
- A permissão é granular por par (Usuário + Evento).

---

## 3. Inscrições e Participantes

### Escolas (`SchoolService`)
- Responsável por manter dados cadastrais atualizados (Endereço, Diretor).
- A escola é a entidade "pai" de toda a delegação (Atletas, Técnicos).
- **Persistência**: Dados salvos em `ge_school_data` (Sessão) e `ge_schools_list` (Banco).

### Atletas (`AthleteService`)
- Devem pertencer a uma escola.
- **Validação de Categoria**: 
  - A elegibilidade (Idade) é validada via `AthleteService.validateCategory`.
  - Regra: `(Ano Atual - Ano Nascimento) >= MinAge E <= MaxAge`.
  - O cálculo considera mês/dia para precisão (embora regras esportivas variem, a implementação base é estrita).

### Inscrições (`InscriptionService`)
- Responsável por criar o objeto de inscrição padrão.
- **Limites e Prazos**:
  - Implementado esqueleto para validação de limites por escola.
  - Implementado esqueleto para validação de prazos (Inscrição Coletiva vs Individual).
- **Duplicidade**:
  - Impossível inscrever o mesmo CPF/Atleta na mesma Modalidade+Prova.

---

## 4. Segurança e Dados
- **Persistência**: Dados sensíveis (senhas) devem ser persistidos com hash (atualmente simulado).
- **Isolamento**: Um Produtor não deve ver eventos de outro Produtor a menos que seja adicionado à equipe.
- **Duplicidade**: O sistema deve impedir cadastro de usuários com mesmo e-mail ou CPF já existente.

---

**Nota Técnica:** As regras acima estão refletidas nas implementações de:
- `src/services/auth.service.ts`
- `src/services/user.service.ts`
- `src/services/event.service.ts`
