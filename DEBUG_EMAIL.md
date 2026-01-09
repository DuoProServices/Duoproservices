# 🔍 Debug - Email veprass@gmail.com

## Como verificar se há problema com o email

### Opção 1: Testar no Console do Navegador

1. Abra seu site
2. Pressione **F12** para abrir o Console
3. Cole e execute este código:

```javascript
// Teste de criação de conta
async function testarEmail() {
  const projectId = "pwlacumydrxvshklvttp";
  const email = "veprass@gmail.com";
  const password = "teste123456";
  const name = "Teste Usuario";
  
  console.log("🔍 Testando criação de conta para:", email);
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bGFjdW15ZHJ4dnNoa2x2dHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjM3MTQsImV4cCI6MjA4MTczOTcxNH0.uj1rVapx5bBzp6YVFbcOwxCDZftpLzjwfMJ4aCy_B_A`
        },
        body: JSON.stringify({ email, password, name })
      }
    );
    
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Sucesso:", data);
    } else {
      console.error("❌ Erro:", data);
    }
    
    return data;
  } catch (error) {
    console.error("❌ Erro de rede:", error);
    return { error: error.message };
  }
}

// Executar teste
testarEmail();
```

---

## Possíveis Erros e Soluções

### ❌ Erro: "Failed to fetch"
**Causa**: Backend não está deployado
**Solução**: Siga o arquivo `DEPLOY_RAPIDO.md`

### ❌ Erro: "User already registered"
**Causa**: Email já está cadastrado no sistema
**Solução**: 
- Use outro email, OU
- Faça login com a senha existente, OU
- Delete a conta via Supabase Dashboard

### ❌ Erro: "Invalid email"
**Causa**: Formato de email inválido
**Solução**: Verifique se o email está correto

### ❌ Erro: "Password should be at least 6 characters"
**Causa**: Senha muito curta
**Solução**: Use uma senha com no mínimo 6 caracteres

---

## Verificar via Supabase Dashboard

### 1. Ver se o email já existe

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/auth/users
2. Procure por: `veprass@gmail.com`
3. Se encontrar, a conta já existe

### 2. Ver logs de erro

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/logs/edge-functions
2. Filtre por: `make-server-c2a25be0`
3. Veja os erros relacionados ao signup

---

## Deletar conta existente (se necessário)

Se a conta existe e você quer recriá-la:

### Via Dashboard (FÁCIL)

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/auth/users
2. Encontre o usuário `veprass@gmail.com`
3. Clique nos **3 pontinhos** → **Delete user**

### Via SQL (AVANÇADO)

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/sql/new
2. Cole e execute:

```sql
-- Ver se o usuário existe
SELECT id, email, created_at FROM auth.users WHERE email = 'veprass@gmail.com';

-- Deletar o usuário (CUIDADO!)
-- DELETE FROM auth.users WHERE email = 'veprass@gmail.com';
```

---

## O que me dizer após testar

Por favor, execute o código JavaScript acima no console e me diga:

1. ✅ **Qual erro apareceu?** (ex: "Failed to fetch", "User already exists", etc.)
2. 📋 **O que aparece nos logs?** (copie e cole aqui)
3. 🔍 **O usuário já existe no Dashboard?** (sim/não)

Com essas informações, posso te ajudar melhor! 🚀
