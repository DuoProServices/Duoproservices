@echo off
REM 🎯 Script de Setup Automático - DuoPro Services
REM Este script configura Git e faz push para o GitHub automaticamente

echo 🚀 Iniciando setup automático do DuoPro Services...
echo.

REM Configurar Git (se ainda não configurado)
echo 📝 Configurando Git...
git config --global user.name "DuoPro Services"
git config --global user.email "seu-email@exemplo.com"

REM Inicializar repositório Git
echo 🔧 Inicializando repositório Git...
git init

REM Adicionar todos os arquivos
echo 📦 Adicionando arquivos...
git add .

REM Fazer commit inicial
echo 💾 Fazendo commit inicial...
git commit -m "Initial commit: DuoPro Services - Professional Tax Services"

REM Renomear branch para main (caso seja master)
echo 🔄 Configurando branch main...
git branch -M main

REM Conectar ao repositório remoto do GitHub
echo 🔗 Conectando ao GitHub...
git remote add origin https://github.com/maryco1/duopro-services.git

REM Fazer push para o GitHub
echo ⬆️  Fazendo push para o GitHub...
git push -u origin main

echo.
echo ✅ SUCESSO! Código enviado para o GitHub!
echo.
echo 🎉 Próximos passos:
echo 1. Volte pro Netlify
echo 2. Clique em 'Import from Git'
echo 3. Selecione 'GitHub'
echo 4. Escolha o repositório 'duopro-services'
echo 5. Configure:
echo    - Branch: main
echo    - Build command: npm run build
echo    - Publish directory: dist
echo 6. Adicione as variáveis de ambiente:
echo    - VITE_SUPABASE_URL
echo    - VITE_SUPABASE_ANON_KEY
echo.
echo 🌐 Seu site estará online em poucos minutos!
echo.
pause
