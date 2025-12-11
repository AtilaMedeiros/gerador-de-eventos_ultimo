# 🕳️ Pitfalls e Aprendizados

Este documento serve como uma base de conhecimento para registrar padrões de erros recorrentes e comportamentos inesperados do framework ou bibliotecas. O objetivo é criar um **catálogo de padrões e princípios**, e não uma lista de bugs específicos de telas.

Ao registrar um novo item, foque na **causa estrutural** (ex: "Input com classe de tema escuro") em vez da localização específica (ex: "Input do Login"). Isso permite que a IA ou desenvolvedores identifiquem o mesmo problema em qualquer outro lugar do código.

---

## 📝 Template de Registro

### [Data] - [Nome do Padrão/Princípio]

**O Padrão (Onde ocorre):**
Descreva o componente ou configuração genérica onde o erro acontece (ex: "Inputs utilizando classes condicionais `dark:` com opacidade").

**O Comportamento Inesperado:**
Qual é o resultado visual ou funcional indesejado que esse padrão gera? (ex: "O elemento renderiza com fundo acinzentado/translúcido quando o SO do usuário está em modo Dark").

**A Análise Técnica (Causa Abstrata):**
Explique a interação entre as tecnologias que causa o problema.
- Configuração Global (ex: `ThemeProvider` setado como system).
- Classe CSS (ex: uso de `dark:bg-secondary/20`).

**A Regra de Correção:**
Qual é a diretriz para corrigir isso em qualquer lugar do código?

**Exemplo de Código (Padrão Incorreto vs Correto):**
```tsx
// ❌ Padrão Incorreto
<Component className="problematic-class" />

// ✅ Padrão Correto
<Component className="fixed-class" />
```

---

## 📚 Base de Conhecimento

### 11/12/2025 - Inputs com Fundo Cinza (Transparência em Dark Mode)

**O Padrão (Onde ocorre):**
Em componentes de formulário (`<Input />`, `<Textarea />`) que utilizam classes utilitárias do Tailwind para controle de cor de fundo baseadas no tema escuro (`dark:`), especificamente ao usar cores com opacidade (ex: `/20`).

**O Comportamento Inesperado:**
Os campos de entrada aparecem com fundo cinza ou escurecido, destoando do design esperado (geralmente branco), mesmo que a aplicação pareça estar em "modo claro" visualmente ou quando se deseja um visual "clean" independente do tema do sistema operacional.

**A Análise Técnica (Causa Abstrata):**
O problema ocorre devido à combinação de três fatores:
1.  **Detecção de Tema do SO:** O `ThemeProvider` (next-themes) configurado com `defaultTheme="system"` detecta se o SO do usuário está em Dark Mode e aplica a classe `.dark` no HTML automaticamente.
2.  **Classes com Opacidade:** O uso de classes como `dark:bg-secondary/20` faz com que, sob a condição acima, o input herde uma cor de fundo semitransparente sobreposta ao fundo do container.
3.  **User Agent Styles:** O comportamento nativo dos inputs (especialmente com autofill) pode somar camadas de cor indesejadas.

**A Regra de Correção:**
Para garantir inputs consistentemente brancos (ou da cor sólida desejada), deve-se sobrescrever explicitamente a classe `dark:` com uma cor sólida, removendo a transparência ou a referência à cor secundária translúcida. Se o design exige fundo branco puro, force `dark:bg-white`.

**Exemplo de Código (Padrão Incorreto vs Correto):**
```tsx
// ❌ Padrão Incorreto: Fica cinza/translúcido se o SO do usuário for Dark
<Input
    className="bg-white dark:bg-secondary/20" 
/>

// ✅ Padrão Correto: Garante branco sólido em qualquer tema
<Input
    className="bg-white dark:bg-white" 
/>
```

### 11/12/2025 - Perda de Fidelidade Visual (Transparência vs Cor Sólida)

**O Padrão (Onde ocorre):**
Ao tentar replicar fundos "pastéis" ou "muito claros" (ex: cards informativos) usando cores da escala 50 do Tailwind (ex: `bg-purple-50`).

**O Comportamento Inesperado:**
A cor renderizada é sólida e opaca, parecendo "pesada" ou diferente do original, que tinha uma qualidade translúcida/vidrosa, mesmo que o código original também usasse nomes de classe similares.

**A Análise Técnica (Causa Abstrata):**
Cores da escala `50` no Tailwind v3 são 100% opacas. O efeito visual de "leveza" ou "transparência" do projeto antigo muitas vezes vem de uma opacidade aplicada sobre a cor, permitindo que o fundo (branco ou escuro) interaja com o elemento.

**A Regra de Correção:**
Para obter o efeito "ultra-clear" ou transparente:
1.  **Não use** `bg-color-50` (Sólido).
2.  **Use** `bg-color-500/5` ou `bg-color-500/10` (Cor base com baixa opacidade). Isso cria uma tintura (tint) verdadeira.

**Exemplo de Código:**
```tsx
// ❌ Padrão Incorreto (Sólido, parece "duro")
<div className="bg-purple-50" />

// ✅ Padrão Correto (Translúcido, fiel ao "Ultra Premium")
<div className="bg-purple-500/5" />
```

### 11/12/2025 - Perda de Fidelidade Visual (Cores Incorretas na Migração)

**O Padrão (Onde ocorre):**
Na tentativa de "melhorar" ou "modernizar" o design ao migrar para Next.js, alterando cores e estilos que já estavam validados no projeto React (ex: trocar tons pastéis suaves por gradientes vibrantes em cards secundários).

**O Comportamento Inesperado:**
A interface migrada diverge visualmente do original, quebrando a identidade visual estabelecida e a hierarquia de informações (elementos secundários chamando mais atenção que os primários).

**A Análise Técnica (Causa Abstrata):**
Suposição incorreta de que "cores mais fortes" ou "gradientes" são sempre melhores ou mais "premium", ignorando o design system original que utiliza contraste intencional entre elementos vibrantes (destaque) e pastéis (informação secundária).

**A Regra de Correção:**
**Fidelidade Absoluta:** O projeto original (React em `src/`) é a fonte da verdade. Se lá é pastel, no Next.js deve ser pastel. Não tente "reinventar" o design durante a migração técnica, a menos que explicitamente solicitado.

**Exemplo de Código (Padrão Incorreto vs Correto - Caso Cards Secundários):**
```tsx
// ❌ Padrão Incorreto (Alteração não solicitada para vibrante)
<Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white" />

// ✅ Padrão Correto (Fiel ao Original Pastel)
<Card className="bg-purple-50 border-purple-100 text-purple-900" />
```
