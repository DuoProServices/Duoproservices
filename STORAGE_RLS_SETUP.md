# 🔐 STORAGE RLS POLICIES SETUP GUIDE

## ⚠️ IMPORTANTE: Configure as políticas RLS para permitir uploads!

O erro **"new row violates row-level security policy"** acontece porque o Supabase Storage tem RLS ativo mas sem políticas configuradas.

---

## 📋 PASSO A PASSO:

### **1️⃣ Acesse o Supabase Dashboard**
- Vá para: https://supabase.com/dashboard
- Selecione seu projeto
- Vá em: **Storage** (menu lateral esquerdo)

### **2️⃣ Configure Políticas para CADA Bucket**

Você tem 2 buckets que precisam de políticas:
- ✅ `make-c2a25be0-client-documents`
- ✅ `tax-documents-c2a25be0`

Para CADA bucket, faça:

---

### **3️⃣ Clique no bucket → "Policies" → "New Policy"**

Crie **4 políticas** para cada bucket:

---

#### **📤 POLÍTICA 1: INSERT (Permitir uploads)**

```
Policy name: Allow authenticated uploads
Target roles: authenticated
Policy command: INSERT
WITH CHECK expression: true
```

**OU use SQL:**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'NOME_DO_BUCKET');
```

---

#### **📖 POLÍTICA 2: SELECT (Permitir leitura)**

```
Policy name: Allow authenticated reads
Target roles: authenticated
Policy command: SELECT
USING expression: true
```

**OU use SQL:**
```sql
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'NOME_DO_BUCKET');
```

---

#### **✏️ POLÍTICA 3: UPDATE (Permitir atualizações)**

```
Policy name: Allow authenticated updates
Target roles: authenticated
Policy command: UPDATE
USING expression: true
```

**OU use SQL:**
```sql
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'NOME_DO_BUCKET');
```

---

#### **🗑️ POLÍTICA 4: DELETE (Permitir deletar)**

```
Policy name: Allow authenticated deletes
Target roles: authenticated
Policy command: DELETE
USING expression: true
```

**OU use SQL:**
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'NOME_DO_BUCKET');
```

---

## 🎯 ATALHO RÁPIDO (SQL Editor)

Vá em **SQL Editor** no Supabase e execute este script:

```sql
-- Políticas para make-c2a25be0-client-documents
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');

CREATE POLICY "Allow authenticated reads" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

-- Políticas para tax-documents-c2a25be0
CREATE POLICY "Allow authenticated uploads tax" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tax-documents-c2a25be0');

CREATE POLICY "Allow authenticated reads tax" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

CREATE POLICY "Allow authenticated updates tax" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

CREATE POLICY "Allow authenticated deletes tax" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');
```

---

## ✅ VERIFICAÇÃO

Após configurar, teste fazendo upload de um documento no sistema.

Se funcionar = **SUCESSO!** 🎉

Se ainda der erro, verifique:
1. ✓ RLS está habilitado no bucket?
2. ✓ As 4 políticas foram criadas?
3. ✓ O usuário está autenticado?

---

## 💡 DICA

Para facilitar, você pode usar `true` nas expressões para permitir TODOS os usuários autenticados.

Para mais segurança (opcional), você pode restringir por `auth.uid()`:
```sql
WITH CHECK (auth.uid() = owner_id)
```

Mas para o seu caso, `true` é suficiente e mais simples!

---

**PRONTO!** Depois de configurar as políticas, os uploads vão funcionar perfeitamente! 🚀
