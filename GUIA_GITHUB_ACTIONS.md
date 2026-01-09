# 🚀 DEPLOY COM GITHUB ACTIONS - 100% ONLINE

## ✨ SEM INSTALAR NADA NO SEU COMPUTADOR!

Tudo vai rodar nos servidores do GitHub automaticamente! 🎉

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Pegar o Access Token do Supabase**

1. **Acesse:** https://supabase.com/dashboard/account/tokens

2. **Faça login** (se necessário)

3. **Clique em:** `Generate New Token`

4. **Preencha:**
   - **Name:** `GitHub Actions Deploy`
   - **Expiration:** `Never` (ou escolha um prazo)

5. **Clique em:** `Generate Token`

6. **COPIE O TOKEN** (você vai precisar no próximo passo!)
   - ⚠️ **IMPORTANTE:** Você só verá o token UMA VEZ! Copie agora!
   - Exemplo: `sbp_abc123def456...` (começa com `sbp_`)

---

### **PASSO 2: Subir o Código para o GitHub**

#### **Se você JÁ TEM um repositório GitHub:**

1. **Abra o terminal** na pasta do projeto

2. **Execute:**
   ```bash
   git add .
   git commit -m "Add GitHub Actions deploy workflow"
   git push
   ```

#### **Se você NÃO TEM um repositório GitHub ainda:**

1. **Acesse:** https://github.com/new

2. **Crie um novo repositório:**
   - **Repository name:** `duopro-services` (ou o nome que quiser)
   - **Visibility:** `Private` (recomendado)
   - ✅ **NÃO marque** "Add a README file"

3. **Clique em:** `Create repository`

4. **No terminal, na pasta do projeto, execute:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/duopro-services.git
   git push -u origin main
   ```
   
   *(Substitua `SEU_USUARIO` pelo seu username do GitHub)*

---

### **PASSO 3: Adicionar o Token no GitHub**

1. **Acesse seu repositório no GitHub:**
   - `https://github.com/SEU_USUARIO/duopro-services`

2. **Clique em:** `Settings` (no menu superior do repositório)

3. **No menu lateral esquerdo, clique em:**
   - `Secrets and variables` → `Actions`

4. **Clique em:** `New repository secret`

5. **Preencha:**
   - **Name:** `SUPABASE_ACCESS_TOKEN`
   - **Secret:** Cole o token que você copiou no PASSO 1
   
6. **Clique em:** `Add secret`

---

### **PASSO 4: Executar o Deploy!** 🚀

Agora você tem **2 formas** de fazer o deploy:

#### **OPÇÃO A: Deploy Automático** (ao fazer push)

Sempre que você fizer `git push`, o deploy acontece automaticamente! ✨

```bash
git add .
git commit -m "Update code"
git push
```

#### **OPÇÃO B: Deploy Manual** (quando quiser)

1. **Acesse seu repositório no GitHub**

2. **Clique em:** `Actions` (no menu superior)

3. **Selecione:** `Deploy Supabase Edge Function` (no menu lateral)

4. **Clique em:** `Run workflow` (botão azul no lado direito)

5. **Clique em:** `Run workflow` (confirmar)

6. **Aguarde 1-2 minutos** ⏱️

7. **Veja o progresso em tempo real!** 👀

---

### **PASSO 5: Verificar se Funcionou** ✅

1. **No GitHub Actions, clique no workflow** que acabou de rodar

2. **Você deve ver:**
   ```
   ✅ DEPLOY CONCLUÍDO COM SUCESSO!
   ```

3. **Teste a API:**
   - Abra: https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
   - **Resposta esperada:**
     ```json
     {"status":"ok","message":"Server is running"}
     ```

4. **Recarregue seu aplicativo** (F5)

5. **Faça login e teste tudo!** 🎉

---

## 🎊 PRONTO! AGORA ESTÁ TUDO AUTOMATIZADO!

### **Vantagens:**

- ✅ **Zero instalação** no seu computador
- ✅ **Deploy automático** a cada push
- ✅ **Histórico completo** de deploys
- ✅ **Logs detalhados** em caso de erro
- ✅ **Pode rodar manualmente** quando quiser

---

## 🆘 PROBLEMAS COMUNS

### ❌ Erro: "Invalid access token"

**Solução:** 
1. Verifique se você copiou o token completo (começa com `sbp_`)
2. Gere um novo token e atualize o secret no GitHub

### ❌ Erro: "Project not found"

**Solução:**
1. Verifique se você tem acesso ao projeto `lqpmyvizjfwzddxspacv` no Supabase
2. Verifique se o token tem permissão para o projeto

### ❌ Workflow não aparece no GitHub Actions

**Solução:**
1. Verifique se o arquivo está em: `.github/workflows/deploy-supabase.yml`
2. Faça push novamente: `git add . && git commit -m "Add workflow" && git push`

---

## 📞 PRECISA DE AJUDA?

Me envie:
1. **Screenshot do erro** no GitHub Actions
2. **Logs completos** do workflow

Eu te ajudo a resolver! 😊

---

## 🎯 RESUMO RÁPIDO:

```
1. Pegar token do Supabase → https://supabase.com/dashboard/account/tokens
2. Subir código para GitHub → git push
3. Adicionar token nos Secrets → Settings > Secrets > Actions
4. Rodar workflow → Actions > Run workflow
5. Testar → Recarregar app (F5)
```

**TEMPO TOTAL: 5-10 minutos** ⏱️

**E depois disso, deploy automático para sempre!** ✨
