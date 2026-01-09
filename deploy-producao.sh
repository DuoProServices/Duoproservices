#!/bin/bash

# 🚀 Script de Deploy para Produção - DuoPro Services
# Execute com: bash deploy-producao.sh

echo "🚀 ========================================="
echo "   DEPLOY PARA PRODUÇÃO - DUOPRO SERVICES"
echo "========================================= 🚀"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para printar com cor
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Erro: package.json não encontrado!"
    print_warning "Execute este script na raiz do projeto."
    exit 1
fi

print_success "Diretório verificado"

# 2. Verificar se tem as variáveis de ambiente necessárias
echo ""
echo "📋 Checando variáveis de ambiente..."

if [ ! -f ".env.production" ] && [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado!"
    echo "Você precisará configurar as variáveis de ambiente no Netlify/Vercel."
    echo ""
    echo "Variáveis necessárias:"
    echo "  - VITE_SUPABASE_URL"
    echo "  - VITE_SUPABASE_ANON_KEY"
    echo ""
fi

# 3. Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    print_error "Erro ao instalar dependências!"
    exit 1
fi

print_success "Dependências instaladas"

# 4. Fazer build
echo ""
echo "🔨 Fazendo build do projeto..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Erro no build!"
    exit 1
fi

print_success "Build concluído com sucesso!"

# 5. Verificar se o build foi criado
if [ ! -d "dist" ]; then
    print_error "Pasta dist/ não foi criada!"
    exit 1
fi

print_success "Pasta dist/ criada"

# 6. Testar build localmente (opcional)
echo ""
echo "🧪 Deseja testar o build localmente antes de fazer deploy? (y/n)"
read -r test_local

if [ "$test_local" = "y" ] || [ "$test_local" = "Y" ]; then
    print_warning "Abrindo preview local em http://localhost:4173"
    echo "Pressione Ctrl+C para parar e continuar com o deploy"
    npm run preview
fi

# 7. Opções de deploy
echo ""
echo "========================================="
echo "🌐 OPÇÕES DE DEPLOY:"
echo "========================================="
echo ""
echo "1️⃣  Netlify (Recomendado)"
echo "2️⃣  Vercel"
echo "3️⃣  Apenas build (sem deploy)"
echo ""
echo "Escolha uma opção (1-3):"
read -r deploy_option

case $deploy_option in
    1)
        echo ""
        echo "🌐 Deploy no Netlify"
        echo ""
        
        # Verificar se Netlify CLI está instalado
        if ! command -v netlify &> /dev/null; then
            print_warning "Netlify CLI não encontrado. Instalando..."
            npm install -g netlify-cli
        fi
        
        print_success "Netlify CLI instalado"
        
        echo ""
        echo "Executando: netlify deploy --prod"
        echo ""
        print_warning "Você precisará fazer login no Netlify se ainda não fez."
        echo ""
        
        netlify deploy --prod
        
        if [ $? -eq 0 ]; then
            print_success "Deploy no Netlify concluído!"
        else
            print_error "Erro no deploy do Netlify"
            exit 1
        fi
        ;;
    
    2)
        echo ""
        echo "🌐 Deploy no Vercel"
        echo ""
        
        # Verificar se Vercel CLI está instalado
        if ! command -v vercel &> /dev/null; then
            print_warning "Vercel CLI não encontrado. Instalando..."
            npm install -g vercel
        fi
        
        print_success "Vercel CLI instalado"
        
        echo ""
        echo "Executando: vercel --prod"
        echo ""
        print_warning "Você precisará fazer login no Vercel se ainda não fez."
        echo ""
        
        vercel --prod
        
        if [ $? -eq 0 ]; then
            print_success "Deploy no Vercel concluído!"
        else
            print_error "Erro no deploy do Vercel"
            exit 1
        fi
        ;;
    
    3)
        print_success "Build concluído. Pasta dist/ está pronta para deploy manual."
        echo ""
        echo "📁 Para fazer deploy manual:"
        echo "   1. Acesse Netlify/Vercel"
        echo "   2. Faça drag & drop da pasta dist/"
        echo "   3. Configure as variáveis de ambiente"
        ;;
    
    *)
        print_error "Opção inválida!"
        exit 1
        ;;
esac

# 8. Checklist pós-deploy
echo ""
echo "========================================="
echo "✅ CHECKLIST PÓS-DEPLOY"
echo "========================================="
echo ""
echo "Não esqueça de fazer:"
echo ""
echo "1. ⚙️  Configurar variáveis de ambiente no Netlify/Vercel"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "2. 📧 Configurar RESEND_API_KEY no Supabase Edge Functions"
echo ""
echo "3. 🔗 Configurar domínio personalizado (opcional)"
echo ""
echo "4. 🔍 Adicionar site no Google Search Console"
echo "   https://search.google.com/search-console"
echo ""
echo "5. 📊 Configurar Google Analytics"
echo ""
echo "6. 🗺️  Submeter sitemap:"
echo "   URL: https://seusite.com/sitemap.xml"
echo ""
echo "7. 🧪 Testar todo o fluxo:"
echo "   - Signup/Login"
echo "   - Upload de documentos"
echo "   - Sistema de pagamento"
echo "   - Envio de emails"
echo ""
echo "========================================="
echo ""

print_success "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"

echo ""
echo "📖 Para mais informações, leia:"
echo "   GUIA_COMPLETO_PRODUCAO_SEO.md"
echo ""
