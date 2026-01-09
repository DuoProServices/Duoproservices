# 🪣 **COMO CRIAR O BUCKET NO SUPABASE**

---

## ❌ **O PROBLEMA:**
Você criou as **POLICIES** (permissões) mas NÃO criou o **BUCKET** (container de arquivos).

**É como:**
- ✅ Criar as regras de quem pode entrar na casa
- ❌ Mas a casa ainda não existe!

---

## ✅ **SOLUÇÃO: CRIAR O BUCKET PRIMEIRO**

### **📍 PASSO 1: Abrir Supabase Storage**

1. Vá para: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp
2. Clique em **"Storage"** no menu lateral esquerdo
3. Você verá uma tela com lista de buckets

---

### **📍 PASSO 2: Criar o Bucket**

1. Clique no botão **"+ New bucket"** (canto superior direito)

2. **Preencha o formulário:**
   ```
   Name: make-c2a25be0-documents
   Public bucket: ❌ NÃO marque (deixe PRIVADO)
   ```

3. **IMPORTANTE:**
   - ✅ Nome EXATO: `make-c2a25be0-documents`
   - ❌ NÃO marque como público
   - ✅ Deixe privado (para termos controle total)

4. Clique em **"Create bucket"**

---

### **📍 PASSO 3: Verificar se Criou**

Depois de criar, você deve ver na lista:

```
✅ make-c2a25be0-documents
   - Status: Private
   - Criado agora
```

---

## 🔒 **AS POLICIES JÁ ESTÃO CRIADAS?**

Se você já executou o SQL com as 6 policies, ótimo! Elas vão funcionar automaticamente assim que o bucket existir.

### **Para verificar as policies:**

1. No Supabase, vá em **"Storage"** → **"Policies"**
2. Procure por policies com nome contendo `make-c2a25be0`
3. Deve ter **6 policies**:
   - `Allow authenticated users to upload`
   - `Allow users to read own documents`
   - `Allow users to update own documents`
   - `Allow users to delete own documents`
   - `Allow admins to read all documents`
   - `Allow admins to delete all documents`

Se tiver as 6, está tudo certo! Só faltava o bucket mesmo.

---

## 🧪 **DEPOIS DE CRIAR O BUCKET:**

### **1. Volte para o app**
```
http://localhost:3000/client-portal
```

### **2. Faça login como cliente**

### **3. Teste o upload:**
- Vá em "Upload Documents"
- Tente fazer upload de um arquivo
- Deve funcionar! ✅

---

## 🆘 **SE AINDA NÃO FUNCIONAR:**

### **Cenário 1: Erro de permissão**
```
Verifique se as policies estão ativas:
Storage → Policies → Procure por "make-c2a25be0"
```

### **Cenário 2: Erro de autenticação**
```
Faça logout e login novamente
```

### **Cenário 3: Bucket com nome errado**
```
O nome DEVE ser exatamente:
make-c2a25be0-documents

Sem espaços, sem maiúsculas, exatamente assim!
```

---

## 📸 **COMO VERIFICAR SE ESTÁ CERTO:**

### **No Supabase Storage:**
```
Storage
└── make-c2a25be0-documents (Private) ← Deve aparecer assim
```

### **No Supabase Policies:**
```
Storage Policies
├── make-c2a25be0-documents: Allow authenticated users to upload
├── make-c2a25be0-documents: Allow users to read own documents
├── make-c2a25be0-documents: Allow users to update own documents
├── make-c2a25be0-documents: Allow users to delete own documents
├── make-c2a25be0-documents: Allow admins to read all documents
└── make-c2a25be0-documents: Allow admins to delete all documents
```

---

## 🎯 **RESUMO RÁPIDO:**

1. ✅ Abrir Supabase Storage
2. ✅ Clicar em "+ New bucket"
3. ✅ Nome: `make-c2a25be0-documents`
4. ✅ Deixar PRIVADO (não marcar public)
5. ✅ Criar
6. ✅ Voltar no app e testar upload

---

**Agora vai funcionar!** 🚀

Me avise se conseguiu criar o bucket! 😊
