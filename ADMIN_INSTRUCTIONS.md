# 🔐 ADMIN ACCESS INSTRUCTIONS

## 📧 Como Adicionar/Remover Administradores

### **Apenas 3 pessoas podem acessar o painel administrativo.**

---

## 📝 **PASSO A PASSO:**

### **1. Adicionar um Novo Admin:**

1. Abra o arquivo: `/src/app/config/admins.ts`
2. Adicione o email na lista `ADMIN_EMAILS`:

```typescript
export const ADMIN_EMAILS = [
  'veprass@gmail.com',      // ← Email 1
  'germana.canada@gmail.com',      // ← Email 2  
  'duoproservices.info@gmail.com',       // ← Email 3
];
```

3. **IMPORTANTE:** Use emails em **MINÚSCULAS**
4. Salve o arquivo
5. Pronto! O usuário com esse email agora é admin

---

### **2. Remover um Admin:**

1. Abra o arquivo: `/src/app/config/admins.ts`
2. **Delete** a linha com o email
3. Salve o arquivo
4. Pronto! O usuário perdeu acesso admin

---

### **3. Alterar Limite de Admins:**

Se quiser mais de 3 admins:
- Basta adicionar mais linhas na lista `ADMIN_EMAILS`
- Não há limite técnico

---

## 🚀 **Como Acessar o Painel Admin:**

### **Usuários Admin veem:**
- ✅ Botão "Admin Panel" no dashboard
- ✅ Pode acessar `/admin`
- ✅ Pode ver todos os clientes
- ✅ Pode ver documentos de todos
- ✅ Pode atualizar status dos tax filings

### **Usuários Normais:**
- ❌ NÃO veem botão "Admin Panel"
- ❌ Se tentarem acessar `/admin`, são redirecionados
- ✅ Veem apenas seu próprio dashboard

---

## 🔧 **Arquivos que Controlam Admin:**

### **Frontend:**
- `/src/app/config/admins.ts` - Lista de emails admin
- `/src/app/pages/AdminClientsPage.tsx` - Página de lista de clientes
- `/src/app/pages/AdminClientDetailPage.tsx` - Detalhes do cliente
- `/src/app/pages/SimpleDashboardPage.tsx` - Mostra/esconde botão admin

### **Backend:**
- `/supabase/functions/server/index.tsx` - Valida se usuário é admin

---

## ⚠️ **IMPORTANTE:**

1. **Sempre use emails em minúsculas** na lista
2. **NÃO adicione espaços** antes/depois dos emails
3. **NÃO esqueça as vírgulas** entre os emails
4. O backend também valida os emails (proteção dupla)
5. Se um admin tentar acessar com email diferente, recebe erro 403

---

## 📧 **Emails Admin Atuais:**

Atualmente configurados:
1. `admin@duoproservices.com`
2. `maria@duoproservices.com`
3. `joao@duoproservices.com`

**ATUALIZE ESTES EMAILS COM OS REAIS DA SUA EQUIPE!**

---

## 🧪 **Testar Acesso Admin:**

1. Faça cadastro com um dos emails da lista
2. Faça login
3. Você deve ver o botão "Admin Panel"
4. Click para acessar `/admin`
5. Veja todos os clientes!

---

Qualquer dúvida, consulte este arquivo! 💙
