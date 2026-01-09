-- ============================================================
-- 🔥 POLÍTICAS RLS SUPER SIMPLES - GARANTIDO PARA FUNCIONAR
-- ============================================================
-- Copie este SQL COMPLETO e execute no Supabase SQL Editor
-- ============================================================

-- PASSO 1: Limpar todas as policies antigas
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete client documents" ON storage.objects;

-- PASSO 2: Criar policies para BUCKET 1 (tax-documents-c2a25be0)
-- Estas policies permitem que QUALQUER usuário autenticado faça tudo

CREATE POLICY "tax_documents_insert" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'tax-documents-c2a25be0');

CREATE POLICY "tax_documents_select" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'tax-documents-c2a25be0');

CREATE POLICY "tax_documents_update" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'tax-documents-c2a25be0')
WITH CHECK (bucket_id = 'tax-documents-c2a25be0');

CREATE POLICY "tax_documents_delete" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'tax-documents-c2a25be0');

-- PASSO 3: Criar policies para BUCKET 2 (make-c2a25be0-client-documents)
-- Estas policies permitem que QUALQUER usuário autenticado faça tudo

CREATE POLICY "client_documents_insert" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');

CREATE POLICY "client_documents_select" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'make-c2a25be0-client-documents');

CREATE POLICY "client_documents_update" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'make-c2a25be0-client-documents')
WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');

CREATE POLICY "client_documents_delete" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'make-c2a25be0-client-documents');

-- ============================================================
-- ✅ PRONTO! Você deve ver: "Success. No rows returned"
-- ============================================================
-- Agora volte para o app e teste o upload!
-- ============================================================
