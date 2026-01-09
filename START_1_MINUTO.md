# ⚡ INÍCIO EM 1 MINUTO

**Cole estes comandos no terminal e pronto!** 🚀

---

## 🪟 WINDOWS (PowerShell)

```powershell
# 1. Verificar
.\verificar-antes-deploy.ps1

# 2. Backend
npm install -g supabase
supabase login
supabase link --project-ref lqpmyvizjfwzddxspacv
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt

# 3. Testar
Start-Process "https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health"
```

**Depois:**
1. GitHub: https://github.com/new → Criar `canadian-tax-pro`
2. Push código: `git init && git add . && git commit -m "Deploy" && git push`
3. Netlify: https://app.netlify.com → Import from GitHub → Deploy

---

## 🍎 MAC / LINUX

```bash
# 1. Verificar
chmod +x verificar-antes-deploy.sh
./verificar-antes-deploy.sh

# 2. Backend
npm install -g supabase
supabase login
supabase link --project-ref lqpmyvizjfwzddxspacv
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt

# 3. Testar
open "https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health"
```

**Depois:**
1. GitHub: https://github.com/new → Criar `canadian-tax-pro`
2. Push código: `git init && git add . && git commit -m "Deploy" && git push`
3. Netlify: https://app.netlify.com → Import from GitHub → Deploy

---

## ✅ VARIÁVEIS NO NETLIFY

Quando fizer deploy no Netlify, adicionar:

```
VITE_SUPABASE_URL = https://lqpmyvizjfwzddxspacv.supabase.co
VITE_SUPABASE_ANON_KEY = (copiar do Supabase → Settings → API)
```

---

## 🎯 PRONTO!

Se aparecer "🎉" em todos os passos → Site está online!

**Testar:**
```
https://seu-site.netlify.app
```

---

## 📖 MAIS DETALHES?

- `COMECE_DEPLOY_AGORA.md` - Guia passo a passo
- `CHECKLIST_VISUAL_DEPLOY.md` - Checklist visual
- `SOLUCAO_DE_PROBLEMAS.md` - Se der erro

---

**Vamos lá! 🚀**
