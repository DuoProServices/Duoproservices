# ⚡ COMANDOS RÁPIDOS - Deploy Completo

## 🚨 ATENÇÃO: Você está com erro "Failed to fetch"!

Isso significa que **o backend não está deployado**. Siga os passos abaixo:

---

## 🧪 PRIMEIRO: Teste se o Backend Está Funcionando

**Acesse a ferramenta de teste:**
```
http://localhost:5173/test-email.html
```

Isso vai te dizer:
- ✅ Se o backend está UP ou DOWN
- ✅ Se o email já está registrado
- ✅ Qual é o erro específico

📖 **Guia completo:** `TESTE_EMAIL.md`

---

## 1️⃣ INSTALAR SUPABASE CLI

```bash
npm install -g supabase
```

## 2️⃣ FAZER LOGIN NO SUPABASE

```bash
supabase login
```

## 3️⃣ LINKAR O PROJETO

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

> **Senha do banco**: Você encontra em Supabase Dashboard → Project Settings → Database

## 4️⃣ CRIAR A TABELA (VIA DASHBOARD)

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/editor
2. Clique em **SQL Editor**
3. Cole e execute:

```sql
CREATE TABLE kv_store_c2a25be0 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE INDEX idx_kv_store_key_prefix ON kv_store_c2a25be0(key text_pattern_ops);
```

## 5️⃣ DEPLOY DO SERVIDOR

```bash
supabase functions deploy make-server-c2a25be0
```

## 6️⃣ TESTAR

```bash
curl https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health
```

**Deve retornar:** `{"status":"ok"}`

---

## ✅ PRONTO!

Agora você pode:
1. Ir para `/signup` e criar uma conta
2. Fazer login em `/login`
3. Usar o dashboard do cliente

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Frontend (Netlify)**: `DEPLOY_GUIDE.md`
- **Backend (Supabase)**: `BACKEND_DEPLOY_GUIDE.md`

---

## 🐛 AINDA COM PROBLEMA?

Veja os logs:
```bash
supabase functions logs make-server-c2a25be0 --tail
```

Ou no Dashboard:
**Edge Functions** → **make-server-c2a25be0** → **Logs**