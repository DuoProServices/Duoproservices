# 🔥 **RESOLVER ERRO: "new row violates row-level security policy"**

---

## ❌ **O ERRO:**
```
Error uploading file: StorageApiError: 
new row violates row-level security policy
```

**Significado:** As **policies RLS** (Row Level Security) não estão configuradas!

---

## ✅ **SOLUÇÃO RÁPIDA (3 MINUTOS):**

### **📍 PASSO 1: Abrir Admin Dashboard**
```
/admin/dashboard
```

### **📍 PASSO 2: Clicar no Botão ROXO** 
Procure pelo card **ROXO** com o título:
```
🪄 Configuração Mágica
Passo 2: Criar as políticas de acesso
```

Clique no botão grande: **"CLIQUE AQUI PARA CONFIGURAR"**

---

### **📍 PASSO 3: Seguir os 3 Sub-Passos**

#### **3.1 - Copiar o SQL**
✅ Clique no botão azul **"COPIAR SQL"**
✅ Deve aparecer: "SQL copied!"

#### **3.2 - Abrir Supabase**  
✅ Clique no botão verde **"ABRIR SUPABASE"**
✅ Vai abrir uma nova aba

#### **3.3 - Executar no SQL Editor**

**Na nova aba do Supabase:**

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New query"** (canto superior direito)
3. **Cole o SQL** que você copiou (Ctrl+V)
4. Clique no botão **"RUN"** (canto inferior direito)
5. Deve aparecer: **"Success. No rows returned"** ✅

---

## 🎯 **O QUE O SQL FAZ:**

```sql
-- 1. Deleta todas as policies antigas (se existirem)
DROP POLICY IF EXISTS ...

-- 2. Cria 4 policies para bucket "tax-documents-c2a25be0"
--    - INSERT (fazer upload)
--    - SELECT (visualizar)
--    - UPDATE (atualizar)
--    - DELETE (deletar)

-- 3. Cria 4 policies para bucket "make-c2a25be0-client-documents"
--    - INSERT, SELECT, UPDATE, DELETE
```

**Resultado:** QUALQUER usuário autenticado pode fazer tudo nos 2 buckets! ✅

---

## 🧪 **DEPOIS DE EXECUTAR O SQL:**

### **1. Volte para o app**
```
/client-portal
```

### **2. Faça upload de um arquivo**
- Vá para "Upload Documents"  
- Selecione um PDF ou imagem
- Clique em "Upload"
- **DEVE FUNCIONAR AGORA!** ✅

---

## 🆘 **SE AINDA NÃO FUNCIONAR:**

### **Cenário 1: Erro "Buckets não encontrados"**
```
Problema: Os buckets não foram criados
Solução: Use o BOTÃO AZUL primeiro (Criar Buckets)
```

### **Cenário 2: SQL deu erro no Supabase**
```
Erro possível: "relation storage.objects does not exist"
Solução: Você está no projeto errado!
         Confirme que está em: pwlacumydrxvshklvttp
```

### **Cenário 3: Ainda dá erro de RLS**
```
Problema: As policies não foram criadas
Solução: 
1. Vá para Supabase → Storage → Policies
2. Verifique se existem 8 policies
3. Se não existirem, execute o SQL novamente
```

### **Cenário 4: Erro de autenticação**
```
Problema: Token expirado
Solução: Faça logout e login novamente
```

---

## 📊 **COMO VERIFICAR SE DEU CERTO:**

### **No Supabase → Storage → Policies:**

Deve ter **8 policies**:

```
✅ tax_documents_insert
✅ tax_documents_select  
✅ tax_documents_update
✅ tax_documents_delete

✅ client_documents_insert
✅ client_documents_select
✅ client_documents_update
✅ client_documents_delete
```

---

## 🎯 **RESUMO VISUAL:**

```
┌─────────────────────────────────────┐
│  1. Admin Dashboard                 │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  2. Botão ROXO                      │
│     "Configuração Mágica"           │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  3. Copiar SQL                      │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  4. Abrir Supabase                  │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  5. SQL Editor → New Query          │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  6. Colar SQL → RUN                 │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  ✅ Success. No rows returned        │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  ✨ UPLOAD VAI FUNCIONAR! ✨        │
└─────────────────────────────────────┘
```

---

## 📸 **PRINTS DO QUE VOCÊ DEVE VER:**

### **1. No Admin Dashboard:**
```
[Card ROXO com ícone de ✨]
🪄 Configuração Mágica
Passo 2: Criar as políticas de acesso
```

### **2. Depois de clicar:**
```
[Botões aparecem]
🔵 COPIAR SQL
🟢 ABRIR SUPABASE  
📋 VER PREVIEW
```

### **3. No Supabase após executar:**
```
Success. No rows returned
Statement executed successfully
```

---

## ⚡ **ATALHO SUPER RÁPIDO:**

Se preferir, copie e cole este SQL **diretamente** no Supabase:

```sql
-- Limpar
DROP POLICY IF EXISTS "tax_documents_insert" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_select" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_update" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_delete" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_insert" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_select" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_update" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_delete" ON storage.objects;

-- Criar
CREATE POLICY "tax_documents_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tax-documents-c2a25be0') WITH CHECK (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tax-documents-c2a25be0');

CREATE POLICY "client_documents_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents') WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents');
```

---

## 🎉 **DEPOIS DISSO:**

✅ Upload vai funcionar  
✅ Download vai funcionar  
✅ Delete vai funcionar  
✅ Tudo pronto! 🚀

---

**Me avise quando conseguir!** 😊
