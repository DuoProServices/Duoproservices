# ⚡ DEPLOY EM 5 MINUTOS - GUIA EXPRESS

**Objetivo:** Colocar o site no ar o mais rápido possível

---

## 🚀 PASSO 1: Netlify (2 min)

1. Acesse: **https://app.netlify.com**
2. Click: **"Add new site"** → **"Import an existing project"**
3. Selecione: **GitHub** → Autorize → Escolha seu repositório
4. Configure:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
5. Click: **"Show advanced"** → Adicione estas variáveis:
   ```
   VITE_SUPABASE_URL=https://akjqlobybuqenweavgjp.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFranFsb2J5YnVxZW53ZWF2Z2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MTkzODQsImV4cCI6MjA1MDM5NTM4NH0.I4qjE4JONJswqCy29IlJ9J-pF5REviFD9FPZ0C8U3XM
   ```
6. Click: **"Deploy site"**
7. **✅ PRONTO!** Copie a URL (ex: `random-name.netlify.app`)

---

## 📧 PASSO 2: Resend (2 min)

1. Acesse: **https://resend.com**
2. Crie conta → Verifique email
3. Dashboard → **"API Keys"** → **"Create API Key"**
4. **Copie a key** (começa com `re_...`)
5. Volte ao Netlify → **Site settings** → **Environment variables**
6. **Add variable:**
   ```
   Name: RESEND_API_KEY
   Value: [cole sua key aqui]
   ```
7. Netlify → **Deploys** → **"Trigger deploy"** → **"Deploy site"**

---

## 🧪 PASSO 3: Testar (1 min)

Abra seu site e teste:
- [ ] ✅ Homepage abre
- [ ] ✅ Click "Sign Up" → Crie conta
- [ ] ✅ Faça login
- [ ] ✅ Acesse dashboard

**Se tudo funcionou: PARABÉNS! 🎉**

---

## 🔍 PRÓXIMOS PASSOS (Depois)

### Hoje à noite:
- Google Search Console (10 min)
- Google Analytics (5 min)

### Esta semana:
- Comprar domínio próprio (~$20/ano)
- Google My Business (se tiver escritório)

### Este mês:
- Criar perfis redes sociais
- Escrever primeiro blog post
- Registrar em diretórios

---

## ⚠️ SE ALGO DER ERRADO

**Site não carrega:**
- Veja logs do deploy no Netlify
- Verifique variáveis de ambiente

**Emails não funcionam:**
- Verifique RESEND_API_KEY
- Aguarde novo deploy após adicionar

**Upload não funciona:**
- Faça login como admin
- Acesse `/admin`
- Click no botão "Magic Setup"

---

## 📞 SUPORTE

Leia os guias completos:
- `🚀_DEPLOY_OFICIAL_PASSO_A_PASSO.md`
- `✅_CHECKLIST_DEPLOY_FINAL.md`
- `GUIA_COMPLETO_PRODUCAO_SEO.md`

---

**Tempo total:** 5 minutos ⚡  
**Custo:** $0 (100% grátis para começar)  
**Resultado:** Site profissional no ar! 🚀

**GO GO GO!** 🎉
