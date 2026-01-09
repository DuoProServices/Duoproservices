# ✅ ERRO DE UPLOAD DE DOCUMENTOS - CORRIGIDO!

## 📝 **O QUE FOI CORRIGIDO:**

### **1. ✅ Import do API_ENDPOINTS** 
```typescript
// Adicionado:
import { API_ENDPOINTS } from "../../config/api";
```

### **2. ✅ URL de Upload Atualizada**
```typescript
// ANTES (URL antiga fixa):
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/documents/upload`,
  //...
);

// DEPOIS (usando configuração centralizada):
const response = await fetch(
  API_ENDPOINTS.documentsUpload,  // ✅ Usa projeto correto automaticamente
  //...
);
```

### **3. ✅ Variáveis de Estado Faltando**
```typescript
// Adicionado:
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [category, setCategory] = useState("");
const [description, setDescription] = useState("");
```

---

## 🔄 **UPLOAD DE DOCUMENTOS - COMO FUNCIONA:**

### **Método 1: Upload Direto por Categoria** (handleCategoryUpload)
- ✅ Upload direto para Supabase Storage
- ✅ Salva metadata no user_metadata do Supabase Auth
- ✅ Este método ESTÁ FUNCIONANDO

### **Método 2: Upload via Formulário** (handleUpload) 
- ⚠️ Usa backend Edge Function
- ⚠️ Requer que o backend esteja deployado
- ⚠️ URL agora corrigida para usar `API_ENDPOINTS.documentsUpload`

---

## 🚨 **PRÓXIMOS PASSOS NECESSÁRIOS:**

### **1. FAZER DEPLOY DO BACKEND** (SE AINDA NÃO FEZ)

O upload de documentos vai falhar se o backend não estiver deployado!

**Windows:**
```powershell
.\deploy-agora.ps1
```

**Mac/Linux:**
```bash
./deploy-agora.sh
```

**Ou manualmente:**
```bash
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt
```

---

### **2. CRIAR BUCKETS NO SUPABASE**

Os documentos são salvos no bucket: `make-c2a25be0-client-documents`

**Como criar:**

1. **Faça login** no app como admin
2. **Vá para:** `/admin/dashboard`
3. **Clique no botão:** "🚀 CREATE STORAGE BUCKETS" (botão azul/índigo)
4. **Aguarde** a criação dos buckets
5. **Veja mensagem:** "✅ Buckets created successfully!"

---

### **3. CONFIGURAR RLS POLICIES**

Depois de criar os buckets, configure as policies:

1. **No Admin Dashboard**, clique em: "✨ MAGIC AUTO-SETUP" (botão verde/esmeralda)
2. **Copie o script** SQL que aparece
3. **Abra:** https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/sql/new
4. **Cole o script** completo
5. **Clique:** "RUN" (botão azul)
6. **Aguarde:** Mensagem de sucesso
7. **Recarregue** o app (F5)

---

## 🧪 **TESTE O UPLOAD:**

### **Passo a Passo:**

1. **Faça login** como usuário (não admin)
2. **Complete o onboarding** (se ainda não completou)
3. **Vá para:** `/dashboard`
4. **Clique na aba:** "Upload Documents"
5. **Escolha uma categoria** (ex: T4)
6. **Clique em:** "Upload File"
7. **Selecione um arquivo** (PDF, JPG, PNG)
8. **Aguarde** upload completar
9. **Veja mensagem:** "✅ [Categoria] uploaded successfully!"

---

## 🔍 **SE O UPLOAD FALHAR:**

### **Erro: "Failed to fetch"**
**Causa:** Backend não deployado  
**Solução:** Fazer deploy do backend (veja passo 1)

### **Erro: "Upload failed: new row violates row-level security policy"**
**Causa:** RLS policies não configuradas  
**Solução:** Executar script SQL (veja passo 3)

### **Erro: "Bucket not found"**
**Causa:** Buckets não criados  
**Solução:** Criar buckets (veja passo 2)

### **Erro: "No access token"**
**Causa:** Usuário não autenticado  
**Solução:** Fazer logout e login novamente

---

## 📊 **CHECKLIST COMPLETO:**

### **Código:**
- [x] ✅ Import do API_ENDPOINTS adicionado
- [x] ✅ URL de upload corrigida
- [x] ✅ Variáveis de estado adicionadas

### **Infraestrutura (VOCÊ PRECISA FAZER):**
- [ ] **Deploy do backend** (executar script)
- [ ] **Criar buckets** (botão no Admin Dashboard)
- [ ] **Configurar RLS policies** (executar script SQL)

### **Teste:**
- [ ] **Login no app**
- [ ] **Complete onboarding**
- [ ] **Teste upload de documento**
- [ ] **Veja documento na lista**

---

## 🎯 **ORDEM DE EXECUÇÃO:**

```
1. Deploy Backend (3 min)
   ↓
2. Criar Buckets (1 min)
   ↓
3. Configurar RLS (2 min)
   ↓
4. Testar Upload (1 min)
   ↓
5. ✅ FUNCIONANDO!
```

---

## 💡 **IMPORTANTE:**

### **Dois Métodos de Upload:**

**Método 1: `handleCategoryUpload`** (Upload Direto)
- ✅ Usa Supabase Storage diretamente
- ✅ Não precisa de backend
- ✅ Mais rápido e simples
- ⚠️ Precisa de RLS policies configuradas

**Método 2: `handleUpload`** (Via Backend)
- ⚠️ Usa Edge Function
- ⚠️ Precisa de backend deployado
- ⚠️ Mais complexo
- ✅ Permite validações extras no servidor

**RECOMENDAÇÃO:** Use o Método 1 (handleCategoryUpload) que é o padrão agora!

---

## 🚀 **FAÇA AGORA:**

### **1. Deploy:**
```bash
.\deploy-agora.ps1
```

### **2. Criar Buckets:**
- Login → `/admin/dashboard` → Botão "CREATE STORAGE BUCKETS"

### **3. RLS Policies:**
- Botão "MAGIC AUTO-SETUP" → Copiar script → Executar no Supabase SQL Editor

### **4. Testar:**
- Login como usuário → Upload documento

---

**⏱️ TEMPO TOTAL: 7 MINUTOS**

**Me diga quando terminar para eu verificar! 🚀**
