# 🚀 Script de Deploy para Produção - DuoPro Services (Windows PowerShell)
# Execute com: .\deploy-producao.ps1

Write-Host "🚀 =========================================" -ForegroundColor Cyan
Write-Host "   DEPLOY PARA PRODUÇÃO - DUOPRO SERVICES" -ForegroundColor Cyan
Write-Host "========================================= 🚀" -ForegroundColor Cyan
Write-Host ""

function Print-Success {
    param($message)
    Write-Host "✅ $message" -ForegroundColor Green
}

function Print-Warning {
    param($message)
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

function Print-Error {
    param($message)
    Write-Host "❌ $message" -ForegroundColor Red
}

# 1. Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Print-Error "Erro: package.json não encontrado!"
    Print-Warning "Execute este script na raiz do projeto."
    exit 1
}

Print-Success "Diretório verificado"

# 2. Verificar variáveis de ambiente
Write-Host ""
Write-Host "📋 Checando variáveis de ambiente..." -ForegroundColor Cyan

if (-not (Test-Path ".env.production") -and -not (Test-Path ".env")) {
    Print-Warning "Arquivo .env não encontrado!"
    Write-Host "Você precisará configurar as variáveis de ambiente no Netlify/Vercel."
    Write-Host ""
    Write-Host "Variáveis necessárias:"
    Write-Host "  - VITE_SUPABASE_URL"
    Write-Host "  - VITE_SUPABASE_ANON_KEY"
    Write-Host ""
}

# 3. Instalar dependências
Write-Host ""
Write-Host "📦 Instalando dependências..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Print-Error "Erro ao instalar dependências!"
    exit 1
}

Print-Success "Dependências instaladas"

# 4. Fazer build
Write-Host ""
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Print-Error "Erro no build!"
    exit 1
}

Print-Success "Build concluído com sucesso!"

# 5. Verificar se o build foi criado
if (-not (Test-Path "dist")) {
    Print-Error "Pasta dist/ não foi criada!"
    exit 1
}

Print-Success "Pasta dist/ criada"

# 6. Testar build localmente (opcional)
Write-Host ""
$testLocal = Read-Host "🧪 Deseja testar o build localmente antes de fazer deploy? (y/n)"

if ($testLocal -eq "y" -or $testLocal -eq "Y") {
    Print-Warning "Abrindo preview local em http://localhost:4173"
    Write-Host "Pressione Ctrl+C para parar e continuar com o deploy"
    npm run preview
}

# 7. Opções de deploy
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🌐 OPÇÕES DE DEPLOY:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Netlify (Recomendado)"
Write-Host "2️⃣  Vercel"
Write-Host "3️⃣  Apenas build (sem deploy)"
Write-Host ""
$deployOption = Read-Host "Escolha uma opção (1-3)"

switch ($deployOption) {
    "1" {
        Write-Host ""
        Write-Host "🌐 Deploy no Netlify" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar se Netlify CLI está instalado
        $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
        if (-not $netlifyInstalled) {
            Print-Warning "Netlify CLI não encontrado. Instalando..."
            npm install -g netlify-cli
        }
        
        Print-Success "Netlify CLI instalado"
        
        Write-Host ""
        Write-Host "Executando: netlify deploy --prod"
        Write-Host ""
        Print-Warning "Você precisará fazer login no Netlify se ainda não fez."
        Write-Host ""
        
        netlify deploy --prod
        
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Deploy no Netlify concluído!"
        } else {
            Print-Error "Erro no deploy do Netlify"
            exit 1
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🌐 Deploy no Vercel" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar se Vercel CLI está instalado
        $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
        if (-not $vercelInstalled) {
            Print-Warning "Vercel CLI não encontrado. Instalando..."
            npm install -g vercel
        }
        
        Print-Success "Vercel CLI instalado"
        
        Write-Host ""
        Write-Host "Executando: vercel --prod"
        Write-Host ""
        Print-Warning "Você precisará fazer login no Vercel se ainda não fez."
        Write-Host ""
        
        vercel --prod
        
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Deploy no Vercel concluído!"
        } else {
            Print-Error "Erro no deploy do Vercel"
            exit 1
        }
    }
    
    "3" {
        Print-Success "Build concluído. Pasta dist/ está pronta para deploy manual."
        Write-Host ""
        Write-Host "📁 Para fazer deploy manual:"
        Write-Host "   1. Acesse Netlify/Vercel"
        Write-Host "   2. Faça drag & drop da pasta dist/"
        Write-Host "   3. Configure as variáveis de ambiente"
    }
    
    default {
        Print-Error "Opção inválida!"
        exit 1
    }
}

# 8. Checklist pós-deploy
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ CHECKLIST PÓS-DEPLOY" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Não esqueça de fazer:"
Write-Host ""
Write-Host "1. ⚙️  Configurar variáveis de ambiente no Netlify/Vercel"
Write-Host "   - VITE_SUPABASE_URL"
Write-Host "   - VITE_SUPABASE_ANON_KEY"
Write-Host ""
Write-Host "2. 📧 Configurar RESEND_API_KEY no Supabase Edge Functions"
Write-Host ""
Write-Host "3. 🔗 Configurar domínio personalizado (opcional)"
Write-Host ""
Write-Host "4. 🔍 Adicionar site no Google Search Console"
Write-Host "   https://search.google.com/search-console"
Write-Host ""
Write-Host "5. 📊 Configurar Google Analytics"
Write-Host ""
Write-Host "6. 🗺️  Submeter sitemap:"
Write-Host "   URL: https://seusite.com/sitemap.xml"
Write-Host ""
Write-Host "7. 🧪 Testar todo o fluxo:"
Write-Host "   - Signup/Login"
Write-Host "   - Upload de documentos"
Write-Host "   - Sistema de pagamento"
Write-Host "   - Envio de emails"
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Print-Success "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"

Write-Host ""
Write-Host "📖 Para mais informações, leia:"
Write-Host "   GUIA_COMPLETO_PRODUCAO_SEO.md"
Write-Host ""
