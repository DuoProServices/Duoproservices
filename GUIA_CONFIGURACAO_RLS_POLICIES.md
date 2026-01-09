# 🔐 GUIA COMPLETO: Configurar RLS Policies no Supabase

## 📌 **O QUE VOCÊ VAI FAZER:**
Configurar permissões de acesso aos buckets de storage para que os usuários autenticados possam fazer upload, visualizar e deletar documentos.

---

## ⚡ **MÉTODO RÁPIDO: Via SQL (RECOMENDADO)**

### **Passo 1: Acesse o SQL Editor**
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em **"SQL Editor"**

### **Passo 2: Execute o Script Completo**

Copie e cole este script SQL e clique em **"Run"**:

```sql
-- ============================================================
-- RLS POLICIES PARA STORAGE - TAX FILING SYSTEM
-- Execute este script uma única vez
-- ============================================================

-- BUCKET 1: tax-documents-c2a25be0
-- Este bucket armazena documentos fiscais dos clientes

-- Policy 1: Permitir INSERT (Upload)
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tax-documents-c2a25be0');

-- Policy 2: Permitir SELECT (Download/Visualizar)
CREATE POLICY "Allow authenticated users to read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

-- Policy 3: Permitir UPDATE (Atualizar)
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0')
WITH CHECK (bucket_id = 'tax-documents-c2a25be0');

-- Policy 4: Permitir DELETE (Deletar)
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

-- ============================================================

-- BUCKET 2: make-c2a25be0-client-documents
-- Este bucket armazena documentos gerais dos clientes

-- Policy 1: Permitir INSERT (Upload)
CREATE POLICY "Allow authenticated users to upload client documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 2: Permitir SELECT (Download/Visualizar)
CREATE POLICY "Allow authenticated users to read client documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 3: Permitir UPDATE (Atualizar)
CREATE POLICY "Allow authenticated users to update client documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents')
WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 4: Permitir DELETE (Deletar)
CREATE POLICY "Allow authenticated users to delete client documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

-- ============================================================
-- ✅ CONCLUÍDO!
-- Todas as policies foram criadas com sucesso.
-- ============================================================
```

### **Passo 3: Verificar**
Após executar o script, você verá uma mensagem de sucesso. Pronto! ✅

---

## 🖱️ **MÉTODO ALTERNATIVO: Via Interface (Mais Demorado)**

Se preferir fazer pela interface gráfica:

### **Para cada bucket (tax-documents-c2a25be0 e make-c2a25be0-client-documents):**

#### **1. Acessar Storage Policies**
1. Vá para **Storage** no menu lateral
2. Clique no bucket (ex: `tax-documents-c2a25be0`)
3. Clique na aba **"Policies"** (ao lado de "Configuration")

#### **2. Criar Policy de INSERT**
1. Clique em **"New Policy"**
2. Selecione **"For full customization"** (ou "Create custom policy")
3. Preencha:
   - **Policy name:** `Allow authenticated users to upload files`
   - **Allowed operation:** Marque **INSERT**
   - **Target roles:** Selecione `authenticated`
   - **WITH CHECK expression:** Digite `true`
4. Clique em **"Review"** → **"Save policy"**

#### **3. Criar Policy de SELECT**
1. Clique em **"New Policy"** novamente
2. Selecione **"For full customization"**
3. Preencha:
   - **Policy name:** `Allow authenticated users to read files`
   - **Allowed operation:** Marque **SELECT**
   - **Target roles:** Selecione `authenticated`
   - **USING expression:** Digite `true`
4. Clique em **"Review"** → **"Save policy"**

#### **4. Criar Policy de UPDATE**
1. Clique em **"New Policy"** novamente
2. Selecione **"For full customization"**
3. Preencha:
   - **Policy name:** `Allow authenticated users to update files`
   - **Allowed operation:** Marque **UPDATE**
   - **Target roles:** Selecione `authenticated`
   - **USING expression:** Digite `true`
   - **WITH CHECK expression:** Digite `true`
4. Clique em **"Review"** → **"Save policy"**

#### **5. Criar Policy de DELETE**
1. Clique em **"New Policy"** novamente
2. Selecione **"For full customization"**
3. Preencha:
   - **Policy name:** `Allow authenticated users to delete files`
   - **Allowed operation:** Marque **DELETE**
   - **Target roles:** Selecione `authenticated`
   - **USING expression:** Digite `true`
4. Clique em **"Review"** → **"Save policy"**

#### **6. Repetir para o segundo bucket**
Repita os passos 1-5 para o bucket `make-c2a25be0-client-documents`, mas mude o nome das policies:
- `Allow authenticated users to upload client documents`
- `Allow authenticated users to read client documents`
- `Allow authenticated users to update client documents`
- `Allow authenticated users to delete client documents`

---

## ✅ **VERIFICAR SE FUNCIONOU**

### **Método 1: Via Admin Dashboard**
1. Acesse seu site e faça login como admin
2. Vá para `/admin/dashboard`
3. Role até a seção **"Storage Diagnostics"**
4. Todos os checks devem estar ✅ **verdes**

### **Método 2: Testar Upload**
1. Faça login como um usuário normal
2. Vá para Dashboard → Clique em "Tax Year 2025"
3. Tente fazer upload de um arquivo PDF
4. Deve funcionar sem erros! 🎉

---

## 🐛 **SE DER ERRO:**

### **Erro: "policy already exists"**
**Causa:** A policy já foi criada antes  
**Solução:** Tudo bem! Ignore este erro. A policy já existe.

### **Erro: "permission denied"**
**Causa:** Você não tem permissão de admin no Supabase  
**Solução:** Use a conta de owner/admin do projeto Supabase

### **Erro: "bucket not found"**
**Causa:** O bucket ainda não foi criado  
**Solução:** 
1. Reinicie o servidor backend (ele cria os buckets automaticamente)
2. OU crie manualmente: Storage → "New bucket" → Nome: `tax-documents-c2a25be0` (marque como Private)

---

## 📞 **PRECISA DE AJUDA?**

Se algo não funcionar:
1. ✅ Verifique se você executou o SQL completo
2. ✅ Verifique se está no projeto correto do Supabase
3. ✅ Teste o upload novamente
4. ✅ Veja o Storage Diagnostics no Admin Dashboard

---

## 🎉 **PRONTO!**

Depois de executar o script SQL, seu sistema de upload de documentos estará **100% funcional**!

**Tempo estimado:** 2 minutos ⏱️

**Dificuldade:** ⭐ Fácil (só copiar e colar o SQL)
