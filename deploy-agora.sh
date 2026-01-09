#!/bin/bash

# ============================================================================
# 🚀 DEPLOY RÁPIDO - APENAS COPIE E COLE ESTE SCRIPT NO TERMINAL
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 DEPLOY BACKEND - DUOPRO SERVICES                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se está na pasta correta
if [ ! -d "supabase/functions/server" ]; then
    echo "❌ ERRO: Execute este script na raiz do projeto!"
    echo "   (Onde está a pasta 'supabase')"
    exit 1
fi

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "📦 Instalando Supabase CLI..."
    npm install -g supabase
    
    if [ $? -ne 0 ]; then
        echo "❌ Falha ao instalar Supabase CLI"
        echo "   Execute manualmente: npm install -g supabase"
        exit 1
    fi
fi

echo "✅ Supabase CLI instalado!"
echo ""

# Login
echo "🔐 Fazendo login no Supabase..."
echo "   (Uma janela do navegador será aberta)"
echo ""
supabase login

if [ $? -ne 0 ]; then
    echo "❌ Falha no login"
    exit 1
fi

echo "✅ Login realizado!"
echo ""

# Link project
echo "🔗 Conectando ao projeto..."
supabase link --project-ref lqpmyvizjfwzddxspacv

if [ $? -ne 0 ]; then
    echo "❌ Falha ao conectar"
    exit 1
fi

echo "✅ Projeto conectado!"
echo ""

# Deploy
echo "🚀 Fazendo deploy da Edge Function..."
echo ""
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt

if [ $? -ne 0 ]; then
    echo "❌ Falha no deploy"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅✅✅ DEPLOY CONCLUÍDO COM SUCESSO! ✅✅✅                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 URL da API:"
echo "   https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0"
echo ""

# Teste automático
echo "🧪 Testando backend..."
echo ""

TEST_URL="https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health"

if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL" --max-time 10)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ BACKEND ESTÁ ONLINE E FUNCIONANDO!"
    else
        echo "⚠️  Backend respondeu com status: $HTTP_CODE"
        echo "   Aguarde 30 segundos e teste novamente"
    fi
else
    echo "⚠️  curl não encontrado, teste manual necessário"
fi

echo ""
echo "🧪 Teste manual:"
echo "   curl https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health"
echo ""
echo "📊 Ou execute: node test-backend.js"
echo ""
echo "✨ Recarregue seu app (F5) e faça login!"
echo ""
echo "🎉 Os erros 'Failed to fetch' devem sumir agora!"
echo ""