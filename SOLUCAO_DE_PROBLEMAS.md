# 🆘 SOLUÇÃO DE PROBLEMAS - GUIA COMPLETO

## 🔍 ERROS COMUNS E SOLUÇÕES

---

## ❌ ERRO 1: "Invalid access token"

### **Sintomas:**
- Workflow falha no GitHub Actions
- Mensagem: "Invalid access token" ou "Authentication failed"

### **Solução:**

1. **Verifique se você copiou o token completo:**
   - Token do Supabase começa com `sbp_`
   - Não deve ter espaços no começo ou fim
   - Copie novamente para ter certeza

2. **Gere um novo token:**
   - Acesse: https://supabase.com/dashboard/account/tokens
   - Clique em "Generate New Token"
   - Copie o novo token

3. **Atualize o secret no GitHub:**
   - Vá para: `Settings` > `Secrets and variables` > `Actions`
   - Clique no secret `SUPABASE_ACCESS_TOKEN`
   - Clique em "Update secret"
   - Cole o novo token
   - Salve

4. **Execute o workflow novamente**

---

## ❌ ERRO 2: "Project not found"

### **Sintomas:**
- Mensagem: "Project lqpmyvizjfwzddxspacv not found"
- Deploy falha ao tentar conectar

### **Solução:**

1. **Verifique se você tem acesso ao projeto:**
   - Acesse: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv
   - Se você consegue acessar = tem permissão ✅
   - Se aparece erro 404 = não tem acesso ❌

2. **Verifique se o token é do usuário correto:**
   - O token deve ser da mesma conta que tem acesso ao projeto
   - Gere um novo token logado na conta correta

3. **Verifique se o projeto ainda existe:**
   - Projetos podem ser deletados ou pausados
   - Confirme que o projeto está ativo

---

## ❌ ERRO 3: "Failed to deploy function"

### **Sintomas:**
- Deploy começa mas falha no final
- Mensagem: "Failed to deploy function" ou erro de compilação

### **Solução:**

1. **Verifique se há erros no código:**
   - Abra: `/supabase/functions/server/index.tsx`
   - Procure por erros de sintaxe

2. **Verifique os logs do workflow:**
   - No GitHub Actions, clique no workflow que falhou
   - Clique em "deploy" > "Deploy Edge Function"
   - Leia o erro completo

3. **Problemas comuns:**
   - **Imports faltando:** Verifique se todos os arquivos estão commitados
   - **Dependências:** Verifique se o `deno.json` está correto
   - **Sintaxe:** Procure por erros de TypeScript

---

## ❌ ERRO 4: Workflow não aparece no GitHub Actions

### **Sintomas:**
- Não vejo "Deploy Supabase Edge Function" em Actions
- Aba Actions está vazia

### **Solução:**

1. **Verifique se o arquivo está no lugar certo:**
   ```
   .github/
     workflows/
       deploy-supabase.yml  ← Deve estar EXATAMENTE aqui
   ```

2. **Verifique se você fez commit e push:**
   ```bash
   git add .github/workflows/deploy-supabase.yml
   git commit -m "Add workflow"
   git push
   ```

3. **Verifique se Actions está habilitado:**
   - Vá para: `Settings` > `Actions` > `General`
   - "Allow all actions and reusable workflows" deve estar marcado

4. **Aguarde alguns segundos:**
   - GitHub pode levar até 30 segundos para mostrar o workflow

---

## ❌ ERRO 5: "Health check failed" depois do deploy

### **Sintomas:**
- Deploy teve sucesso ✅
- Mas ao testar: https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
- Retorna erro 404 ou 500

### **Solução:**

1. **Aguarde 1-2 minutos:**
   - Edge Functions podem levar alguns minutos para ficar ativas

2. **Verifique os logs da função no Supabase:**
   - Acesse: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/functions
   - Clique em "server"
   - Veja os logs

3. **Teste manualmente:**
   - Abra: https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/server/health
   - Note: sem o prefixo `make-server-c2a25be0`

4. **Verifique se a rota está correta no código:**
   - Abra: `/supabase/functions/server/index.tsx`
   - Procure por: `app.get('/make-server-c2a25be0/health'`

---

## ❌ ERRO 6: "Permission denied" no git push

### **Sintomas:**
- Ao fazer `git push`, aparece erro de permissão
- "Permission denied (publickey)" ou "Authentication failed"

### **Solução:**

**Opção A: Usar HTTPS (mais fácil)**
```bash
git remote set-url origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push
```
- Vai pedir usuário e senha
- Use um Personal Access Token como senha

**Opção B: Configurar SSH**
1. Siga: https://docs.github.com/pt/authentication/connecting-to-github-with-ssh
2. Adicione sua chave SSH ao GitHub

---

## ❌ ERRO 7: App ainda mostra "Failed to load messages"

### **Sintomas:**
- Deploy teve sucesso ✅
- Health check funciona ✅
- Mas app ainda mostra erros

### **Solução:**

1. **Limpe o cache do navegador:**
   - Pressione: `Ctrl + Shift + Delete` (Windows/Linux)
   - Pressione: `Cmd + Shift + Delete` (Mac)
   - Marque "Cached images and files"
   - Clique em "Clear data"

2. **Force reload:**
   - Pressione: `Ctrl + Shift + R` (Windows/Linux)
   - Pressione: `Cmd + Shift + R` (Mac)

3. **Verifique o console do navegador:**
   - Pressione: `F12`
   - Vá para aba "Console"
   - Procure por erros em vermelho
   - Me envie os erros se houver

4. **Verifique se está usando a URL correta:**
   - Abra: `/src/config/api.ts`
   - Confirme que tem: `lqpmyvizjfwzddxspacv`

---

## ❌ ERRO 8: "Workflow requires approval"

### **Sintomas:**
- Workflow fica "amarelo" aguardando aprovação
- Mensagem: "This workflow requires approval"

### **Solução:**

1. **Clique em "Approve and run":**
   - Isso acontece no primeiro workflow
   - É uma medida de segurança do GitHub

2. **Desabilitar aprovação (opcional):**
   - Vá para: `Settings` > `Actions` > `General`
   - Em "Fork pull request workflows", ajuste as configurações

---

## 🔍 COMO INVESTIGAR QUALQUER ERRO

### **1. Veja os logs do GitHub Actions:**
```
1. Vá para: Actions
2. Clique no workflow que falhou (ícone vermelho ❌)
3. Clique em "deploy"
4. Clique em cada etapa para ver os detalhes
5. Copie o erro completo
```

### **2. Veja os logs do Supabase:**
```
1. Acesse: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv
2. Vá para: Edge Functions > server
3. Clique em "Logs"
4. Veja os erros recentes
```

### **3. Veja os logs do navegador:**
```
1. Pressione F12
2. Vá para aba "Console"
3. Veja erros em vermelho
4. Vá para aba "Network"
5. Veja requisições com status 4xx ou 5xx
```

---

## 📞 AINDA COM PROBLEMAS?

### **Me envie:**

1. ✅ **Qual passo deu erro** (use o CHECKLIST_DEPLOY.md)

2. ✅ **Logs completos:**
   - Do GitHub Actions (copie toda a saída)
   - Do Supabase (screenshot)
   - Do navegador (F12 > Console)

3. ✅ **Screenshots:**
   - Da tela de erro
   - Do workflow no GitHub
   - Do console do navegador

4. ✅ **O que você já tentou:**
   - Liste tudo que você já fez

### **Formato ideal:**

```
PASSO QUE DEU ERRO: Passo 4 - Executar Deploy

ERRO COMPLETO:
[Cole aqui o erro completo]

LOGS:
[Cole aqui os logs]

O QUE JÁ TENTEI:
- Regenerei o token
- Executei o workflow novamente
- ...

SCREENSHOTS:
[Anexe aqui]
```

---

## 💡 DICAS PARA EVITAR PROBLEMAS

✅ **Copie e cole tokens/comandos** (não digite manualmente)
✅ **Siga os passos UM POR VEZ** (não pule etapas)
✅ **Aguarde cada etapa completar** (não seja impaciente)
✅ **Leia as mensagens de erro** (elas geralmente dizem o problema)
✅ **Faça backup do token** (salve em um lugar seguro)

---

## 🎯 99% DOS PROBLEMAS SÃO:

1. **Token copiado incorretamente** (30%)
2. **Arquivo workflow no lugar errado** (20%)
3. **Secret não configurado no GitHub** (20%)
4. **Cache do navegador** (15%)
5. **Não aguardou deploy completar** (10%)
6. **Outros** (5%)

**Verifique esses 6 itens primeiro!** 👆

---

**BOA SORTE! 🍀**

Se seguir este guia, você vai conseguir! 💪
