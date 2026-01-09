# ⚡ INÍCIO RÁPIDO - 5 MINUTOS

## 🎯 O QUE VOCÊ PRECISA FAZER:

---

## 1️⃣ **PEGAR O TOKEN DO SUPABASE** (2 min)

1. Abra: https://supabase.com/dashboard/account/tokens
2. Clique em: **"Generate New Token"**
3. Nome: `GitHub Actions`
4. **COPIE O TOKEN** (começa com `sbp_...`)

---

## 2️⃣ **SUBIR PARA O GITHUB** (1 min)

### Se você JÁ tem um repositório:
```bash
git add .
git commit -m "Add deploy workflow"
git push
```

### Se você NÃO tem um repositório:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/duopro-services.git
git push -u origin main
```

---

## 3️⃣ **ADICIONAR O TOKEN NO GITHUB** (1 min)

1. Vá para: `https://github.com/SEU_USUARIO/SEU_REPO/settings/secrets/actions`
2. Clique: **"New repository secret"**
3. Name: `SUPABASE_ACCESS_TOKEN`
4. Value: **Cole o token que você copiou**
5. Clique: **"Add secret"**

---

## 4️⃣ **RODAR O DEPLOY** (1 min)

1. Vá para: `https://github.com/SEU_USUARIO/SEU_REPO/actions`
2. Clique em: **"Deploy Supabase Edge Function"**
3. Clique em: **"Run workflow"** (botão azul)
4. Clique em: **"Run workflow"** (confirmar)
5. **Aguarde 1-2 minutos** ⏱️

---

## 5️⃣ **TESTAR!** ✅

1. Abra: https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
   - Deve ver: `{"status":"ok","message":"Server is running"}`

2. **Recarregue seu app** (F5)

3. **Faça login** e use! 🎉

---

## 🎊 PRONTO! TUDO FUNCIONANDO!

A partir de agora, **toda vez que você fizer push**, o deploy acontece automaticamente! 🚀

---

## 🆘 PROBLEMAS?

Leia o guia completo: **GUIA_GITHUB_ACTIONS.md**

Ou me envie o erro! 😊
