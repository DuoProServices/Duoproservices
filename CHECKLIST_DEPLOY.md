# ✅ CHECKLIST DE DEPLOY - MARQUE CADA PASSO

Imprima ou copie esta lista e vá marcando conforme faz cada passo!

---

## 📝 PREPARAÇÃO

- [ ] Tenho uma conta no GitHub
- [ ] Tenho uma conta no Supabase
- [ ] Tenho acesso ao projeto Supabase `lqpmyvizjfwzddxspacv`
- [ ] Tenho o código do projeto no meu computador

---

## 🔑 PASSO 1: TOKEN DO SUPABASE

- [ ] Acessei: https://supabase.com/dashboard/account/tokens
- [ ] Cliquei em "Generate New Token"
- [ ] Nome do token: `GitHub Actions`
- [ ] Copiei o token (começa com `sbp_`)
- [ ] Salvei o token em um lugar seguro (você vai precisar dele!)

---

## 📤 PASSO 2: GITHUB REPOSITORY

**Se você JÁ TEM um repositório GitHub:**

- [ ] Abri o terminal na pasta do projeto
- [ ] Executei: `git add .`
- [ ] Executei: `git commit -m "Add deploy workflow"`
- [ ] Executei: `git push`

**Se você NÃO TEM um repositório GitHub:**

- [ ] Criei um novo repositório em: https://github.com/new
- [ ] Nome do repositório: `duopro-services`
- [ ] Visibilidade: Private
- [ ] NÃO marquei "Add a README file"
- [ ] Cliquei em "Create repository"
- [ ] Executei no terminal:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/MEU_USUARIO/duopro-services.git
  git push -u origin main
  ```

---

## 🔐 PASSO 3: CONFIGURAR SECRET NO GITHUB

- [ ] Acessei: `https://github.com/MEU_USUARIO/MEU_REPO/settings/secrets/actions`
- [ ] Cliquei em "New repository secret"
- [ ] Name: `SUPABASE_ACCESS_TOKEN`
- [ ] Value: Colei o token do Supabase
- [ ] Cliquei em "Add secret"
- [ ] Vi a mensagem de confirmação

---

## 🚀 PASSO 4: EXECUTAR O DEPLOY

- [ ] Acessei: `https://github.com/MEU_USUARIO/MEU_REPO/actions`
- [ ] Vi o workflow "Deploy Supabase Edge Function" na lista
- [ ] Cliquei no workflow
- [ ] Cliquei em "Run workflow" (botão azul)
- [ ] Cliquei em "Run workflow" novamente (confirmar)
- [ ] Aguardei 1-2 minutos
- [ ] Vi o ícone verde ✅ (sucesso!)

---

## 🧪 PASSO 5: TESTAR

- [ ] Abri no navegador: https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
- [ ] Vi a resposta: `{"status":"ok","message":"Server is running"}`
- [ ] Recarreguei o aplicativo (F5)
- [ ] Fiz login com sucesso
- [ ] Testei upload de documento ✅
- [ ] Testei envio de mensagem ✅
- [ ] Testei dashboard admin ✅

---

## 🎉 RESULTADO FINAL

- [ ] ✅ Backend funcionando
- [ ] ✅ Todas as APIs respondendo
- [ ] ✅ Deploy automático configurado
- [ ] ✅ Sistema 100% funcional

---

## 📊 PROGRESSO GERAL

**Etapas concluídas:** _____ / 5

**Status:**
- [ ] Em andamento
- [ ] Aguardando ajuda
- [ ] ✅ COMPLETO!

---

## 🆘 SE TIVER PROBLEMA EM ALGUM PASSO:

**Anote aqui qual passo deu erro:**

_______________________________________________

_______________________________________________

_______________________________________________

**Envie para mim com:**
1. Número do passo que deu erro
2. Mensagem de erro completa
3. Screenshot (se possível)

---

## ⏱️ TEMPO ESTIMADO POR PASSO:

- Passo 1: 2 minutos
- Passo 2: 1-3 minutos
- Passo 3: 1 minuto
- Passo 4: 2 minutos
- Passo 5: 1 minuto

**TOTAL: 7-9 minutos** ⚡

---

## 💡 DICAS:

✅ Faça um passo de cada vez
✅ Marque cada checkbox quando concluir
✅ Não pule nenhum passo
✅ Se der erro, anote e me envie
✅ Tenha paciência - vale a pena!

---

**BOA SORTE! 🍀**

Você consegue! É mais fácil do que parece! 💪
