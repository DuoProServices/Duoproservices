# 🚀 GUIA RÁPIDO - DEPLOY AUTOMÁTICO

## ✅ PASSO A PASSO:

### 1️⃣ BAIXAR O PROJETO

**👉 Clique no botão de Download** no topo do Figma Make

**👉 Salve o arquivo ZIP** no seu computador

**👉 EXTRAIA o ZIP** em uma pasta (exemplo: `C:\projetos\duopro-services`)

---

### 2️⃣ ABRIR O TERMINAL

#### 🪟 **Windows:**
- Abra a pasta do projeto
- Clique com botão direito na pasta
- Escolha "Abrir no Terminal" ou "Git Bash Here"

#### 🍎 **Mac/Linux:**
- Abra o Terminal
- Digite: `cd caminho/para/a/pasta/duopro-services`

---

### 3️⃣ RODAR O SCRIPT

#### 🪟 **Windows:**
```bash
./setup-github.bat
```

#### 🍎 **Mac/Linux:**
```bash
chmod +x setup-github.sh
./setup-github.sh
```

---

### 4️⃣ O SCRIPT VAI FAZER TUDO SOZINHO:

✅ Configurar Git  
✅ Adicionar todos os arquivos  
✅ Fazer commit  
✅ Conectar ao GitHub  
✅ Fazer push  

**⏱️ Tempo: ~2 minutos**

---

### 5️⃣ DEPOIS DO SCRIPT:

**👉 Volte pro Netlify**

**👉 Cancele a configuração atual** (se estiver aberta)

**👉 Clique em "Add new site" → "Import an existing project"**

**👉 Escolha "Deploy with GitHub"**

**👉 Autorize o Netlify** (se pedir)

**👉 Selecione o repositório:** `duopro-services`

**👉 Configure:**
```
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

**👉 Clique em "Deploy site"**

---

### 6️⃣ ADICIONAR VARIÁVEIS DE AMBIENTE:

**👉 No Netlify, vá em:**
```
Site settings → Environment variables → Add a variable
```

**👉 Adicione:**
```
VITE_SUPABASE_URL = sua_url_aqui
VITE_SUPABASE_ANON_KEY = sua_key_aqui
```

**👉 Salve e faça redeploy**

---

## 🎉 PRONTO!

Seu site estará online em **5-10 minutos**!

E **toda vez** que você fizer uma mudança:
1. Commit no GitHub
2. **Netlify rebuilda automaticamente!** 🚀

---

## 🆘 PROBLEMAS?

### ❌ "Git não encontrado"
**👉 Instale o Git:** https://git-scm.com/downloads

### ❌ "Permission denied"
**👉 No Mac/Linux, rode:** `chmod +x setup-github.sh`

### ❌ "Remote already exists"
**👉 O script já foi rodado antes, está tudo OK!**

---

## 📞 PRECISA DE AJUDA?

Me avisa que eu ajudo! 🤝
