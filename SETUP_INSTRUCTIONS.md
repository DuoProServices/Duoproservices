# Instruções de Configuração do Supabase

## Políticas de Row-Level Security (RLS)

Para garantir que cada cliente acesse apenas seus próprios dados e documentos, você precisa configurar as políticas RLS no Supabase Dashboard.

### Configuração do Storage Bucket

1. Acesse o Supabase Dashboard
2. Navegue para Storage > Buckets
3. Encontre o bucket `make-c2a25be0-client-documents`
4. Clique em "New policy" para criar políticas de RLS

**Política de SELECT (Leitura):**
```sql
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'make-c2a25be0-client-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Política de INSERT (Upload):**
```sql
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'make-c2a25be0-client-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Política de DELETE (Exclusão):**
```sql
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'make-c2a25be0-client-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Configuração do Calendly

1. Acesse [calendly.com](https://calendly.com/)
2. Crie uma conta com o email: duoproservices-info@gmail.com
3. Configure seus horários disponíveis
4. O widget já está integrado na página com a URL: `https://calendly.com/duoproservices-info`

## Configuração do Formspree

1. Acesse [formspree.io](https://formspree.io/)
2. Crie uma conta ou faça login
3. Crie um novo formulário
4. Configure o endereço de email de destino: duoproservices.info@gmail.com
5. Copie o endpoint fornecido e atualize o arquivo `/src/app/components/Contact.tsx` na linha 26, substituindo:
   ```javascript
   const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
   ```
   
   Por:
   ```javascript
   const response = await fetch("https://formspree.io/f/duoproservices.info@gmail.com", {
   ```

## Estrutura de Dados no KV Store

O sistema utiliza o KV Store do Supabase para armazenar:

### Perfis de Usuário
- **Key**: `user:{userId}`
- **Value**: `{ id, email, name, createdAt }`

### Documentos do Usuário
- **Key**: `doc:{userId}:{timestamp}`
- **Value**: `{ id, userId, fileName, storagePath, category, description, uploadedAt, size, type, url }`

### Lista de Documentos do Usuário
- **Key**: `user:{userId}:documents`
- **Value**: `[documentId1, documentId2, ...]`

### Status da Timeline
- **Key**: `user:{userId}:timeline`
- **Value**: `{ step: 1-5, updatedAt }`

## Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Login e Cadastro totalmente funcionais
- Integração com Supabase Auth
- Redirecionamento automático para o Dashboard após login
- Sessões persistentes

### ✅ Portal do Cliente (Dashboard)
- Timeline visual de 5 etapas do processo fiscal
- Progresso salvo no banco de dados
- Interface limpa e profissional

### ✅ Gestão de Documentos
- Upload de arquivos (PDF, JPG, PNG)
- Armazenamento seguro no Supabase Storage
- Categorização de documentos (T4, T5, RRSP, etc.)
- Visualização e exclusão de documentos
- URLs assinadas para acesso seguro

### ✅ Integrações Externas
- **Calendly**: Widget integrado para agendamento
- **Formspree**: Formulário de contato funcional

### ✅ Segurança
- Row-Level Security (RLS) configurável
- Cada cliente acessa apenas seus próprios dados
- Autenticação obrigatória para rotas protegidas
- Tokens de acesso seguros

### ✅ Internacionalização
- Suporte completo para 3 idiomas (EN, FR, PT)
- Todas as páginas traduzidas incluindo Dashboard

## Rotas Disponíveis

- `/` - Página inicial pública
- `/login` - Página de login
- `/signup` - Página de cadastro
- `/dashboard` - Portal do cliente (protegido)

## Próximos Passos

1. Configure as políticas RLS no Supabase Dashboard
2. Crie e configure sua conta no Calendly
3. Configure o Formspree com seu email
4. Teste o fluxo completo:
   - Criar uma conta
   - Fazer login
   - Upload de documentos
   - Verificar timeline
   - Agendar consulta via Calendly
   - Enviar mensagem via formulário de contato
