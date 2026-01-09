# Script para Baixar o Projeto Fiscalista no Windows
# Execute este script no PowerShell

Write-Host "🚀 Preparando Download do Projeto Fiscalista..." -ForegroundColor Green

# Criar pasta do projeto
$projectPath = "C:\Projetos\fiscalista-site"
Write-Host "📁 Criando pasta: $projectPath" -ForegroundColor Cyan

if (Test-Path $projectPath) {
    Write-Host "⚠️  Pasta já existe. Removendo..." -ForegroundColor Yellow
    Remove-Item -Path $projectPath -Recurse -Force
}

New-Item -Path $projectPath -ItemType Directory -Force | Out-Null

# Ir para a pasta
Set-Location $projectPath

Write-Host "✅ Pasta criada com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Abra o Figma Make no navegador" -ForegroundColor White
Write-Host "2. Vá em: Share → Export Code (ou similar)" -ForegroundColor White
Write-Host "3. Baixe como ZIP" -ForegroundColor White
Write-Host "4. Extraia o ZIP para: $projectPath" -ForegroundColor White
Write-Host ""
Write-Host "OU" -ForegroundColor Yellow
Write-Host ""
Write-Host "Execute o próximo script para criar os arquivos manualmente:" -ForegroundColor White
Write-Host ".\criar-arquivos-principais.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pasta do projeto: $projectPath" -ForegroundColor Green

# Inicializar Git
Write-Host ""
Write-Host "🔧 Inicializando Git..." -ForegroundColor Cyan
git init

# Criar .gitignore
Write-Host "📝 Criando .gitignore..." -ForegroundColor Cyan
@"
# Dependencies
node_modules/
.pnpm-store/

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage/

# Misc
*.log
.cache/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host "✅ Git configurado!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Pronto! Aguardando arquivos do projeto..." -ForegroundColor Green
Write-Host "📍 Localização: $projectPath" -ForegroundColor Cyan
