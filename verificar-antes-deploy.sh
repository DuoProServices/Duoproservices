#!/bin/bash

# 🔍 SCRIPT DE VERIFICAÇÃO PRÉ-DEPLOY
# Execute antes de fazer deploy para verificar se tudo está OK

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🔍 VERIFICAÇÃO PRÉ-DEPLOY - CANADIAN TAX PRO                ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo "📋 Verificando arquivos essenciais..."
echo ""

# Verificar package.json
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅${NC} package.json encontrado"
else
    echo -e "${RED}❌${NC} package.json NÃO encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Verificar vite.config.ts
if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}✅${NC} vite.config.ts encontrado"
else
    echo -e "${RED}❌${NC} vite.config.ts NÃO encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Verificar netlify.toml
if [ -f "netlify.toml" ]; then
    echo -e "${GREEN}✅${NC} netlify.toml encontrado"
else
    echo -e "${YELLOW}⚠️${NC}  netlify.toml NÃO encontrado (recomendado)"
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar index.html
if [ -f "index.html" ]; then
    echo -e "${GREEN}✅${NC} index.html encontrado"
else
    echo -e "${RED}❌${NC} index.html NÃO encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Verificar App.tsx
if [ -f "src/app/App.tsx" ]; then
    echo -e "${GREEN}✅${NC} src/app/App.tsx encontrado"
else
    echo -e "${RED}❌${NC} src/app/App.tsx NÃO encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Verificar main.tsx
if [ -f "src/main.tsx" ]; then
    echo -e "${GREEN}✅${NC} src/main.tsx encontrado"
else
    echo -e "${RED}❌${NC} src/main.tsx NÃO encontrado"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "📦 Verificando dependências..."
echo ""

# Verificar se node_modules existe
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} node_modules instalado"
else
    echo -e "${YELLOW}⚠️${NC}  node_modules NÃO encontrado - execute: npm install"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "🔧 Verificando Edge Functions..."
echo ""

# Verificar supabase/functions/server
if [ -f "supabase/functions/server/index.tsx" ]; then
    echo -e "${GREEN}✅${NC} Edge Function 'server' encontrada"
else
    echo -e "${RED}❌${NC} Edge Function 'server' NÃO encontrada"
    ERRORS=$((ERRORS + 1))
fi

# Verificar kv_store.tsx
if [ -f "supabase/functions/server/kv_store.tsx" ]; then
    echo -e "${GREEN}✅${NC} kv_store.tsx encontrado"
else
    echo -e "${RED}❌${NC} kv_store.tsx NÃO encontrado"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🔑 Verificando configurações..."
echo ""

# Verificar utils/supabase/info.tsx
if [ -f "utils/supabase/info.tsx" ]; then
    echo -e "${GREEN}✅${NC} Supabase info configurado"
    
    # Verificar se tem o project ID
    if grep -q "lqpmyvizjfwzddxspacv" utils/supabase/info.tsx; then
        echo -e "${GREEN}✅${NC} Project ID correto"
    else
        echo -e "${RED}❌${NC} Project ID incorreto ou não configurado"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌${NC} utils/supabase/info.tsx NÃO encontrado"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "📱 Verificando componentes principais..."
echo ""

COMPONENTS=(
    "src/app/pages/LoginPage.tsx"
    "src/app/pages/SignupPage.tsx"
    "src/app/pages/DashboardPage.tsx"
    "src/app/pages/AdminDashboardPage.tsx"
    "src/app/pages/ContentCalendarDashboard.tsx"
    "src/app/pages/MarketingImageGenerator.tsx"
    "src/app/contexts/AuthContext.tsx"
    "src/app/contexts/LanguageContext.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo -e "${GREEN}✅${NC} $(basename $component)"
    else
        echo -e "${RED}❌${NC} $(basename $component) NÃO encontrado"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "📊 Verificando dados do Content Calendar..."
echo ""

if [ -f "src/app/data/contentCalendar.ts" ]; then
    echo -e "${GREEN}✅${NC} contentCalendar.ts encontrado"
    
    # Contar posts de janeiro
    POSTS_COUNT=$(grep -c "postNumber:" src/app/data/contentCalendar.ts || echo "0")
    if [ "$POSTS_COUNT" -ge 14 ]; then
        echo -e "${GREEN}✅${NC} $POSTS_COUNT posts encontrados (14+ esperados)"
    else
        echo -e "${YELLOW}⚠️${NC}  Apenas $POSTS_COUNT posts encontrados (esperado: 14)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}❌${NC} contentCalendar.ts NÃO encontrado"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🧪 Testando build..."
echo ""

# Tentar fazer build
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Build funcionou com sucesso"
    
    # Verificar se dist foi criado
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅${NC} Pasta dist criada"
        
        # Verificar tamanho
        DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
        echo -e "${GREEN}✅${NC} Tamanho do build: $DIST_SIZE"
    else
        echo -e "${RED}❌${NC} Pasta dist NÃO foi criada"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌${NC} Build FALHOU"
    echo -e "${YELLOW}💡${NC} Execute 'npm run build' para ver os erros"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  📊 RESULTADO DA VERIFICAÇÃO                                 ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 PERFEITO! Tudo está pronto para deploy!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Faça o deploy da Edge Function (veja DEPLOY_COMPLETO_FINAL.md)"
    echo "2. Faça o deploy no Netlify (veja DEPLOY_COMPLETO_FINAL.md)"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Tudo OK, mas com $WARNINGS aviso(s)${NC}"
    echo ""
    echo "Você pode fazer o deploy, mas verifique os avisos acima."
    exit 0
else
    echo -e "${RED}❌ ATENÇÃO! Encontrados $ERRORS erro(s) e $WARNINGS aviso(s)${NC}"
    echo ""
    echo "Corrija os erros acima antes de fazer deploy!"
    echo ""
    echo "Precisa de ajuda? Verifique:"
    echo "- SOLUCAO_DE_PROBLEMAS.md"
    echo "- DEPLOY_COMPLETO_FINAL.md"
    exit 1
fi
