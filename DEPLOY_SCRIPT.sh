#!/bin/bash

# ============================================================================
# 🚀 SCRIPT DE DEPLOY AUTOMÁTICO - SUPABASE EDGE FUNCTION
# ============================================================================
# Este script faz o deploy da Edge Function "server" para o Supabase
# Project ID: lqpmyvizjfwzddxspacv
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 DEPLOY AUTOMÁTICO - DUOPRO SERVICES                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_ID="lqpmyvizjfwzddxspacv"

# ============================================================================
# PASSO 1: Verificar se Supabase CLI está instalado
# ============================================================================
echo -e "${BLUE}[1/4]${NC} Verificando Supabase CLI..."

if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI não está instalado!${NC}"
    echo ""
    echo -e "${YELLOW}Instalando Supabase CLI...${NC}"
    
    # Detectar sistema operacional
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "Instalando via Homebrew..."
        brew install supabase/tap/supabase
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "Instalando via npm..."
        npm install -g supabase
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        echo "Instalando via npm..."
        npm install -g supabase
    else
        echo -e "${RED}Sistema operacional não suportado. Instale manualmente:${NC}"
        echo "https://supabase.com/docs/guides/cli/getting-started"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Supabase CLI instalado!${NC}"
echo ""

# ============================================================================
# PASSO 2: Fazer login no Supabase
# ============================================================================
echo -e "${BLUE}[2/4]${NC} Fazendo login no Supabase..."
echo -e "${YELLOW}Uma janela do navegador será aberta para autenticação.${NC}"
echo ""

supabase login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Falha no login. Execute manualmente: supabase login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Login realizado com sucesso!${NC}"
echo ""

# ============================================================================
# PASSO 3: Linkar com o projeto
# ============================================================================
echo -e "${BLUE}[3/4]${NC} Linkando com o projeto Supabase..."
echo -e "${YELLOW}Project ID: ${PROJECT_ID}${NC}"
echo ""

supabase link --project-ref $PROJECT_ID

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Falha ao linkar. Execute manualmente:${NC}"
    echo "supabase link --project-ref $PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}✅ Projeto linkado com sucesso!${NC}"
echo ""

# ============================================================================
# PASSO 4: Deploy da Edge Function
# ============================================================================
echo -e "${BLUE}[4/4]${NC} Fazendo deploy da Edge Function 'server'..."
echo ""

supabase functions deploy server --project-ref $PROJECT_ID --no-verify-jwt

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Falha no deploy. Verifique os logs acima.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅✅✅ DEPLOY CONCLUÍDO COM SUCESSO! ✅✅✅${NC}"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🎉 TUDO PRONTO! SEU BACKEND ESTÁ NO AR!                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}📍 URL da Edge Function:${NC}"
echo "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0"
echo ""
echo -e "${YELLOW}🧪 Teste agora:${NC}"
echo "curl https://${PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/health"
echo ""
echo -e "${GREEN}🚀 Próximos passos:${NC}"
echo "1. Recarregue seu aplicativo (F5)"
echo "2. Faça login como admin"
echo "3. Teste o upload de documentos"
echo ""
echo "✨ Tudo deve funcionar perfeitamente agora!"
echo ""
