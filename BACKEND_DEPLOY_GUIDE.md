# 🚀 Guia de Deploy do Backend (Supabase Edge Functions)

## ⚠️ IMPORTANTE: O servidor backend precisa estar rodando!

O erro **"Failed to fetch"** significa que o backend não está deployado ou não está respondendo.

---

## 📋 PRÉ-REQUISITOS

1. **Conta no Supabase** (gratuita): https://supabase.com
2. **Supabase CLI instalado**:
   ```bash
   npm install -g supabase
   ```

---

## 🔧 PASSO 1: Setup Inicial do Supabase

### 1.1 Login no Supabase

```bash
supabase login
```

Isso abrirá o navegador para você fazer login.

### 1.2 Linkar o Projeto

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

Quando solicitar a senha do banco de dados, você pode encontrá-la em:
- **Supabase Dashboard** → **Project Settings** → **Database** → **Database Password**

---

## 🗄️ PASSO 2: Criar a Tabela KV Store

O sistema usa uma tabela para armazenar dados. Você precisa criá-la:

### Opção A: Via Supabase Dashboard (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/editor
2. Clique em **"SQL Editor"** no menu lateral
3. Cole e execute este SQL:

```sql
CREATE TABLE kv_store_c2a25be0 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Criar índice para melhorar performance de buscas por prefixo
CREATE INDEX idx_kv_store_key_prefix ON kv_store_c2a25be0(key text_pattern_ops);
```

4. Clique em **"Run"**

### Opção B: Via CLI

```bash
supabase db push
```

---

## ☁️ PASSO 3: Deploy da Edge Function

### 3.1 Deploy do Servidor

```bash
supabase functions deploy make-server-c2a25be0
```

### 3.2 Configurar Variáveis de Ambiente

As Edge Functions precisam de algumas variáveis que já estão configuradas automaticamente:
- `SUPABASE_URL` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅

**Você não precisa fazer nada aqui!** O Supabase injeta essas variáveis automaticamente.

---

## ✅ PASSO 4: Testar o Servidor

### 4.1 Testar Health Check

```bash
curl https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health
```

**Resposta esperada:**
```json
{"status":"ok"}
```

### 4.2 Verificar Logs

No **Supabase Dashboard**:
1. Vá em **Edge Functions** no menu lateral
2. Clique em **make-server-c2a25be0**
3. Veja a aba **"Logs"** para debug

---

## 🔐 PASSO 5: Configurar Storage

O sistema usa Supabase Storage para armazenar documentos. O bucket é criado automaticamente na primeira vez que o servidor roda.

### Verificar se o Bucket Existe

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/storage/buckets
2. Procure por: `make-c2a25be0-client-documents`
3. Se não existir, será criado automaticamente quando alguém fizer upload

---

## 🎯 PASSO 6: Testar o Sistema Completo

### 6.1 Criar uma Conta de Teste

No seu site, vá para `/signup` e crie uma conta:
- **Nome**: Teste Cliente
- **Email**: teste@exemplo.com
- **Senha**: teste123

### 6.2 Fazer Login

Use as mesmas credenciais em `/login`

### 6.3 Testar Upload de Documentos

No dashboard, faça upload de um documento de teste.

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "Failed to fetch"

**Causa**: O servidor não está deployado ou não está respondendo.

**Solução**:
```bash
# Verifique se a função está deployada
supabase functions list

# Se não aparecer, faça deploy novamente
supabase functions deploy make-server-c2a25be0
```

### Erro: "Invalid login credentials"

**Causa**: A conta não existe no banco de dados.

**Solução**: Crie uma nova conta via `/signup` primeiro.

### Erro: "Unauthorized" ou "No access token"

**Causa**: O token de autenticação expirou ou é inválido.

**Solução**: Faça logout e login novamente.

### Erro: "Table kv_store_c2a25be0 does not exist"

**Causa**: A tabela não foi criada.

**Solução**: Execute o SQL do PASSO 2 no Supabase Dashboard.

### Erro no Storage: "Bucket not found"

**Causa**: O bucket não foi criado.

**Solução**: 
1. Acesse o Storage no Dashboard
2. Crie manualmente um bucket privado chamado: `make-c2a25be0-client-documents`
3. Configure:
   - **Public**: ❌ NÃO
   - **File size limit**: 50 MB
   - **Allowed MIME types**: application/pdf, image/jpeg, image/png, image/jpg

---

## 📊 MONITORAMENTO

### Ver Logs do Servidor

```bash
supabase functions logs make-server-c2a25be0 --tail
```

Ou no Dashboard:
- **Edge Functions** → **make-server-c2a25be0** → **Logs**

### Verificar Uso de Recursos

No Dashboard do Supabase:
- **Home** → **Usage**

Você pode ver:
- Requests da Edge Function
- Armazenamento usado
- Número de usuários autenticados

---

## 🆘 COMANDOS ÚTEIS

```bash
# Listar todas as funções deployadas
supabase functions list

# Ver logs em tempo real
supabase functions logs make-server-c2a25be0 --tail

# Deletar uma função (cuidado!)
supabase functions delete make-server-c2a25be0

# Re-deploy
supabase functions deploy make-server-c2a25be0

# Testar localmente (desenvolvimento)
supabase start
supabase functions serve make-server-c2a25be0
```

---

## 🎉 CHECKLIST FINAL

Antes de considerar o deploy completo:

- [ ] Supabase CLI instalado e autenticado
- [ ] Projeto linkado (`supabase link`)
- [ ] Tabela `kv_store_c2a25be0` criada
- [ ] Edge Function `make-server-c2a25be0` deployada
- [ ] Health check respondendo: `/health` retorna `{"status":"ok"}`
- [ ] Bucket de storage criado (ou será criado automaticamente)
- [ ] Conseguiu criar uma conta de teste via `/signup`
- [ ] Conseguiu fazer login via `/login`
- [ ] Upload de documentos funcionando
- [ ] Timeline avançando automaticamente após upload

---

## 📞 SUPORTE

Se ainda tiver problemas:

1. **Verifique os logs** no Supabase Dashboard
2. **Verifique o console do navegador** (F12) para ver erros do frontend
3. **Teste o health check** para confirmar que o servidor está online
4. **Verifique se a tabela KV foi criada** no Database Editor

---

**Boa sorte! 🚀**

Depois de seguir esses passos, seu sistema de portal do cliente estará 100% funcional!
