# 🚀 COMECE O DEPLOY AGORA - 3 PASSOS SIMPLES

**⏱️ Tempo Total: 15 minutos**

---

## PASSO 1: VERIFICAR SE ESTÁ TUDO PRONTO (2 minutos)

### Windows:
```powershell
.\verificar-antes-deploy.ps1
```

### Mac/Linux:
```bash
chmod +x verificar-antes-deploy.sh
./verificar-antes-deploy.sh
```

**Se aparecer "🎉 PERFEITO!" → Continue para o Passo 2**

**Se aparecer erros → Corrija e execute novamente**

---

## PASSO 2: DEPLOY DO BACKEND (5 minutos)

### A. Instalar Supabase CLI

**Windows:**
```powershell
npm install -g supabase
```

**Mac:**
```bash
brew install supabase/tap/supabase
```

**Linux:**
```bash
npm install -g supabase
```

### B. Fazer Login

```bash
supabase login
```

*Isso vai abrir o navegador - autorize e volte para o terminal*

### C. Deploy da Edge Function

```bash
# Linkar com o projeto
supabase link --project-ref lqpmyvizjfwzddxspacv

# Deploy
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt
```

### D. Testar

Abra no navegador:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

**Deve mostrar:** `{"status":"ok","message":"Server is running"}`

✅ **Backend Online!**

---

## PASSO 3: DEPLOY DO FRONTEND (8 minutos)

### A. Criar conta no Netlify

1. Acesse: https://app.netlify.com/signup
2. Escolha **"Sign up with GitHub"**
3. Autorize o Netlify

### B. Criar repositório GitHub (se ainda não tem)

```bash
# 1. Vá em https://github.com/new
# 2. Nome: canadian-tax-pro
# 3. Private
# 4. Create repository

# 5. No terminal, na pasta do projeto:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/canadian-tax-pro.git
git push -u origin main
```

### C. Deploy no Netlify

1. No Netlify Dashboard: **Add new site** → **Import an existing project**
2. **Deploy with GitHub**
3. Escolha o repositório `canadian-tax-pro`
4. Configure:
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Adicionar variáveis de ambiente:**
   
   Clique em **"Show advanced"** → **"New variable"**:
   
   ```
   VITE_SUPABASE_URL = https://lqpmyvizjfwzddxspacv.supabase.co
   VITE_SUPABASE_ANON_KEY = (copie do Supabase Dashboard → Settings → API)
   ```

6. Clique em **"Deploy site"**

7. Aguarde 3-5 minutos

✅ **Frontend Online!**

---

## TESTE FINAL (2 minutos)

1. Abra a URL do Netlify (ex: `https://canadian-tax-pro.netlify.app`)
2. Clique em **Sign Up**
3. Crie uma conta de teste
4. Verifique se você foi para o onboarding
5. Faça login
6. Teste upload de documento

✅ **TUDO FUNCIONANDO!**

---

## PRÓXIMOS PASSOS

Agora que seu site está online:

### Hoje:
- [ ] Configure domínio customizado (se tiver)
- [ ] Configure Google Search Console
- [ ] Teste todas as funcionalidades

### Esta semana:
- [ ] Configure RESEND_API_KEY para emails
- [ ] Crie perfis nas redes sociais
- [ ] Poste o primeiro post do Content Calendar

### Este mês:
- [ ] Configure Google Analytics
- [ ] Registre em diretórios
- [ ] Comece campanhas de marketing

---

## URLs IMPORTANTES

**Salve estas URLs:**

```
🌐 Site: https://_____________________.netlify.app
🔧 Netlify: https://app.netlify.com
💾 Supabase: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv
📊 Google Console: https://search.google.com/search-console
```

---

## PROBLEMAS COMUNS

### ❌ "supabase: command not found"

Execute:
```bash
npm install -g supabase
```

### ❌ "Failed to fetch" no site

Verifique se a Edge Function está online:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

### ❌ Site em branco no Netlify

1. Netlify → Site settings → Environment variables
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Trigger new deploy

### ❌ Login não funciona

1. Supabase → Authentication → URL Configuration
2. Site URL: adicione a URL do Netlify
3. Redirect URLs: adicione `https://seu-site.netlify.app/**`

---

## 🆘 PRECISA DE AJUDA?

Leia:
- `DEPLOY_COMPLETO_FINAL.md` - Guia detalhado completo
- `SOLUCAO_DE_PROBLEMAS.md` - Problemas comuns e soluções

---

## 🎉 PARABÉNS!

Quando completar os 3 passos, seu site estará **ONLINE e FUNCIONANDO**!

Você está construindo algo incrível! 💪🚀

---

**BOA SORTE!** 🍀
