================================================================================
🚀 GUIA COMPLETO: DEPLOY DUOPRO SERVICES - GITHUB + NETLIFY
================================================================================

Repositório GitHub já existe: DuoProServices/duopro-services ✅
Agora vamos fazer deploy no Netlify!

================================================================================
PASSO 1: ACESSAR NETLIFY
================================================================================

1. Abra o navegador
2. Acesse: https://app.netlify.com
3. Click "Sign up" (ou "Log in" se já tiver conta)
4. Escolha: "Sign up with GitHub"
5. Autorize o Netlify

================================================================================
PASSO 2: IMPORTAR REPOSITÓRIO
================================================================================

1. No Netlify, click "Add new site"
2. Click "Import an existing project"
3. Click "Deploy with GitHub"
4. Autorize o Netlify (se pedir)
5. Procure e selecione: DuoProServices/duopro-services

================================================================================
PASSO 3: CONFIGURAÇÕES DE BUILD
================================================================================

Preencha na tela de configuração:

Owner: DuoProServices
Branch to deploy: main
Build command: npm run build
Publish directory: dist

⚠️ NÃO CLIQUE EM DEPLOY AINDA! Continue para o próximo passo!

================================================================================
PASSO 4: ADICIONAR VARIÁVEIS DE AMBIENTE
================================================================================

⚠️ MUITO IMPORTANTE! Antes de fazer deploy:

1. Role para baixo e click "Show advanced" ou "Add environment variables"
2. Click "New variable" e adicione cada uma abaixo:

---VARIÁVEL 1---
Key: VITE_SUPABASE_URL
Value: https://akjqlobybuqenweavgjp.supabase.co

---VARIÁVEL 2---
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFranFsb2J5YnVxZW53ZWF2Z2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MTkzODQsImV4cCI6MjA1MDM5NTM4NH0.I4qjE4JONJswqCy29IlJ9J-pF5REviFD9FPZ0C8U3XM

3. Depois de adicionar as 2 variáveis, click "Deploy DuoProServices/duopro-services"

================================================================================
PASSO 5: AGUARDAR DEPLOY
================================================================================

O Netlify vai:
✅ Conectar ao GitHub
✅ Baixar o código
✅ Instalar dependências
✅ Fazer build
✅ Publicar!

Aguarde 2-3 minutos. Você verá logs na tela.

Quando terminar, copie a URL do site (tipo: https://random-name-abc123.netlify.app)

================================================================================
PASSO 6: CONFIGURAR RESEND (EMAILS)
================================================================================

1. Acesse: https://resend.com
2. Click "Sign Up"
3. Use email: duoproservices.info@gmail.com
4. Crie senha forte
5. Verifique o email
6. Faça login no Resend

7. No Dashboard do Resend:
   - Menu lateral → "API Keys"
   - Click "Create API Key"
   
8. Preencha:
   Name: DuoPro Production
   Permission: Sending access
   Domain: All domains
   
9. Click "Add"
10. ⚠️ COPIE A KEY (começa com re_...) - só aparece uma vez!
11. Guarde em local seguro!

================================================================================
PASSO 7: ADICIONAR RESEND_API_KEY NO NETLIFY
================================================================================

1. Volte para o Netlify
2. No seu site → "Site settings"
3. Menu lateral → "Environment variables"
4. Click "Add a variable" ou "Add a single variable"

5. Preencha:
   Key: RESEND_API_KEY
   Value: [cole aqui a key do Resend que você copiou - começa com re_...]

6. Click "Create variable"

================================================================================
PASSO 8: RE-DEPLOY COM RESEND
================================================================================

1. No Netlify → "Deploys"
2. Click "Trigger deploy"
3. Click "Deploy site"
4. Aguarde 2-3 minutos

================================================================================
PASSO 9: TESTAR TUDO
================================================================================

1. Abra a URL do seu site (a que você copiou antes)
2. Teste homepage - carrega sem erros?
3. Click "Sign Up" - formulário funciona?
4. Crie uma conta de teste
5. Verifique se recebeu email
6. Faça login
7. Teste dashboard
8. Mude para FR (Français)
9. Mude para EN (English)
10. Teste login como admin: duoproservices.info@gmail.com

✅ TUDO FUNCIONOU? PARABÉNS! SITE NO AR! 🎉

================================================================================
🔄 COMO FAZER ATUALIZAÇÕES FUTURAS
================================================================================

Agora que está conectado ao GitHub, é automático!

1. Faça suas mudanças no código
2. Abra o Terminal na pasta do projeto
3. Execute os comandos abaixo:

---COMANDOS GIT---
git add .
git commit -m "Descrição da mudança"
git push

4. Netlify detecta automaticamente e faz novo deploy!
5. Site atualizado em 2-3 minutos! ✅

================================================================================
🆘 COMANDOS ÚTEIS
================================================================================

---VER STATUS DO GIT---
git status

---VER HISTÓRICO DE COMMITS---
git log --oneline

---DESFAZER MUDANÇAS (antes do commit)---
git checkout .

---CRIAR NOVA BRANCH---
git checkout -b nova-feature

---VOLTAR PARA MAIN---
git checkout main

================================================================================
📧 INFORMAÇÕES IMPORTANTES
================================================================================

Repositório GitHub: https://github.com/DuoProServices/duopro-services
Email do projeto: duoproservices.info@gmail.com

Variáveis de Ambiente (já configuradas):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- RESEND_API_KEY (adicionar após criar conta Resend)

================================================================================
📞 PRÓXIMOS PASSOS APÓS DEPLOY
================================================================================

✅ Hoje:
   - Testar tudo completamente
   - Verificar emails funcionando
   - Testar signup/login
   - Testar dashboard do cliente

✅ Esta semana:
   - Configurar domínio personalizado .ca
   - Google Search Console
   - Google Analytics

✅ Este mês:
   - SEO completo
   - Marketing e divulgação
   - Primeiros clientes!

================================================================================
🎯 CHECKLIST RÁPIDO
================================================================================

[ ] Netlify conectado ao GitHub
[ ] Build configurado (npm run build + dist)
[ ] VITE_SUPABASE_URL adicionado
[ ] VITE_SUPABASE_ANON_KEY adicionado
[ ] Primeiro deploy concluído
[ ] Conta Resend criada
[ ] RESEND_API_KEY adicionado no Netlify
[ ] Re-deploy feito
[ ] Site testado e funcionando
[ ] Signup/Login testando
[ ] Emails chegando
[ ] Dashboard funcionando
[ ] Troca de idioma funcionando

================================================================================
🔥 DICAS IMPORTANTES
================================================================================

1. Sempre teste em ambiente local antes de fazer push
2. Use mensagens de commit descritivas
3. Faça commits pequenos e frequentes
4. Verifique os logs do Netlify se der erro
5. Mantenha as variáveis de ambiente seguras
6. Nunca compartilhe a RESEND_API_KEY ou SUPABASE_ANON_KEY publicamente

================================================================================
✅ SITE NO AR - SUCESSO!
================================================================================

Seu site profissional DuoPro Services está pronto para receber clientes!

🌐 URL temporária Netlify: [sua-url].netlify.app
🚀 Próximo passo: Domínio personalizado duoproservices.ca

Boa sorte com o lançamento! 🎉

================================================================================
FIM DO GUIA
================================================================================
