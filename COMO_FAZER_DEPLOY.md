# 🚀 COMO FAZER O DEPLOY - GUIA RÁPIDO

## ✨ MÉTODO SUPER FÁCIL (Recomendado)

Escolha de acordo com seu sistema operacional:

### 🪟 **WINDOWS (PowerShell)**

1. **Abra o PowerShell** (clique com botão direito e escolha "Executar como Administrador")

2. **Cole este comando:**
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```

3. **Navegue até a pasta do projeto:**
   ```powershell
   cd C:\caminho\para\seu\projeto
   ```

4. **Execute o script:**
   ```powershell
   .\DEPLOY_SCRIPT.ps1
   ```

---

### 🍎 **MAC / LINUX (Terminal)**

1. **Abra o Terminal**

2. **Navegue até a pasta do projeto:**
   ```bash
   cd /caminho/para/seu/projeto
   ```

3. **Dê permissão de execução:**
   ```bash
   chmod +x DEPLOY_SCRIPT.sh
   ```

4. **Execute o script:**
   ```bash
   ./DEPLOY_SCRIPT.sh
   ```

---

## 🎯 O QUE O SCRIPT FAZ AUTOMATICAMENTE:

1. ✅ Instala o Supabase CLI (se necessário)
2. ✅ Faz login no Supabase (abre o navegador)
3. ✅ Conecta com seu projeto
4. ✅ Faz o deploy da Edge Function

## ⏱️ TEMPO ESTIMADO: 2-3 minutos

---

## 🆘 SE DER ERRO

### Erro: "supabase: command not found"

**Solução:** Instale manualmente o Supabase CLI:

```bash
# Windows (via npm)
npm install -g supabase

# Mac (via Homebrew)
brew install supabase/tap/supabase

# Linux (via npm)
npm install -g supabase
```

### Erro: "Failed to link project"

**Solução:** Execute manualmente:

```bash
supabase login
supabase link --project-ref lqpmyvizjfwzddxspacv
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt
```

---

## ✅ DEPOIS DO DEPLOY

1. **Teste a Edge Function:**
   ```bash
   curl https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
   ```

   **Resposta esperada:**
   ```json
   {"status":"ok","message":"Server is running"}
   ```

2. **Recarregue o aplicativo** (F5)

3. **Faça login** e teste!

---

## 🎉 PRONTO!

Agora seu backend está rodando no Supabase e todas as funcionalidades devem funcionar:

- ✅ Login/Signup
- ✅ Upload de documentos
- ✅ Timeline
- ✅ Mensagens
- ✅ Dashboard admin
- ✅ Bookkeeping
- ✅ Relatórios financeiros

---

## 📞 PRECISA DE AJUDA?

Se ainda tiver problemas, me envie o **erro completo** que aparece no terminal!
