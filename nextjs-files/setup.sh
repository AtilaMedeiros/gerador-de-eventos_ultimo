#!/bin/bash

echo "🚀 Script de Setup do Projeto Next.js - Gerador de Eventos"
echo "============================================================"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Next.js (frontend-nextjs)"
    exit 1
fi

echo "📦 Instalando dependências principais..."
npm install @hookform/resolvers react-hook-form zod \
  class-variance-authority clsx tailwind-merge \
  next-themes date-fns cmdk input-otp sonner vaul \
  embla-carousel-react embla-carousel-autoplay \
  recharts jspdf jspdf-autotable xlsx \
  lucide-react @heroicons/react

echo ""
echo "📦 Instalando Tiptap (Rich Text Editor)..."
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-color \
  @tiptap/extension-font-family @tiptap/extension-link \
  @tiptap/extension-text-align @tiptap/extension-text-style

echo ""
echo "📦 Instalando Radix UI Components..."
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio @radix-ui/react-avatar \
  @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-hover-card \
  @radix-ui/react-label @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu @radix-ui/react-popover \
  @radix-ui/react-progress @radix-ui/react-radio-group \
  @radix-ui/react-scroll-area @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slider \
  @radix-ui/react-slot @radix-ui/react-switch \
  @radix-ui/react-tabs @radix-ui/react-toast \
  @radix-ui/react-toggle @radix-ui/react-toggle-group \
  @radix-ui/react-tooltip

echo ""
echo "📦 Atualizando TailwindCSS para v4..."
npm install tailwindcss@latest postcss@latest autoprefixer@latest \
  tailwindcss-animate@latest @tailwindcss/typography@latest

echo ""
echo "📦 Instalando DevDependencies..."
npm install --save-dev @types/jspdf @next/bundle-analyzer

echo ""
echo "🎨 Inicializando shadcn-ui..."
npx shadcn@latest init -y

echo ""
echo "📦 Instalando componentes shadcn-ui..."
npx shadcn@latest add accordion alert-dialog avatar badge breadcrumb \
  button calendar card carousel checkbox collapsible command \
  context-menu dialog drawer dropdown-menu form hover-card input \
  label menubar navigation-menu popover progress radio-group \
  scroll-area select separator sheet sidebar slider sonner \
  switch table tabs textarea toast toggle toggle-group tooltip -y

echo ""
echo "📁 Criando estrutura de diretórios..."
mkdir -p src/app/actions
mkdir -p src/app/area-do-produtor
mkdir -p src/app/area-do-participante
mkdir -p src/app/evento
mkdir -p src/contexts
mkdir -p src/components/forms
mkdir -p src/hooks

echo ""
echo "✅ Setup concluído com sucesso!"
echo ""
echo "📝 Próximos passos manuais:"
echo "   1. Copiar arquivos da pasta 'nextjs-files' para este projeto"
echo "   2. Executar: npm run dev"
echo "   3. Abrir: http://localhost:3000"
