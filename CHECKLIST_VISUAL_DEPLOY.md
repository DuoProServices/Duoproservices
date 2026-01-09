# ✅ CHECKLIST VISUAL DE DEPLOY

Imprima ou mantenha aberto e vá marcando! ⬜ → ✅

---

## 🔍 PREPARAÇÃO

- [ ] ⬜ Executei o script de verificação
- [ ] ⬜ Recebi "🎉 PERFEITO!" na verificação
- [ ] ⬜ Tenho conta no GitHub
- [ ] ⬜ Tenho acesso ao projeto Supabase

---

## 🔧 DEPLOY DO BACKEND

### Instalação do Supabase CLI

- [ ] ⬜ Executei: `npm install -g supabase` (Windows/Linux)
- [ ] ⬜ OU executei: `brew install supabase/tap/supabase` (Mac)
- [ ] ⬜ Testei: `supabase --version` funciona

### Login

- [ ] ⬜ Executei: `supabase login`
- [ ] ⬜ Navegador abriu automaticamente
- [ ] ⬜ Autorizei no navegador
- [ ] ⬜ Vi mensagem de sucesso no terminal

### Deploy da Edge Function

- [ ] ⬜ Executei: `supabase link --project-ref lqpmyvizjfwzddxspacv`
- [ ] ⬜ Vi "Successfully linked" ou similar
- [ ] ⬜ Executei: `supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt`
- [ ] ⬜ Deploy completou sem erros
- [ ] ⬜ Vi mensagem de sucesso

### Teste do Backend

- [ ] ⬜ Abri no navegador: `https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health`
- [ ] ⬜ Vi: `{"status":"ok","message":"Server is running"}`

✅ **BACKEND ONLINE!** ✅

---

## 🌐 DEPLOY DO FRONTEND

### GitHub Repository

**Se JÁ TENHO repositório:**

- [ ] ⬜ `git add .`
- [ ] ⬜ `git commit -m "Ready for deploy"`
- [ ] ⬜ `git push`

**Se NÃO TENHO repositório:**

- [ ] ⬜ Acessei: https://github.com/new
- [ ] ⬜ Nome: `canadian-tax-pro`
- [ ] ⬜ Visibilidade: Private
- [ ] ⬜ Create repository
- [ ] ⬜ Executei no terminal:
  ```
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/MEU_USUARIO/canadian-tax-pro.git
  git push -u origin main
  ```
- [ ] ⬜ Código apareceu no GitHub

### Netlify Account

- [ ] ⬜ Acessei: https://app.netlify.com/signup
- [ ] ⬜ Escolhi "Sign up with GitHub"
- [ ] ⬜ Autorizei Netlify
- [ ] ⬜ Estou no Netlify Dashboard

### Import Project

- [ ] ⬜ Cliquei: "Add new site" → "Import an existing project"
- [ ] ⬜ Escolhi: "Deploy with GitHub"
- [ ] ⬜ Autorizei acesso aos repositórios
- [ ] ⬜ Selecionei: `canadian-tax-pro`

### Build Settings

- [ ] ⬜ Branch: `main` ✅
- [ ] ⬜ Build command: `npm run build` ✅
- [ ] ⬜ Publish directory: `dist` ✅

### Environment Variables

- [ ] ⬜ Cliquei: "Show advanced" → "New variable"

**Variável 1:**
- [ ] ⬜ Key: `VITE_SUPABASE_URL`
- [ ] ⬜ Value: `https://lqpmyvizjfwzddxspacv.supabase.co`

**Variável 2:**
- [ ] ⬜ Key: `VITE_SUPABASE_ANON_KEY`
- [ ] ⬜ Copiei do: Supabase → Settings → API → anon/public key
- [ ] ⬜ Colei o valor

### Deploy

- [ ] ⬜ Cliquei: "Deploy site"
- [ ] ⬜ Vi o progresso do build
- [ ] ⬜ Aguardei 3-5 minutos
- [ ] ⬜ Vi: "Site is live" 🎉

### Anotar URL

```
Meu site está em:
https://_____________________________________.netlify.app
```

✅ **FRONTEND ONLINE!** ✅

---

## 🧪 TESTES FINAIS

### Homepage

- [ ] ⬜ Site carrega sem erros
- [ ] ⬜ Abri DevTools (F12)
- [ ] ⬜ Não tem erros vermelhos no Console
- [ ] ⬜ Todas as seções aparecem
- [ ] ⬜ Botões funcionam

### Signup

- [ ] ⬜ Cliquei em "Get Started" ou "Sign Up"
- [ ] ⬜ Preenchi formulário de teste
- [ ] ⬜ Cliquei em "Sign Up"
- [ ] ⬜ Fui redirecionado para onboarding
- [ ] ⬜ Completei onboarding

### Login

- [ ] ⬜ Fiz logout
- [ ] ⬜ Cliquei em "Login"
- [ ] ⬜ Preenchi email e senha
- [ ] ⬜ Fiz login com sucesso
- [ ] ⬜ Fui redirecionado para dashboard

### Dashboard Cliente

- [ ] ⬜ Timeline de 5 etapas aparece
- [ ] ⬜ Botão "Upload Documents" funciona
- [ ] ⬜ Consigo selecionar arquivo
- [ ] ⬜ Upload completa com sucesso
- [ ] ⬜ Documento aparece na lista

### Bilíngue

- [ ] ⬜ Botão EN/FR aparece
- [ ] ⬜ Cliquei em FR → site mudou para francês
- [ ] ⬜ Cliquei em EN → site voltou para inglês
- [ ] ⬜ Traduções estão corretas

### Admin (se aplicável)

- [ ] ⬜ Fiz login com conta admin
- [ ] ⬜ Acessei `/admin`
- [ ] ⬜ Dashboard admin carrega
- [ ] ⬜ Vejo lista de clientes

### Marketing Dashboard

- [ ] ⬜ Como admin, acessei `/admin/marketing`
- [ ] ⬜ Content Calendar carrega
- [ ] ⬜ Vejo os 14 posts de janeiro
- [ ] ⬜ Botão "Copy to Clipboard" funciona
- [ ] ⬜ Nenhum erro de clipboard

### Mobile

- [ ] ⬜ Abri no celular
- [ ] ⬜ Site é responsivo
- [ ] ⬜ Menu mobile funciona
- [ ] ⬜ Consigo fazer login
- [ ] ⬜ Consigo navegar

✅ **TODOS OS TESTES PASSARAM!** ✅

---

## ⚙️ CONFIGURAÇÕES ADICIONAIS

### Supabase Auth URLs

- [ ] ⬜ Acessei: Supabase → Authentication → URL Configuration
- [ ] ⬜ Site URL: Adicionei URL do Netlify
- [ ] ⬜ Redirect URLs: Adicionei `https://meu-site.netlify.app/**`
- [ ] ⬜ Redirect URLs: Adicionei `http://localhost:5173/**`
- [ ] ⬜ Salvei

### Email (Resend)

- [ ] ⬜ Criei conta: https://resend.com
- [ ] ⬜ Copiei API Key
- [ ] ⬜ Supabase → Edge Functions → Secrets
- [ ] ⬜ Adicionei: `RESEND_API_KEY` = `re_xxxxx`
- [ ] ⬜ Re-deploy da Edge Function

### Google Search Console

- [ ] ⬜ Acessei: https://search.google.com/search-console
- [ ] ⬜ Adicionei propriedade
- [ ] ⬜ Verifiquei propriedade
- [ ] ⬜ Submeti sitemap: `https://meu-site.netlify.app/sitemap.xml`

### Google Analytics (Opcional)

- [ ] ⬜ Criei conta: https://analytics.google.com
- [ ] ⬜ Criei propriedade
- [ ] ⬜ Copiei Measurement ID (G-XXXXXXXXXX)
- [ ] ⬜ Adicionei no `index.html`
- [ ] ⬜ Re-deploy

---

## 📱 MARKETING E DIVULGAÇÃO

### Redes Sociais

- [ ] ⬜ Criei LinkedIn Company Page
- [ ] ⬜ Criei Facebook Business Page
- [ ] ⬜ Criei Instagram Business
- [ ] ⬜ Adicionei link do site em todas as bios

### Primeiro Post

- [ ] ⬜ Peguei Post #1 do Content Calendar
- [ ] ⬜ Gerei imagem no Marketing Image Generator
- [ ] ⬜ Copiei legenda e hashtags
- [ ] ⬜ Postei no Instagram
- [ ] ⬜ Postei no Facebook
- [ ] ⬜ Postei no LinkedIn

### Diretórios

- [ ] ⬜ Registrei no Yelp Canada
- [ ] ⬜ Registrei no Yellow Pages
- [ ] ⬜ Registrei em diretórios de contadores

---

## 🎯 DOMÍNIO CUSTOMIZADO (Opcional)

- [ ] ⬜ Comprei domínio (ex: canadiantaxpro.ca)
- [ ] ⬜ Netlify → Domain settings → Add custom domain
- [ ] ⬜ Digitei meu domínio
- [ ] ⬜ Configurei DNS conforme instruções
- [ ] ⬜ Aguardei propagação (até 48h)
- [ ] ⬜ HTTPS automático ativado
- [ ] ⬜ Site acessível pelo domínio customizado

---

## 📊 PROGRESSO GERAL

```
BACKEND:        [ ] Não iniciado  [ ] Em andamento  [✅] Completo
FRONTEND:       [ ] Não iniciado  [ ] Em andamento  [✅] Completo
TESTES:         [ ] Não iniciado  [ ] Em andamento  [✅] Completo
CONFIGURAÇÕES:  [ ] Não iniciado  [ ] Em andamento  [✅] Completo
MARKETING:      [ ] Não iniciado  [ ] Em andamento  [✅] Completo
```

---

## 🎉 STATUS FINAL

Quando todos os checkboxes estiverem marcados:

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🎊 PARABÉNS! DEPLOY COMPLETO! 🎊                 ║
║                                                               ║
║        Seu site Canadian Tax Pro está ONLINE e                ║
║              pronto para receber clientes!                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Data de conclusão:** _____ / _____ / 2025

**Horas investidas:** _____ horas

**Primeiros clientes:** 
1. _______________________
2. _______________________
3. _______________________

---

## 📞 INFORMAÇÕES IMPORTANTES

**URLs do Projeto:**
```
🌐 Site Principal: ________________________________________
🔧 Netlify Dashboard: https://app.netlify.com
💾 Supabase Dashboard: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv
📊 Google Search Console: https://search.google.com/search-console
📈 Google Analytics: https://analytics.google.com
📧 Resend Dashboard: https://resend.com/dashboard
```

**Credenciais Admin:**
```
Email: ____________________________________
Password: (guardar em local seguro!)
```

**Suporte Técnico:**
```
Netlify: https://www.netlify.com/support/
Supabase: https://supabase.com/support
```

---

## 🔄 MANUTENÇÃO REGULAR

### Diária
- [ ] ⬜ Verificar emails de clientes
- [ ] ⬜ Responder mensagens
- [ ] ⬜ Verificar novos cadastros

### Semanal
- [ ] ⬜ Postar nas redes sociais (use Content Calendar)
- [ ] ⬜ Verificar Google Analytics
- [ ] ⬜ Responder comentários/reviews

### Mensal
- [ ] ⬜ Review de métricas
- [ ] ⬜ Planejar próximo mês
- [ ] ⬜ Atualizar conteúdo do blog
- [ ] ⬜ Solicitar reviews de clientes satisfeitos

---

## 🆘 SE TIVER PROBLEMAS

**Consulte nesta ordem:**

1. ✅ `SOLUCAO_DE_PROBLEMAS.md`
2. ✅ `DEPLOY_COMPLETO_FINAL.md`
3. ✅ DevTools Console (F12)
4. ✅ Netlify Deploy Logs
5. ✅ Supabase Edge Function Logs

---

**Você conseguiu! Parabéns pelo esforço e dedicação! 🚀🎉**

**Agora é hora de crescer e conquistar clientes! 💪**
