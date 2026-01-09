# 🔍 SCRIPT DE VERIFICAÇÃO PRÉ-DEPLOY (Windows PowerShell)
# Execute antes de fazer deploy para verificar se tudo está OK

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔍 VERIFICAÇÃO PRÉ-DEPLOY - CANADIAN TAX PRO                ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ERRORS = 0
$WARNINGS = 0

Write-Host "📋 Verificando arquivos essenciais..." -ForegroundColor Yellow
Write-Host ""

# Verificar package.json
if (Test-Path "package.json") {
    Write-Host "✅ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ package.json NÃO encontrado" -ForegroundColor Red
    $ERRORS++
}

# Verificar vite.config.ts
if (Test-Path "vite.config.ts") {
    Write-Host "✅ vite.config.ts encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ vite.config.ts NÃO encontrado" -ForegroundColor Red
    $ERRORS++
}

# Verificar netlify.toml
if (Test-Path "netlify.toml") {
    Write-Host "✅ netlify.toml encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  netlify.toml NÃO encontrado (recomendado)" -ForegroundColor Yellow
    $WARNINGS++
}

# Verificar index.html
if (Test-Path "index.html") {
    Write-Host "✅ index.html encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ index.html NÃO encontrado" -ForegroundColor Red
    $ERRORS++
}

# Verificar App.tsx
if (Test-Path "src/app/App.tsx") {
    Write-Host "✅ src/app/App.tsx encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ src/app/App.tsx NÃO encontrado" -ForegroundColor Red
    $ERRORS++
}

# Verificar main.tsx
if (Test-Path "src/main.tsx") {
    Write-Host "✅ src/main.tsx encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ src/main.tsx NÃO encontrado" -ForegroundColor Red
    $ERRORS++
}

Write-Host ""
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow
Write-Host ""

# Verificar se node_modules existe
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules instalado" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules NÃO encontrado - execute: npm install" -ForegroundColor Yellow
    $WARNINGS++
}

Write-Host ""
Write-Host "🔧 Verificando Edge Functions..." -ForegroundColor Yellow
Write-Host ""

# Verificar supabase/functions/server
if (Test-Path "supabase/functions/server/index.tsx") {
    Write-Host "✅ Edge Function 'server' encontrada" -ForegroundColor Green
} else {
    Write-Host "❌ Edge Function 'server' NÃO encontrada" -ForegroundColor Red
    $ERRORS++
}

# Verificar kv_store.tsx
if (Test-Path "supabase/functions/server/kv_store.tsx") {
    Write-Host "✅ kv_store.tsx encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ kv_store.tsx NÃO encontrado" -ForegroundColor Red
    $ERRORS++
}

Write-Host ""
Write-Host "🔑 Verificando configurações..." -ForegroundColor Yellow
Write-Host ""

# Verificar utils/supabase/info.tsx
if (Test-Path "utils/supabase/info.tsx") {
    Write-Host "✅ Supabase info configurado" -ForegroundColor Green
    
    # Verificar se tem o project ID
    $content = Get-Content "utils/supabase/info.tsx" -Raw
    if ($content -match "lqpmyvizjfwzddxspacv") {
        Write-Host "✅ Project ID correto" -ForegroundColor Green
    } else {
        Write-Host "❌ Project ID incorreto ou não configurado" -ForegroundColor Red
        $ERRORS++
    }
} else {
    Write-Host "❌ utils/supabase/info.tsx NÃO encontrado" -ForegroundColor Red
    $ERRORS++
}

Write-Host ""
Write-Host "📱 Verificando componentes principais..." -ForegroundColor Yellow
Write-Host ""

$COMPONENTS = @(
    "src/app/pages/LoginPage.tsx",
    "src/app/pages/SignupPage.tsx",
    "src/app/pages/DashboardPage.tsx",
    "src/app/pages/AdminDashboardPage.tsx",
    "src/app/pages/ContentCalendarDashboard.tsx",
    "src/app/pages/MarketingImageGenerator.tsx",
    "src/app/contexts/AuthContext.tsx",
    "src/app/contexts/LanguageContext.tsx"
)

foreach ($component in $COMPONENTS) {
    if (Test-Path $component) {
        $basename = Split-Path $component -Leaf
        Write-Host "✅ $basename" -ForegroundColor Green
    } else {
        $basename = Split-Path $component -Leaf
        Write-Host "❌ $basename NÃO encontrado" -ForegroundColor Red
        $ERRORS++
    }
}

Write-Host ""
Write-Host "📊 Verificando dados do Content Calendar..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "src/app/data/contentCalendar.ts") {
    Write-Host "✅ contentCalendar.ts encontrado" -ForegroundColor Green
    
    # Contar posts de janeiro
    $content = Get-Content "src/app/data/contentCalendar.ts" -Raw
    $POSTS_COUNT = ([regex]::Matches($content, "postNumber:")).Count
    
    if ($POSTS_COUNT -ge 14) {
        Write-Host "✅ $POSTS_COUNT posts encontrados (14+ esperados)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Apenas $POSTS_COUNT posts encontrados (esperado: 14)" -ForegroundColor Yellow
        $WARNINGS++
    }
} else {
    Write-Host "❌ contentCalendar.ts NÃO encontrado" -ForegroundColor Red
    $ERRORS++
}

Write-Host ""
Write-Host "🧪 Testando build..." -ForegroundColor Yellow
Write-Host ""

# Tentar fazer build
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build funcionou com sucesso" -ForegroundColor Green
        
        # Verificar se dist foi criado
        if (Test-Path "dist") {
            Write-Host "✅ Pasta dist criada" -ForegroundColor Green
            
            # Verificar tamanho
            $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
            Write-Host "✅ Tamanho do build: $([math]::Round($distSize, 2)) MB" -ForegroundColor Green
        } else {
            Write-Host "❌ Pasta dist NÃO foi criada" -ForegroundColor Red
            $ERRORS++
        }
    } else {
        Write-Host "❌ Build FALHOU" -ForegroundColor Red
        Write-Host "💡 Execute 'npm run build' para ver os erros" -ForegroundColor Yellow
        $ERRORS++
    }
} catch {
    Write-Host "❌ Erro ao executar build" -ForegroundColor Red
    Write-Host "💡 Execute 'npm run build' manualmente para ver os erros" -ForegroundColor Yellow
    $ERRORS++
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📊 RESULTADO DA VERIFICAÇÃO                                 ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($ERRORS -eq 0 -and $WARNINGS -eq 0) {
    Write-Host "🎉 PERFEITO! Tudo está pronto para deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:"
    Write-Host "1. Faça o deploy da Edge Function (veja DEPLOY_COMPLETO_FINAL.md)"
    Write-Host "2. Faça o deploy no Netlify (veja DEPLOY_COMPLETO_FINAL.md)"
    exit 0
} elseif ($ERRORS -eq 0) {
    Write-Host "⚠️  Tudo OK, mas com $WARNINGS aviso(s)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Você pode fazer o deploy, mas verifique os avisos acima."
    exit 0
} else {
    Write-Host "❌ ATENÇÃO! Encontrados $ERRORS erro(s) e $WARNINGS aviso(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Corrija os erros acima antes de fazer deploy!"
    Write-Host ""
    Write-Host "Precisa de ajuda? Verifique:"
    Write-Host "- SOLUCAO_DE_PROBLEMAS.md"
    Write-Host "- DEPLOY_COMPLETO_FINAL.md"
    exit 1
}
