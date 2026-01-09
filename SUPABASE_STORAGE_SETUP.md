# 🔐 Configuração do Supabase Storage - RLS Policies

## ⚠️ IMPORTANTE: Configuração Obrigatória para Upload de Documentos

Para que o sistema de upload de documentos funcione corretamente, você **PRECISA** configurar as **RLS (Row Level Security) Policies** no Supabase Storage.

---

## 📋 Passo a Passo

### 1️⃣ **Acessar o Supabase Dashboard**
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **Storage**
4. Clique em **Policies** (ou acesse diretamente a aba de políticas de cada bucket)

---

### 2️⃣ **Configurar Policies para o Bucket `tax-documents-c2a25be0`**

Este bucket armazena os documentos fiscais dos clientes organizados por ano.

#### **Policy 1: Allow authenticated uploads (INSERT)**
```sql
Policy name: Allow authenticated uploads
Target roles: authenticated
Policy command: INSERT
WITH CHECK expression: true
```

#### **Policy 2: Allow authenticated reads (SELECT)**
```sql
Policy name: Allow authenticated reads
Target roles: authenticated
Policy command: SELECT
USING expression: true
```

#### **Policy 3: Allow authenticated updates (UPDATE)**
```sql
Policy name: Allow authenticated updates
Target roles: authenticated
Policy command: UPDATE
USING expression: true
```

#### **Policy 4: Allow authenticated deletes (DELETE)**
```sql
Policy name: Allow authenticated deletes
Target roles: authenticated
Policy command: DELETE
USING expression: true
```

---

### 3️⃣ **Configurar Policies para o Bucket `make-c2a25be0-client-documents`**

Este bucket armazena documentos gerais dos clientes.

Repita as **mesmas 4 policies** acima para este bucket também.

---

## 🎯 Como Criar uma Policy no Supabase

### Via Interface (Dashboard):
1. Vá em **Storage** > Selecione o bucket
2. Clique na aba **Policies**
3. Clique em **New Policy**
4. Escolha **For full customization**
5. Preencha:
   - **Policy name**: Nome da policy (ex: "Allow authenticated uploads")
   - **Policy command**: Selecione a operação (INSERT, SELECT, UPDATE ou DELETE)
   - **Target roles**: Selecione `authenticated`
   - **USING expression** (para SELECT, UPDATE, DELETE): `true`
   - **WITH CHECK expression** (para INSERT, UPDATE): `true`
6. Clique em **Review** e depois em **Save policy**

### Via SQL Editor (Avançado):
Se preferir, você pode executar SQL diretamente:

```sql
-- Bucket: tax-documents-c2a25be0

-- Policy 1: INSERT
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tax-documents-c2a25be0');

-- Policy 2: SELECT
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

-- Policy 3: UPDATE
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

-- Policy 4: DELETE
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tax-documents-c2a25be0');

-- Bucket: make-c2a25be0-client-documents

-- Policy 1: INSERT
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 2: SELECT
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 3: UPDATE
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');

-- Policy 4: DELETE
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'make-c2a25be0-client-documents');
```

---

## ✅ Verificação

Após configurar as policies, teste o upload:

1. Faça login como um usuário
2. Vá para **Dashboard** > Clique em um ano (ex: Tax Year 2025)
3. Tente fazer upload de um documento PDF
4. Se aparecer erro, verifique:
   - ✅ As 4 policies estão criadas para cada bucket?
   - ✅ O bucket `tax-documents-c2a25be0` existe?
   - ✅ Você está logado (token de autenticação válido)?

---

## 🐛 Troubleshooting

### Erro: "new row violates row-level security policy"
**Solução**: As policies não foram criadas ou estão incorretas. Verifique se todas as 4 policies (INSERT, SELECT, UPDATE, DELETE) estão ativas.

### Erro: "Bucket not found"
**Solução**: O bucket não foi criado. Execute o servidor backend para criar automaticamente ou crie manualmente no Dashboard.

### Erro: "Failed to upload"
**Solução**: 
1. Verifique o console do navegador (F12) para ver o erro exato
2. Confirme que o arquivo é menor que 10MB
3. Confirme que o formato é PDF, JPG ou PNG

---

## 📂 Estrutura de Pastas no Storage

```
tax-documents-c2a25be0/
├── {userId}/
│   ├── 2025/
│   │   ├── t4-slips/
│   │   │   └── 1234567890_T4_2025.pdf
│   │   ├── t5-slips/
│   │   │   └── 1234567891_T5_2025.pdf
│   │   └── receipts/
│   │       └── 1234567892_receipt.pdf
│   └── 2026/
│       └── ...
```

Cada usuário tem sua própria pasta identificada pelo `userId`, organizada por ano e categoria de documento.

---

## 🎉 Pronto!

Após configurar as RLS Policies, o sistema de upload de documentos estará 100% funcional!

Se tiver dúvidas, consulte a documentação oficial do Supabase:
👉 https://supabase.com/docs/guides/storage/security/access-control
