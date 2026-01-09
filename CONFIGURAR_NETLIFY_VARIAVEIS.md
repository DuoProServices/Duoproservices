# ⚙️ CONFIGURAR VARIÁVEIS NO NETLIFY - PASSO A PASSO

## 🎯 VOCÊ ESTÁ AQUI: Site deployado, mas falta configurar!

**Seu site:** https://spectacular-scone-c849ea.netlify.app

**Problema:** Login não funciona ainda (precisa das variáveis)

**Tempo:** 5 minutos

---

## 📋 PASSO A PASSO SUPER DETALHADO

### PASSO 1: Procure o menu lateral ESQUERDO

Na tela que você está (Netlify), olhe para o **lado esquerdo**.

Você verá um menu com várias opções:

```
┌─────────────────────────────┐
│ Overview                    │
│ Deploys                     │
│ Site configuration          │ ← PROCURE POR ESTA!
│ Domain management           │
│ Integrations                │
│ ...                         │
└─────────────────────────────┘
```

**👉 CLIQUE em "Site configuration"**

---

### PASSO 2: Procure "Environment variables"

Depois de clicar em "Site configuration", você vai ver OUTRO menu se abrir.

Procure por uma opção chamada:
- **"Environment variables"** ou
- **"Variables de ambiente"**

**👉 CLIQUE em "Environment variables"**

---

### PASSO 3: Adicionar variáveis

Você vai ver uma tela com um botão que diz:
- **"Add a variable"** ou
- **"Add environment variables"** ou
- **"+ Add variables"**

**👉 CLIQUE neste botão**

---

### PASSO 4: Preencher PRIMEIRA variável

Vai abrir um formulário com 2 campos:

```
┌──────────────────────────────────────────┐
│ Add environment variable                 │
├──────────────────────────────────────────┤
│                                          │
│ Key (or Name):                           │
│ [                                    ]   │
│                                          │
│ Value (or Valor):                        │
│ [                                    ]   │
│                                          │
│        [Cancel]  [Add variable]          │
└──────────────────────────────────────────┘
```

**👉 NO CAMPO "Key" (ou "Name"), COPIE E COLE:**
```
VITE_SUPABASE_URL
```

**👉 NO CAMPO "Value" (ou "Valor"), COPIE E COLE:**
```
https://pwlacumydrxvshklvttp.supabase.co
```

**👉 CLIQUE em "Add variable" ou "Save"**

---

### PASSO 5: Adicionar SEGUNDA variável

Agora você vai repetir o processo para a segunda variável.

**👉 CLIQUE novamente em "Add a variable"** (ou "+ Add variables")

**👉 NO CAMPO "Key", COPIE E COLE:**
```
VITE_SUPABASE_ANON_KEY
```

**👉 NO CAMPO "Value", COPIE E COLE:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bGFjdW15ZHJ4dnNoa2x2dHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjM3MTQsImV4cCI6MjA4MTczOTcxNH0.uj1rVapx5bBzp6YVFbcOwxCDZftpLzjwfMJ4aCy_B_A
```

**👉 CLIQUE em "Add variable" ou "Save"**

---

### PASSO 6: Verificar se as variáveis foram adicionadas

Você deve ver agora uma lista com 2 variáveis:

```
Environment variables
┌─────────────────────────────────────────┐
│ VITE_SUPABASE_URL                       │
│ Value: https://pwlacumydrxv...          │
├─────────────────────────────────────────┤
│ VITE_SUPABASE_ANON_KEY                  │
│ Value: eyJhbGciOiJIUzI1N...             │
└─────────────────────────────────────────┘
```

✅ **Se você vê as 2 variáveis = PERFEITO!**

---

### PASSO 7: Fazer novo deploy (CRÍTICO!)

Agora você precisa fazer um **novo deploy** para que as variáveis sejam aplicadas.

**👉 NO MENU LATERAL ESQUERDO, CLIQUE em "Deploys"**

**👉 PROCURE um botão chamado:**
- **"Trigger deploy"** ou
- **"Deploy site"** ou
- **"Redeploy"**

**👉 CLIQUE neste botão**

Vai aparecer um menu:
```
┌─────────────────────────────┐
│ Deploy site                 │ ← CLIQUE AQUI
│ Clear cache and deploy      │
│ ...                         │
└─────────────────────────────┘
```

**👉 CLIQUE em "Deploy site"**

---

### PASSO 8: Aguardar o deploy

Você vai ver uma barra de progresso ou um log de deploy.

**⏳ AGUARDE 1-2 MINUTOS**

Quando terminar, vai aparecer:
```
✅ Published
```

✅ **PRONTO! TUDO CONFIGURADO!**

---

## 🧪 TESTAR SE FUNCIONOU

1. **Abra seu site:** https://spectacular-scone-c849ea.netlify.app

2. **Pressione Ctrl + Shift + R** (para limpar cache)

3. **Clique em "Sign Up"** ou **"Login"**

4. **Tente criar uma conta de teste:**
   - Email: teste@teste.com
   - Senha: Teste123!
   - Nome: Teste

5. **Se funcionar = SUCESSO!** 🎉

---

## ✅ RESUMO DO QUE VOCÊ PRECISA FAZER:

1. ⚙️ Site configuration
2. 🔐 Environment variables
3. ➕ Add a variable
4. 📝 VITE_SUPABASE_URL = https://pwlacumydrxvshklvttp.supabase.co
5. ➕ Add a variable (de novo)
6. 📝 VITE_SUPABASE_ANON_KEY = eyJhbGc...
7. 🚀 Deploys → Trigger deploy → Deploy site
8. ⏳ Aguardar 1-2 minutos
9. ✅ Testar o site!

---

## 🆘 SE NÃO ENCONTRAR ALGUM BOTÃO:

### "Não encontro Site configuration"
- Procure por "Settings" ou "Configurações"
- Ou procure um ícone de engrenagem ⚙️

### "Não encontro Environment variables"
- Pode estar dentro de "Build & deploy"
- Ou em "Site settings"
- Procure por qualquer coisa relacionada a "variables", "env", ou "environment"

### "Não encontro Trigger deploy"
- Na aba "Deploys", role para baixo
- Procure qualquer botão que diga "Deploy" ou "Redeploy"
- Ou procure por um botão verde/azul no topo da página

---

## 🎯 VALORES PARA COPIAR E COLAR:

### Variável 1:
**Nome/Key:**
```
VITE_SUPABASE_URL
```

**Valor/Value:**
```
https://pwlacumydrxvshklvttp.supabase.co
```

---

### Variável 2:
**Nome/Key:**
```
VITE_SUPABASE_ANON_KEY
```

**Valor/Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bGFjdW15ZHJ4dnNoa2x2dHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjM3MTQsImV4cCI6MjA4MTczOTcxNH0.uj1rVapx5bBzp6YVFbcOwxCDZftpLzjwfMJ4aCy_B_A
```

---

## 💡 DICA:

Use **Ctrl+C** para copiar e **Ctrl+V** para colar!

Não digite manualmente - pode dar erro de digitação!

---

**VOCÊ CONSEGUE!** 🚀

É só seguir passo a passo. Eu sei que parece muita coisa, mas é bem simples quando você faz!

Me avisa em qual passo você está ou se travou em alguma parte! 🙂
