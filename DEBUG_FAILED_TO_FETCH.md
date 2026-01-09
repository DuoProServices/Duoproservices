# 🔍 DEBUG: "Failed to fetch" - Guia Completo

## 📊 DIAGNÓSTICO COMPLETO

### **1. VERIFICAR SE O BACKEND ESTÁ RODANDO**

Abra no navegador:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

#### **✅ SE RETORNAR:**
```json
{"status":"ok","message":"Server is running"}
```
**→ Backend está OK! Vá para seção "Backend OK mas App com erro"**

#### **❌ SE RETORNAR:**
- `404 Not Found` → Edge Function não existe
- `Function not found` → Edge Function não foi deployada
- `CORS error` → Problema de CORS (raro)
- Timeout ou nada → Supabase fora do ar (muito raro)

**→ Backend NÃO ESTÁ OK! Vá para seção "Fazer Deploy"**

---

## 🚀 SEÇÃO 1: FAZER DEPLOY DO BACKEND

### **MÉTODO RÁPIDO (3 minutos):**

```bash
# Cole estes 4 comandos no terminal:

npm install -g supabase
supabase login
supabase link --project-ref lqpmyvizjfwzddxspacv
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt
```

### **OU USE O SCRIPT:**

**Windows (PowerShell):**
```powershell
.\deploy-agora.ps1
```

**Mac/Linux (Terminal):**
```bash
chmod +x deploy-agora.sh && ./deploy-agora.sh
```

---

## 🔧 SEÇÃO 2: BACKEND OK MAS APP COM ERRO

Se a URL de health check funciona MAS o app ainda mostra erro:

### **PASSO 1: Limpar Cache do Navegador**

```
1. Pressione: Ctrl + Shift + Delete (Win) ou Cmd + Shift + Delete (Mac)
2. Marque: "Cached images and files"
3. Período: "All time" / "Todo o período"
4. Clique: "Clear data" / "Limpar dados"
```

### **PASSO 2: Force Reload**

```
Pressione: Ctrl + Shift + R (Win) ou Cmd + Shift + R (Mac)
```

### **PASSO 3: Verificar Console do Navegador**

```
1. Pressione: F12
2. Vá para aba: "Console"
3. Recarregue a página
4. Procure erros em vermelho
```

#### **Erros Comuns:**

**❌ "CORS policy: No 'Access-Control-Allow-Origin'"**
→ Problema: Backend não está retornando headers CORS corretos
→ Solução: Verificar arquivo `/supabase/functions/server/index.tsx`

**❌ "NetworkError when attempting to fetch resource"**
→ Problema: Requisição bloqueada ou URL errada
→ Solução: Verificar `/src/config/api.ts`

**❌ "Failed to fetch"**
→ Problema: Backend não responde ou URL errada
→ Solução: Verificar URL e fazer deploy

### **PASSO 4: Verificar Network Tab**

```
1. Pressione: F12
2. Vá para aba: "Network"
3. Recarregue a página
4. Procure requisições com status vermelho (4xx, 5xx)
5. Clique na requisição
6. Veja a resposta (Response tab)
```

### **PASSO 5: Verificar Configuração de API**

Abra: `/src/config/api.ts`

Deve conter:
```typescript
export const API_BASE_URL = 'https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0';
```

Se estiver diferente, corrija!

---

## 🧪 SEÇÃO 3: TESTES DETALHADOS

### **TESTE 1: Health Check**

```bash
curl https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

**Esperado:**
```json
{"status":"ok","message":"Server is running"}
```

### **TESTE 2: Messages API (sem autenticação)**

```bash
curl https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/api/messages
```

**Esperado:**
```json
{"error":"Not authenticated"}
```
ou
```
Status: 401 Unauthorized
```

**OBS:** 401 é ESPERADO! Significa que a API está funcionando mas requer login.

### **TESTE 3: Via Navegador**

Abra o arquivo: `test-api.html`

Clique nos botões de teste e veja os resultados.

---

## 🔍 SEÇÃO 4: PROBLEMAS ESPECÍFICOS

### **PROBLEMA A: "Function not found"**

**Causa:** Edge Function não foi deployada

**Solução:**
1. Acesse: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/functions
2. Veja se existe uma função chamada "server"
3. Se não existir, faça o deploy (Seção 1)

### **PROBLEMA B: "Invalid project reference"**

**Causa:** Project ID errado ou você não tem acesso

**Solução:**
1. Confirme que você tem acesso ao projeto `lqpmyvizjfwzddxspacv`
2. Acesse: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv
3. Se aparecer 404, você não tem acesso ao projeto

### **PROBLEMA C: "CORS error"**

**Causa:** Headers CORS faltando no backend

**Solução:**
1. Abra: `/supabase/functions/server/index.tsx`
2. Verifique se tem:
   ```typescript
   import { cors } from 'npm:hono/cors';
   app.use('*', cors());
   ```
3. Se não tiver, adicione
4. Faça deploy novamente

### **PROBLEMA D: App funciona mas algumas APIs falham**

**Causa:** Algumas rotas não estão implementadas ou retornam erro

**Solução:**
1. Veja o console (F12 > Console)
2. Identifique qual rota está falhando
3. Verifique os logs no Supabase:
   - https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/functions
   - Clique em "server" > "Logs"

---

## 📋 CHECKLIST DE VERIFICAÇÃO COMPLETO

### **Backend:**
- [ ] Edge Function "server" existe no Supabase
- [ ] Function está com status "Active" (não "Paused")
- [ ] Health check retorna `{"status":"ok"}`
- [ ] Logs não mostram erros críticos

### **Frontend:**
- [ ] Arquivo `/src/config/api.ts` tem a URL correta
- [ ] Cache do navegador foi limpo
- [ ] Force reload foi feito (Ctrl+Shift+R)
- [ ] Console não mostra erros de CORS
- [ ] Network tab mostra requisições com status 200 ou 401

### **Autenticação:**
- [ ] Consigo fazer login
- [ ] Token de acesso está sendo enviado nos headers
- [ ] Supabase Auth está configurado

---

## 🆘 MATRIZ DE SOLUÇÃO RÁPIDA

| Erro | Causa Provável | Solução Rápida |
|------|---------------|----------------|
| 404 Not Found | Edge Function não deployada | Fazer deploy (Seção 1) |
| 500 Internal Server Error | Erro no código backend | Ver logs no Supabase |
| CORS error | Headers CORS faltando | Verificar código CORS |
| Failed to fetch | URL errada ou backend down | Verificar URL e fazer deploy |
| 401 Unauthorized | Sem autenticação | Normal! Faça login primeiro |
| Timeout | Supabase fora do ar | Aguardar ou verificar status |

---

## 🎯 FLUXO DE DEBUG RECOMENDADO

```
1. Testar Health Check
   ├─ ✅ Funciona → Ir para passo 2
   └─ ❌ Falha → Fazer deploy (Seção 1)

2. Limpar Cache
   ├─ Ctrl+Shift+Delete
   └─ Ctrl+Shift+R

3. Ver Console (F12)
   ├─ Erros vermelhos? → Investigar erro específico
   └─ Sem erros? → Ir para passo 4

4. Ver Network Tab (F12)
   ├─ Status 4xx/5xx? → Ver resposta da API
   └─ Status 200? → Backend OK, problema no frontend

5. Testar Login
   ├─ ✅ Funciona → Sistema OK!
   └─ ❌ Falha → Ver logs Supabase Auth

6. Ainda com problema?
   └─ Enviar logs completos + screenshots
```

---

## 📞 INFORMAÇÕES PARA SUPORTE

Se após tudo isso ainda tiver problema, me envie:

### **1. Resultado dos Testes:**
```
Health Check: [OK/FALHA - cole a resposta]
Messages API: [OK/FALHA - cole a resposta]
```

### **2. Console do Navegador:**
```
[Cole todos os erros em vermelho]
```

### **3. Network Tab:**
```
[Screenshot ou lista de requisições que falharam]
```

### **4. Logs do Supabase:**
```
[Acesse https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/functions
 Clique em "server" > "Logs"
 Cole os últimos logs]
```

### **5. O que você já tentou:**
```
- [ ] Fiz deploy
- [ ] Limpei cache
- [ ] Force reload
- [ ] Verifiquei console
- [ ] Verifiquei network
- [ ] ...
```

---

## ✅ DEPOIS QUE FUNCIONAR

Marque aqui:
- [ ] Health check funciona ✅
- [ ] Messages carregam ✅
- [ ] Dashboard funciona ✅
- [ ] Upload funciona ✅
- [ ] Bookkeeping funciona ✅

**PARABÉNS! 🎉**

---

**USE ESTE GUIA COMO REFERÊNCIA SEMPRE QUE TIVER PROBLEMAS COM O BACKEND!** 📚
