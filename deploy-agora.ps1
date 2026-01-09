# ============================================================================
# 🚀 DEPLOY RÁPIDO - APENAS COPIE E COLE ESTE SCRIPT NO POWERSHELL
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 DEPLOY BACKEND - DUOPRO SERVICES                           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
if (-not (Test-Path "supabase/functions/server")) {
    Write-Host "❌ ERRO: Execute este script na raiz do projeto!" -ForegroundColor Red
    Write-Host "   (Onde está a pasta 'supabase')" -ForegroundColor Yellow
    exit 1
}

# Verificar se Supabase CLI está instalado
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI instalado!" -ForegroundColor Green
} catch {
    Write-Host "📦 Instalando Supabase CLI..." -ForegroundColor Yellow
    npm install -g supabase
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Falha ao instalar Supabase CLI" -ForegroundColor Red
        Write-Host "   Execute manualmente: npm install -g supabase" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Supabase CLI instalado!" -ForegroundColor Green
}

Write-Host ""

# Login
Write-Host "🔐 Fazendo login no Supabase..." -ForegroundColor Blue
Write-Host "   (Uma janela do navegador será aberta)" -ForegroundColor Yellow
Write-Host ""
supabase login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no login" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Login realizado!" -ForegroundColor Green
Write-Host ""

# Link project
Write-Host "🔗 Conectando ao projeto..." -ForegroundColor Blue
supabase link --project-ref lqpmyvizjfwzddxspacv

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha ao conectar" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Projeto conectado!" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "🚀 Fazendo deploy da Edge Function..." -ForegroundColor Blue
Write-Host ""
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no deploy" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ✅✅✅ DEPLOY CONCLUÍDO COM SUCESSO! ✅✅✅                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 URL da API:" -ForegroundColor Blue
Write-Host "   https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0"
Write-Host ""

# Teste automático
Write-Host "🧪 Testando backend..." -ForegroundColor Yellow
Write-Host ""

$testUrl = "https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health"

try {
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ BACKEND ESTÁ ONLINE E FUNCIONANDO!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Backend respondeu com status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro ao testar backend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Aguarde 30 segundos e teste novamente manualmente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🧪 Teste manual:" -ForegroundColor Yellow
Write-Host "   curl https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health"
Write-Host ""
Write-Host "📊 Ou execute: node test-backend.js" -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ Recarregue seu app (F5) e faça login!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Os erros 'Failed to fetch' devem sumir agora!" -ForegroundColor Cyan
Write-Host ""