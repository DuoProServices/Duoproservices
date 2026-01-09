# 🔄 GUIA: Usando reset-account.html

## 🎯 O QUE VOCÊ VAI FAZER:

Esta ferramenta vai te ajudar a **deletar e recriar** a conta veprass@gmail.com com uma senha nova.

---

## 📋 PASSO A PASSO VISUAL:

### **1️⃣ ABRIR A FERRAMENTA**

No navegador, acesse:

**Local (desenvolvimento):**
```
http://localhost:5173/reset-account.html
```

**OU online (se já publicou):**
```
https://seu-site.netlify.app/reset-account.html
```

---

### **2️⃣ O QUE VOCÊ VAI VER:**

```
┌─────────────────────────────────────────────┐
│  🔄 Reset/Recreate Account                  │
├─────────────────────────────────────────────┤
│                                             │
│  ⚠️ WARNING: This will permanently delete   │
│  your account...                            │
│                                             │
│  Your Email Address:                        │
│  [veprass@gmail.com            ]            │
│                                             │
│  New Password (min 6 characters):           │
│  [••••••••••••                 ]            │
│                                             │
│  Confirm New Password:                      │
│  [••••••••••••                 ]            │
│                                             │
│  Your Full Name:                            │
│  [                             ]            │
│                                             │
│  [ 🗑️ Delete & Recreate Account ]          │
│                                             │
└─────────────────────────────────────────────┘
```

---

### **3️⃣ PREENCHER OS CAMPOS:**

| Campo | O que colocar | Exemplo |
|-------|---------------|---------|
| **Email** | Já vem preenchido | veprass@gmail.com |
| **New Password** | Escolha uma senha forte | `MinhaSenh@123` |
| **Confirm Password** | Repita a senha | `MinhaSenh@123` |
| **Full Name** | Seu nome completo | `João Silva` |

⚠️ **IMPORTANTE:** Anote a senha em algum lugar seguro!

---

### **4️⃣ CLICAR NO BOTÃO**

Clique em: **🗑️ Delete & Recreate Account**

---

### **5️⃣ CENÁRIOS POSSÍVEIS:**

#### ✅ **Cenário A: Backend está DOWN**

```
┌─────────────────────────────────────────────┐
│ ❌ BACKEND NOT RESPONDING                   │
│                                             │
│ Error: Failed to fetch                      │
│                                             │
│ The backend Edge Function is not deployed.  │
│ Please follow the steps in DEPLOY_RAPIDO.md│
└─────────────────────────────────────────────┘
```

**O que fazer:**
1. Feche esta janela
2. Abra `DEPLOY_RAPIDO.md`
3. Siga os 6 passos para deploy do backend
4. Volte aqui e tente novamente

---

#### ⚠️ **Cenário B: Conta JÁ EXISTE** (mais comum)

```
┌─────────────────────────────────────────────┐
│ ⚠️ ACCOUNT EXISTS                           │
│                                             │
│ The email veprass@gmail.com is already      │
│ registered in the system.                   │
│                                             │
│ 📋 TO DELETE IT:                            │
│ 1. Go to: Supabase Dashboard - Users       │
│ 2. Find the user: veprass@gmail.com        │
│ 3. Click the 3 dots (⋮) → Delete user      │
│ 4. Confirm deletion                         │
│ 5. Come back here and click the button again│
│                                             │
│ OR: Try logging in with your existing       │
│ password                                    │
└─────────────────────────────────────────────┘
```

**O que fazer:**

**Passo 1:** Abrir Supabase Dashboard
```
https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/auth/users
```

**Passo 2:** Procurar o usuário `veprass@gmail.com`

**Passo 3:** Clicar nos **3 pontinhos (⋮)** ao lado do email

**Passo 4:** Clicar em **"Delete user"**

**Passo 5:** Confirmar a deleção

**Passo 6:** Voltar para `/reset-account.html`

**Passo 7:** Clicar novamente em **"Delete & Recreate Account"**

---

#### ✅ **Cenário C: SUCESSO!**

```
┌─────────────────────────────────────────────┐
│ ✅ SUCCESS!                                 │
│                                             │
│ Your account has been created with:         │
│ 📧 Email: veprass@gmail.com                 │
│ 👤 Name: João Silva                         │
│                                             │
│ You can now login here with your new        │
│ password!                                   │
└─────────────────────────────────────────────┘
```

**O que fazer:**
1. 🎉 **Parabéns!** A conta foi criada!
2. Vá para: `http://localhost:5173/login`
3. Use:
   - Email: `veprass@gmail.com`
   - Senha: A que você acabou de criar
4. Clique em **Sign In**
5. ✅ **Você está dentro do Dashboard!**

---

## 🎯 EXEMPLO COMPLETO:

### **Preenchimento:**
```
Email: veprass@gmail.com
Senha: MinhaSenha123
Confirmar: MinhaSenha123
Nome: João Silva
```

### **Resultado esperado:**
1. Clica no botão
2. Aparece: "Conta já existe"
3. Vai no Dashboard do Supabase
4. Deleta o usuário veprass@gmail.com
5. Volta e clica novamente
6. Aparece: "SUCCESS!"
7. Vai para /login
8. Loga com sucesso
9. ✅ Dashboard funcionando!

---

## 🆘 PROBLEMAS COMUNS:

### ❌ **"Please fill all fields"**
**Solução:** Preencha todos os 4 campos

### ❌ **"Password must be at least 6 characters"**
**Solução:** Use uma senha com 6+ caracteres

### ❌ **"Passwords do not match"**
**Solução:** As duas senhas devem ser idênticas

### ❌ **"Failed to fetch"**
**Solução:** Backend não está deployado. Siga `DEPLOY_RAPIDO.md`

### ⚠️ **"Account exists"**
**Solução:** Normal! Siga as instruções na tela para deletar no Dashboard

---

## 📸 VISUAL DO PROCESSO:

```
VOCÊ
  ↓
[reset-account.html]
  ↓
Preenche formulário
  ↓
Clica botão
  ↓
┌─────────────────────┐
│ Conta já existe?    │
└─────────────────────┘
  ↓ SIM              ↓ NÃO
  ↓                  ↓
Vai no Dashboard   ✅ SUCESSO!
  ↓                  ↓
Deleta usuário     Vai para /login
  ↓                  ↓
Volta e tenta      Faz login
novamente            ↓
  ↓                ✅ DASHBOARD!
✅ SUCESSO!
  ↓
Vai para /login
  ↓
✅ DASHBOARD!
```

---

## ✅ CHECKLIST:

Antes de começar:
- [ ] Navegador aberto
- [ ] Acesso ao Supabase Dashboard (caso precise deletar)
- [ ] Senha nova escolhida e anotada
- [ ] Pronto para seguir as instruções

---

## 🎉 PRONTO PARA COMEÇAR?

**Acesse agora:**
```
http://localhost:5173/reset-account.html
```

**E siga este guia passo a passo!**

**Me diga quando abrir e o que apareceu na tela!** 👈
