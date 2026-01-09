# 📧 CONFIGURAR RESEND API KEY - PASSO A PASSO

## 🎯 O QUE É E POR QUE PRECISO?

A **RESEND_API_KEY** permite que seu site envie emails automáticos para:
- ✅ Notificar clientes sobre status da declaração
- ✅ Enviar confirmação de cadastro
- ✅ Alertar admin sobre novos uploads
- ✅ Mensagens entre admin e cliente

**Sem essa chave, o site funciona, mas NÃO envia emails!**

---

## ⚡ CONFIGURAÇÃO COMPLETA (10 MINUTOS)

### ETAPA 1: CRIAR CONTA NA RESEND (3 minutos)

1. **Acesse:** https://resend.com

2. **Clique em "Sign Up" (criar conta)**
   - Use seu email profissional (ou pessoal)
   - Crie uma senha forte

3. **Verifique seu email**
   - Abra o email de confirmação
   - Clique no link de verificação

4. **Faça login na Resend**

✅ **Pronto! Conta criada!**

**IMPORTANTE:** Plano gratuito = 3.000 emails/mês (mais que suficiente para começar!)

---

### ETAPA 2: OBTER A API KEY (2 minutos)

1. **No dashboard da Resend, procure por "API Keys"**
   - Fica no menu lateral esquerdo
   - Ou acesse diretamente: https://resend.com/api-keys

2. **Clique em "Create API Key"**

3. **Preencha:**
   - **Name:** `DuoPro Services Production` (ou o nome que quiser)
   - **Permission:** Selecione **"Sending access"** (enviar emails)
   - **Domain:** Deixe em branco por enquanto (ou use `duoproservices.netlify.app`)

4. **Clique em "Add"**

5. **⚠️ COPIE A CHAVE IMEDIATAMENTE!**
   ```
   Vai aparecer algo como:
   re_AbCd1234_xYz567890aBcDeFgHiJkLmNoPqRsTuV
   ```
   
   **ATENÇÃO:** Essa chave só aparece UMA VEZ!
   - Copie e cole em um local seguro (bloco de notas)
   - Se perder, terá que criar outra

✅ **API Key obtida! Guarde bem!**

---

### ETAPA 3: ADICIONAR NO SUPABASE (5 minutos)

Agora vamos configurar a chave no Supabase:

#### 3A. Acessar o Supabase Dashboard

1. **Acesse:** https://supabase.com/dashboard

2. **Faça login** com sua conta

3. **Selecione seu projeto:**
   - Procure pelo projeto do DuoPro Services
   - Provavelmente tem o ID: `akjqlobybuqenweavgjp`

#### 3B. Acessar Edge Functions Secrets

1. **No menu lateral esquerdo, procure:**
   ```
   Edge Functions → Secrets
   ```
   
   OU clique diretamente no ícone de "Edge Functions" e depois em "Secrets"

2. **Você verá uma tela com variáveis de ambiente**

#### 3C. Adicionar a RESEND_API_KEY

1. **Clique em "+ New Secret" (ou "Add new secret")**

2. **Preencha os campos:**
   ```
   Name:  RESEND_API_KEY
   Value: re_AbCd1234_xYz567890aBcDeFgHiJkLmNoPqRsTuV
   ```
   (Cole a chave que você copiou da Resend)

3. **Clique em "Save" ou "Add"**

4. **Verifique se apareceu na lista:**
   ```
   ✅ RESEND_API_KEY = re_••••••••••••••••
   ```

✅ **Configuração no Supabase concluída!**

---

## 🧪 TESTAR SE FUNCIONOU (OPCIONAL)

### Método 1: Teste rápido no site

1. Faça deploy do site (se ainda não fez)
2. Crie uma conta de teste
3. Faça upload de um documento
4. Verifique seu email - deve chegar uma notificação!

### Método 2: Ver logs do Supabase

1. Supabase Dashboard → Edge Functions → Logs
2. Procure por erros relacionados a "RESEND" ou "email"
3. Se estiver configurado, não deve ter erros!

---

## 📸 CAPTURAS DE TELA (Guia Visual)

### PASSO 1: Dashboard da Resend
```
┌─────────────────────────────────────────┐
│  RESEND                        [User]   │
├─────────────────────────────────────────┤
│  → Dashboard                            │
│  → API Keys  ← CLIQUE AQUI              │
│  → Domains                              │
│  → Emails                               │
└─────────────────────────────────────────┘
```

### PASSO 2: Criar API Key
```
┌──────────────────────────────────────────┐
│  Create API Key                          │
├──────────────────────────────────────────┤
│  Name: [DuoPro Services Production]     │
│                                          │
│  Permission:                             │
│  ● Sending access                        │
│  ○ Full access                           │
│                                          │
│  Domain: [duoproservices.netlify.app]   │
│                                          │
│           [Cancel]  [Create]             │
└──────────────────────────────────────────┘
```

### PASSO 3: Copiar a Chave
```
┌──────────────────────────────────────────┐
│  ⚠️  Save your API key now!              │
├──────────────────────────────────────────┤
│  This key will only be shown once.       │
│                                          │
│  re_AbCd1234_xYz567890aBcDeFgHi...      │
│                                          │
│           [Copy]  [Done]                 │
└──────────────────────────────────────────┘
```

### PASSO 4: Supabase - Edge Functions
```
┌──────────────────────────────────────────┐
│  SUPABASE                                │
├──────────────────────────────────────────┤
│  Project: DuoPro Services                │
│                                          │
│  → Database                              │
│  → Storage                               │
│  → Edge Functions  ← CLIQUE AQUI         │
│     └─ Secrets                           │
│  → SQL Editor                            │
└──────────────────────────────────────────┘
```

### PASSO 5: Adicionar Secret no Supabase
```
┌──────────────────────────────────────────┐
│  Edge Functions Secrets                  │
├──────────────────────────────────────────┤
│  Existing Secrets:                       │
│  • SUPABASE_URL                          │
│  • SUPABASE_ANON_KEY                     │
│  • SUPABASE_SERVICE_ROLE_KEY             │
│                                          │
│  [+ Add New Secret]  ← CLIQUE AQUI       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Add New Secret                          │
├──────────────────────────────────────────┤
│  Name:  [RESEND_API_KEY]                 │
│                                          │
│  Value: [re_AbCd1234_xYz...]             │
│                                          │
│           [Cancel]  [Save]               │
└──────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINAL

Marque conforme for completando:

- [ ] Criei conta na Resend (https://resend.com)
- [ ] Verifiquei meu email
- [ ] Criei API Key na Resend
- [ ] Copiei a chave (`re_...`)
- [ ] Acessei Supabase Dashboard
- [ ] Fui em Edge Functions → Secrets
- [ ] Adicionei `RESEND_API_KEY`
- [ ] Colei o valor da chave
- [ ] Salvei
- [ ] Verifiquei que apareceu na lista

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Não encontro Edge Functions no Supabase"

**Solução:**
1. Verifique se está no projeto correto
2. Menu pode estar no ícone de "⚡" ou "Functions"
3. Tente acessar direto: `https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/functions`

### ❌ "Perdi a API Key antes de copiar"

**Solução:**
1. Sem problema! Crie outra API Key
2. Resend → API Keys → Create new
3. Delete a antiga se quiser

### ❌ "Emails ainda não estão enviando"

**Possíveis causas:**
1. **API Key errada:** Verifique se copiou corretamente
2. **Nome errado:** Deve ser EXATAMENTE `RESEND_API_KEY` (maiúsculas)
3. **Espaços extras:** Certifique-se de não ter espaços antes/depois
4. **Aguarde 2-5 minutos:** Supabase pode demorar para atualizar

**Como testar:**
```bash
# Veja os logs do Edge Function
1. Supabase → Edge Functions → Logs
2. Procure por erros de "RESEND" ou "email"
```

### ❌ "Resend está pedindo para verificar domínio"

**Solução:**
- **Para testes:** Ignore por enquanto, use email padrão da Resend
- **Para produção:** Configure domínio próprio depois

**No plano gratuito:**
- Você pode enviar emails SEM verificar domínio
- Mas os emails vão vir de `onboarding@resend.dev`
- Para usar `@duoproservices.ca`, precisa verificar domínio (depois!)

---

## 🎯 PRÓXIMOS PASSOS

Depois de configurar a RESEND_API_KEY:

1. ✅ **Fazer deploy do site** (veja `DEPLOY_AGORA_SIMPLES.md`)
2. ✅ **Testar envio de emails** (criar conta de teste)
3. ✅ **Configurar domínio próprio** (opcional, mas recomendado)
4. ✅ **Verificar domínio na Resend** (para emails profissionais)

---

## 📚 LINKS ÚTEIS

- **Resend Dashboard:** https://resend.com/overview
- **Resend Docs:** https://resend.com/docs/introduction
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Guia de Deploy:** `DEPLOY_AGORA_SIMPLES.md`

---

## 💡 DICA PROFISSIONAL

### Depois que o site estiver no ar:

1. **Configure domínio próprio na Resend**
   - Resend → Domains → Add Domain
   - Adicione `duoproservices.ca` (quando tiver)
   - Configure DNS records
   - Emails virão de `contact@duoproservices.ca` 🎉

2. **Monitore uso de emails**
   - Resend → Usage
   - Limite gratuito: 3.000/mês
   - Se precisar mais, upgrade é barato ($20/mês = 50.000 emails)

---

## ✨ RESUMO ULTRA RÁPIDO

```bash
1. Acesse: https://resend.com
2. Criar conta → Verificar email
3. API Keys → Create → Copiar chave (re_...)
4. Supabase → Edge Functions → Secrets
5. Add new: RESEND_API_KEY = re_...
6. Save
7. ✅ PRONTO!
```

---

**Tempo total:** 10 minutos  
**Dificuldade:** ⭐☆☆☆☆ (Muito fácil!)  
**Custo:** 💰 Gratuito (3.000 emails/mês)

🎉 **Boa configuração!**
