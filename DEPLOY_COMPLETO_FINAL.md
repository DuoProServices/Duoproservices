# 🚀 DEPLOY COMPLETO - COLOCAR SEU SITE ONLINE

**⏱️ Tempo Total: 15-20 minutos**

Você precisa fazer 2 deploys:
1. **Backend** (Supabase Edge Functions) - 5 minutos
2. **Frontend** (Netlify) - 10 minutos

---

## PARTE 1: DEPLOY DO BACKEND (SUPABASE) ⚡

### Opção A: Deploy Manual Rápido (Recomendado para primeira vez)

#### Passo 1: Instalar Supabase CLI

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

#### Passo 2: Fazer Login

```bash
supabase login
```

Isso vai abrir seu navegador para você autorizar.

#### Passo 3: Deploy da Edge Function

```bash
# 1. Navegar até a pasta do projeto
cd /caminho/para/seu/projeto

# 2. Linkar com seu projeto Supabase
supabase link --project-ref lqpmyvizjfwzddxspacv

# 3. Fazer deploy da função
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt
```

#### Passo 4: Testar

Abra no navegador:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

**Deve retornar:**
```json
{"status":"ok","message":"Server is running"}
```

✅ **Backend Online!**

---

### Opção B: Deploy Automático via GitHub Actions

Se você preferir deploy automático toda vez que fizer alterações:

#### Passo 1: Criar Repositório no GitHub

1. Vá em: https://github.com/new
2. Nome: `canadian-tax-pro` (ou o nome que preferir)
3. Visibilidade: **Private**
4. Clique em **Create repository**

#### Passo 2: Configurar Secret do Supabase

1. Vá em: https://supabase.com/dashboard/account/tokens
2. Clique em **Generate New Token**
3. Nome: `GitHub Actions`
4. Copie o token (começa com `sbp_`)

5. No seu repositório GitHub, vá em:
   - **Settings** → **Secrets and variables** → **Actions**
   - Clique em **New repository secret**
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: Cole o token que você copiou
   - Clique em **Add secret**

#### Passo 3: Mover arquivo de workflow

```bash
# Criar pasta .github/workflows
mkdir -p .github/workflows

# Mover o arquivo de workflow
mv workflows/deploy-supabase.yml .github/workflows/
```

#### Passo 4: Push para GitHub

```bash
git init
git add .
git commit -m "Initial commit - Canadian Tax Pro"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/canadian-tax-pro.git
git push -u origin main
```

#### Passo 5: Executar Deploy

1. Vá no seu repositório GitHub
2. Clique na aba **Actions**
3. Clique em **Deploy Supabase Edge Function**
4. Clique em **Run workflow** → **Run workflow**
5. Aguarde 1-2 minutos

✅ **Agora toda vez que você fizer `git push`, o backend será deployado automaticamente!**

---

## PARTE 2: DEPLOY DO FRONTEND (NETLIFY) 🌐

### Passo 1: Criar conta no Netlify

1. Acesse: https://app.netlify.com/signup
2. Faça signup com sua conta GitHub
3. Autorize o Netlify

### Passo 2: Importar Projeto

**Se você JÁ TEM o código no GitHub:**

1. No Netlify Dashboard, clique em **Add new site** → **Import an existing project**
2. Escolha **Deploy with GitHub**
3. Autorize o Netlify a acessar seus repositórios
4. Selecione o repositório `canadian-tax-pro`
5. **Configure as opções:**
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Clique em **Show advanced** → **New variable**

**Se você NÃO TEM o código no GitHub ainda:**

1. Primeiro siga os passos da "Opção B" acima para criar o repositório
2. Depois volte aqui e continue

### Passo 3: Adicionar Variáveis de Ambiente

Clique em **Add environment variable** e adicione:

**Variável 1:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://lqpmyvizjfwzddxspacv.supabase.co`

**Variável 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: Vá no Supabase → Settings → API → Copie `anon` / `public` key

**Variável 3:**
- Key: `VITE_FORMSPREE_FORM_ID`
- Value: (seu ID do Formspree, se tiver)

**Variável 4:**
- Key: `VITE_CALENDLY_URL`
- Value: (sua URL do Calendly, se tiver)

### Passo 4: Deploy

1. Clique em **Deploy site**
2. Aguarde 3-5 minutos (acompanhe o progresso)
3. Quando aparecer **"Site is live"**, clique na URL

### Passo 5: Configurar Domínio Customizado (Opcional)

Se você tiver um domínio:

1. No Netlify Dashboard, clique em **Domain settings**
2. Clique em **Add custom domain**
3. Digite seu domínio (ex: `canadiantaxpro.ca`)
4. Siga as instruções para configurar DNS

✅ **Frontend Online!**

---

## PASSO 3: TESTAR TUDO 🧪

### Teste 1: Homepage

1. Abra a URL do Netlify no navegador
2. Verifique se o site carrega sem erros
3. Abra o DevTools (F12) e verifique se não há erros no Console

### Teste 2: Signup

1. Clique em **Get Started** ou **Sign Up**
2. Crie uma nova conta de teste
3. Verifique se você foi redirecionado para o onboarding

### Teste 3: Login

1. Faça logout
2. Faça login novamente com a conta criada
3. Verifique se você foi redirecionado para o dashboard

### Teste 4: Upload de Documentos

1. No dashboard do cliente
2. Clique em **Upload Documents**
3. Selecione um arquivo PDF de teste
4. Verifique se o upload funcionou

### Teste 5: Admin Dashboard

1. Faça login com uma conta admin (configure em `/src/app/config/admins.ts`)
2. Acesse `/admin`
3. Verifique se você vê a lista de clientes

### Teste 6: Marketing Dashboard

1. Como admin, acesse `/admin/marketing`
2. Verifique se você vê o Content Calendar com os 14 posts de janeiro
3. Teste o botão de copiar para clipboard

✅ **Se todos os testes passaram, seu site está 100% online e funcionando!**

---

## CONFIGURAÇÕES ADICIONAIS IMPORTANTES ⚙️

### 1. Configurar Email (Resend)

Para receber notificações por email:

1. Crie conta em: https://resend.com
2. Obtenha sua API Key
3. No Supabase Dashboard:
   - Vá em **Edge Functions** → **Secrets**
   - Adicione: `RESEND_API_KEY` = `re_xxxxx`
4. Re-deploy a Edge Function

### 2. Google Search Console

Para aparecer no Google:

1. Acesse: https://search.google.com/search-console
2. Adicione sua propriedade (URL do Netlify)
3. Verifique a propriedade
4. Submeta o sitemap: `https://seu-site.netlify.app/sitemap.xml`

### 3. Google Analytics (Opcional)

Para acompanhar visitantes:

1. Crie conta em: https://analytics.google.com
2. Crie uma propriedade
3. Copie o Measurement ID (G-XXXXXXXXXX)
4. Adicione no `/index.html` (procure por "Google Analytics")

---

## SOLUÇÃO DE PROBLEMAS COMUNS 🔧

### ❌ Erro: "Failed to fetch" no Frontend

**Causa:** Edge Function não está deployada ou URL está errada

**Solução:**
1. Verifique se a Edge Function está online: `https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health`
2. Verifique o arquivo `/src/config/api.ts` - a URL deve ser correta
3. Re-deploy a Edge Function

### ❌ Erro: "Storage policy violation"

**Causa:** RLS Policies não configuradas

**Solução:**
1. Acesse Supabase Dashboard → Storage → Policies
2. Clique em **New Policy**
3. Use os templates em `/SETUP_COMPLETO_STORAGE.md`

### ❌ Site carrega mas aparece em branco

**Causa:** Variáveis de ambiente não configuradas no Netlify

**Solução:**
1. Netlify Dashboard → Site settings → Environment variables
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Re-deploy: Site settings → Deploys → Trigger deploy → Deploy site

### ❌ Login não funciona

**Causa:** Auth no Supabase não configurado

**Solução:**
1. Supabase Dashboard → Authentication → Settings
2. **Site URL:** Adicione a URL do Netlify
3. **Redirect URLs:** Adicione:
   - `https://seu-site.netlify.app/**`
   - `http://localhost:5173/**` (para desenvolvimento)

---

## CHECKLIST FINAL ✅

Antes de considerar o deploy completo, verifique:

- [ ] ✅ Edge Function online e respondendo
- [ ] ✅ Frontend deployado no Netlify
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Login/Signup funcionando
- [ ] ✅ Upload de documentos funcionando
- [ ] ✅ Dashboard admin acessível
- [ ] ✅ Marketing dashboard funcionando
- [ ] ✅ Sem erros no console do navegador
- [ ] ✅ Site funciona no mobile (teste no celular)
- [ ] ✅ Email configurado (RESEND_API_KEY)
- [ ] ✅ Domínio customizado configurado (opcional)
- [ ] ✅ Google Search Console configurado
- [ ] ✅ Google Analytics configurado (opcional)

---

## URLs IMPORTANTES 📎

**Salve estas URLs para fácil acesso:**

```
🌐 Site Principal: https://_____________________.netlify.app
🔧 Netlify Dashboard: https://app.netlify.com
💾 Supabase Dashboard: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv
📊 Google Search Console: https://search.google.com/search-console
📈 Google Analytics: https://analytics.google.com
📧 Resend Dashboard: https://resend.com/dashboard
```

---

## PRÓXIMOS PASSOS APÓS DEPLOY 🎯

### Semana 1: Teste e Ajustes

- [ ] Teste todas as funcionalidades diariamente
- [ ] Corrija bugs que aparecerem
- [ ] Ajuste textos e traduções se necessário
- [ ] Peça para amigos testarem

### Semana 2: Marketing Inicial

- [ ] Poste o primeiro post do Content Calendar
- [ ] Crie perfis nas redes sociais
- [ ] Envie email para sua lista de contatos
- [ ] Registre em diretórios de contadores

### Mês 1: Crescimento

- [ ] Poste regularmente (use o Content Calendar)
- [ ] Monitore Google Analytics
- [ ] Peça reviews de primeiros clientes
- [ ] Ajuste preços se necessário

### Mês 2+: Otimização

- [ ] Analise métricas e otimize conversão
- [ ] Adicione novos recursos baseado em feedback
- [ ] Expanda marketing
- [ ] Considere Google Ads / Facebook Ads

---

## 🎉 PARABÉNS!

Quando você completar todos os passos acima, seu site **Canadian Tax Pro** estará:

✅ **ONLINE**
✅ **FUNCIONANDO**
✅ **PRONTO PARA CLIENTES**

---

## 📞 PRECISA DE AJUDA?

Se tiver qualquer problema durante o deploy:

1. ✅ Verifique primeiro a seção **"Solução de Problemas Comuns"** acima
2. ✅ Confira os logs de erro no Netlify Deploy Logs
3. ✅ Verifique o console do navegador (F12)
4. ✅ Me envie uma mensagem com:
   - Passo onde travou
   - Mensagem de erro completa
   - Screenshot (se possível)

---

**BOA SORTE COM O DEPLOY! 🚀**

Você está a poucos passos de colocar seu negócio online! 💪
