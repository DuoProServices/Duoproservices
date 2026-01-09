# ============================================================================
# 🚀 SCRIPT DE DEPLOY AUTOMÁTICO - SUPABASE EDGE FUNCTION (WINDOWS)
# ============================================================================
# Este script faz o deploy da Edge Function "server" para o Supabase
# Project ID: lqpmyvizjfwzddxspacv
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 DEPLOY AUTOMÁTICO - DUOPRO SERVICES                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "lqpmyvizjfwzddxspacv"

# ============================================================================
# PASSO 1: Verificar se Supabase CLI está instalado
# ============================================================================
Write-Host "[1/4] Verificando Supabase CLI..." -ForegroundColor Blue

try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI instalado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI não está instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instalando via npm..." -ForegroundColor Yellow
    
    npm install -g supabase
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Falha na instalação. Instale manualmente:" -ForegroundColor Red
        Write-Host "npm install -g supabase" -ForegroundColor Yellow
        Write-Host "Ou visite: https://supabase.com/docs/guides/cli/getting-started" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Supabase CLI instalado!" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# PASSO 2: Fazer login no Supabase
# ============================================================================
Write-Host "[2/4] Fazendo login no Supabase..." -ForegroundColor Blue
Write-Host "Uma janela do navegador será aberta para autenticação." -ForegroundColor Yellow
Write-Host ""

supabase login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no login. Execute manualmente: supabase login" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# PASSO 3: Linkar com o projeto
# ============================================================================
Write-Host "[3/4] Linkando com o projeto Supabase..." -ForegroundColor Blue
Write-Host "Project ID: $PROJECT_ID" -ForegroundColor Yellow
Write-Host ""

supabase link --project-ref $PROJECT_ID

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha ao linkar. Execute manualmente:" -ForegroundColor Red
    Write-Host "supabase link --project-ref $PROJECT_ID" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Projeto linkado com sucesso!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# PASSO 4: Deploy da Edge Function
# ============================================================================
Write-Host "[4/4] Fazendo deploy da Edge Function 'server'..." -ForegroundColor Blue
Write-Host ""

supabase functions deploy server --project-ref $PROJECT_ID --no-verify-jwt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no deploy. Verifique os logs acima." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅✅✅ DEPLOY CONCLUÍDO COM SUCESSO! ✅✅✅" -ForegroundColor Green
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🎉 TUDO PRONTO! SEU BACKEND ESTÁ NO AR!                       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 URL da Edge Function:" -ForegroundColor Blue
Write-Host "https://$PROJECT_ID.supabase.co/functions/v1/make-server-c2a25be0"
Write-Host ""
Write-Host "🧪 Teste agora:" -ForegroundColor Yellow
Write-Host "curl https://$PROJECT_ID.supabase.co/functions/v1/make-server-c2a25be0/health"
Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Green
Write-Host "1. Recarregue seu aplicativo (F5)"
Write-Host "2. Faça login como admin"
Write-Host "3. Teste o upload de documentos"
Write-Host ""
Write-Host "✨ Tudo deve funcionar perfeitamente agora!" -ForegroundColor Cyan
Write-Host ""
