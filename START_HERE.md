# 🚨 ERRO: "Failed to fetch" - CORRIJA AGORA!

## ⚡ **AÇÃO RÁPIDA (3 MINUTOS):**

### **🪟 Windows:**
```powershell
.\deploy-agora.ps1
```

### **🍎 Mac/Linux:**
```bash
chmod +x deploy-agora.sh && ./deploy-agora.sh
```

### **💻 Ou cole manualmente no terminal:**
```bash
npm install -g supabase
supabase login
supabase link --project-ref lqpmyvizjfwzddxspacv
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt
```

---

## 📚 **GUIAS DISPONÍVEIS:**

| Arquivo | Quando usar | Tempo |
|---------|-------------|-------|
| **`LEIA_PRIMEIRO.md`** | Começar aqui! Visão geral | 2 min |
| **`CORRIGIR_ERRO_FAILED_TO_FETCH.md`** | Guia detalhado passo a passo | 5 min |
| **`DEBUG_FAILED_TO_FETCH.md`** | Debug avançado, testes | 10 min |
| **`test-api.html`** | Testar se backend funciona | 1 min |
| **`deploy-agora.sh`** | Script automático (Mac/Linux) | 3 min |
| **`deploy-agora.ps1`** | Script automático (Windows) | 3 min |

---

## 🎯 **FLUXO RECOMENDADO:**

```
1. LEIA_PRIMEIRO.md
   ↓
2. Rodar script de deploy (3 min)
   ↓
3. Testar com test-api.html (1 min)
   ↓
4. Recarregar app (F5)
   ↓
5. ✅ FUNCIONANDO!
```

**OU** se der erro:

```
1. Rodar script de deploy
   ↓
2. Deu erro?
   ↓
3. Ler DEBUG_FAILED_TO_FETCH.md
   ↓
4. Seguir troubleshooting
   ↓
5. Enviar erro completo
```

---

## ✅ **VERIFICAÇÃO RÁPIDA:**

Abra no navegador:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

**✅ Deve retornar:**
```json
{"status":"ok","message":"Server is running"}
```

**❌ Se retornar 404 ou erro:**
→ Backend não foi deployado! Use os scripts acima.

---

## 🆘 **PRECISA DE AJUDA?**

**Siga esta ordem:**

1. ✅ Abra `LEIA_PRIMEIRO.md`
2. ✅ Tente rodar o script de deploy
3. ✅ Se der erro, abra `DEBUG_FAILED_TO_FETCH.md`
4. ✅ Me envie o erro completo se ainda precisar de ajuda

---

## 📊 **RESUMO:**

```
PROBLEMA: "Failed to fetch"
         ↓
CAUSA: Backend não foi deployado
         ↓
SOLUÇÃO: Rodar script (3 min)
         ↓
TESTAR: Abrir test-api.html
         ↓
✅ PRONTO!
```

---

**COMECE PELO `LEIA_PRIMEIRO.md`! 🚀**
