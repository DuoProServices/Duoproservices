# 📚 ÍNDICE DE ARQUIVOS - Guia de Navegação

## 🎯 POR ONDE COMEÇAR?

Não sabe por onde começar? Use este índice para encontrar o que precisa!

---

## 🚨 PROBLEMAS COMUNS - SOLUÇÕES RÁPIDAS:

### ❌ **"Failed to fetch" / Backend não responde**
➡️ **DEPLOY_RAPIDO.md** - Deploy do backend em 6 passos
➡️ **BACKEND_DEPLOY_GUIDE.md** - Guia completo do Supabase
➡️ *Ferramenta:* `/test-email.html` - Teste se backend está UP

### ❌ **"Invalid login credentials" / Conta existe mas não loga**
➡️ **RESUMO_LOGIN.md** - Solução executiva completa ⭐
➡️ **SOLUCAO_LOGIN.md** - Guia passo a passo detalhado
➡️ *Ferramenta:* `/reset-account.html` - Reset de conta fácil

### ❌ **"Email já registrado" / Testar email específico**
➡️ **TESTE_EMAIL.md** - Como testar e debugar emails
➡️ **DEBUG_EMAIL.md** - Scripts de debug manual
➡️ *Ferramenta:* `/test-email.html` - Teste visual

---

## 🚀 PARA PUBLICAR O SITE:

### 1️⃣ **COMECE_AQUI.md** 
**⏱️ 2 minutos**
- Resumo ultra-rápido
- Apenas os comandos essenciais
- Para quem quer publicar AGORA

### 2️⃣ **LEIA-ME.md** 
**⏱️ 5 minutos**
- Guia completo em português
- Explica tudo que foi feito
- Passo a passo detalhado
- **RECOMENDADO** para primeira leitura

### 3️⃣ **PROXIMOS_PASSOS.md** 
**⏱️ 10 minutos**
- Guia detalhado com todas as opções
- Inclui otimização para Google
- Troubleshooting completo
- Para quem quer entender tudo

### 4️⃣ **DEPLOY_GUIDE.md** 
**⏱️ 15 minutos**
- Documentação técnica completa
- Todas as opções de deploy
- Configurações avançadas
- Para desenvolvedores

---

## ✅ ANTES DE PUBLICAR:

### 📋 **CHECKLIST_DEPLOY.md**
- Lista de verificação completa
- Testes a realizar
- Problemas comuns e soluções
- Use antes do deploy!

---

## 📖 INFORMAÇÕES DO PROJETO:

### 📄 **README.md**
- Visão geral do projeto
- Tecnologias utilizadas
- Características do site
- Documentação técnica em inglês

---

## 🔧 ARQUIVOS DE CONFIGURAÇÃO:

Estes arquivos já estão prontos, **NÃO PRECISA MEXER**:

### ⚙️ **netlify.toml**
- Configuração do Netlify
- Build commands
- Headers e redirects

### 🌐 **index.html**
- HTML principal
- Meta tags SEO otimizadas
- Open Graph e Twitter Cards
- Structured Data (Schema.org)

### 📦 **package.json**
- Dependências do projeto
- Scripts de build
- Configurações npm

### 🎨 **vite.config.ts**
- Configuração do Vite
- Plugins React e Tailwind
- Alias de importação

---

## 🤖 ARQUIVOS SEO:

### 🗺️ **public/sitemap.xml**
- Mapa do site para Google
- URLs de todas as páginas
- Prioridades de indexação
- ⚠️ Atualizar com sua URL final!

### 🤖 **public/robots.txt**
- Instruções para crawlers
- Permite indexação do site
- Bloqueia áreas privadas
- ⚠️ Atualizar com sua URL final!

### 🎯 **public/favicon.svg**
- Ícone do site
- Aparece na aba do navegador

### 🔀 **public/_redirects**
- Redirecionamentos para SPA
- Essencial para React Router funcionar

---

## 🛡️ OUTROS ARQUIVOS:

### 🙈 **.gitignore**
- Arquivos a ignorar no Git
- node_modules, dist, .env, etc.

### 📝 **.env.example**
- Exemplo de variáveis de ambiente
- Credenciais Supabase (já configuradas)

---

## 📂 ESTRUTURA DO CÓDIGO FONTE:

```
/src
├── /app
│   ├── App.tsx                    # Componente principal + rotas
│   ├── /components
│   │   ├── Header.tsx            # Header com seletor de idiomas
│   │   ├── Hero.tsx              # Seção hero
│   │   ├── About.tsx             # Seção sobre
│   │   ├── Services.tsx          # Seção serviços
│   │   ├── Pricing.tsx           # Seção preços
│   │   ├── Process.tsx           # Seção processo
│   │   ├── FAQ.tsx               # Perguntas frequentes
│   │   ├── Contact.tsx           # Formulário de contato
│   │   ├── Footer.tsx            # Rodapé
│   │   └── /ui                   # Componentes UI reutilizáveis
│   ├── /contexts
│   │   ├── LanguageContext.tsx   # Context API para i18n
│   │   └── AuthContext.tsx       # Context API para autenticação
│   ├── /pages
│   │   ├── LoginPage.tsx         # Página de login
│   │   ├── SignupPage.tsx        # Página de cadastro
│   │   └── DashboardPage.tsx     # Portal do cliente
│   ├── /data
│   │   └── faqData.tsx           # Dados do FAQ em 3 idiomas
│   └── /utils
│       └── supabaseClient.ts     # Cliente Supabase configurado
├── /styles
│   ├── index.css                 # Importa todos os estilos
│   ├── fonts.css                 # Fontes customizadas
│   ├── tailwind.css              # Importa Tailwind
│   └── theme.css                 # Tema e tokens CSS
└── main.tsx                      # Ponto de entrada React

/supabase/functions/server
├── index.tsx                     # Servidor Hono (Edge Function)
├── timeline.tsx                  # Lógica da timeline
└── kv_store.tsx                  # Utilitários KV store (protegido)

/utils/supabase
└── info.tsx                      # Credenciais Supabase (protegido)
```

---

## 🎯 FLUXO RECOMENDADO:

1. **Primeira vez?** Leia **LEIA-ME.md** (5 min)
2. **Quer publicar rápido?** Siga **COMECE_AQUI.md** (2 min)
3. **Antes de publicar** Confira **CHECKLIST_DEPLOY.md**
4. **Publicou?** Siga "Após Deploy" em **PROXIMOS_PASSOS.md**
5. **Problemas?** Consulte "Troubleshooting" em **DEPLOY_GUIDE.md**

---

## ❓ PERGUNTAS FREQUENTES:

### "Qual arquivo devo ler primeiro?"
➡️ **LEIA-ME.md** - É o mais completo em português

### "Como faço para publicar o site?"
➡️ **COMECE_AQUI.md** - Tem o passo a passo rápido

### "Deu erro no build, o que faço?"
➡️ **CHECKLIST_DEPLOY.md** - Seção "Problemas Comuns"

### "Como aparecer no Google?"
➡️ **LEIA-ME.md** ou **PROXIMOS_PASSOS.md** - Seção "Google Search Console"

### "Posso mexer nos arquivos de configuração?"
➡️ Não é necessário, mas se quiser, leia **DEPLOY_GUIDE.md** primeiro

### "Onde estão as credenciais do Supabase?"
➡️ Já configuradas em `/utils/supabase/info.tsx` (arquivo protegido)

### "Preciso instalar algo?"
➡️ Sim, Node.js e npm. Depois rode `npm install`

### "Quanto custa hospedar?"
➡️ GRÁTIS no Netlify e Supabase (tier gratuito)

---

## 🎉 TUDO PRONTO!

Agora que você sabe onde está cada coisa, é só escolher por onde começar!

**Sugestão**: Comece por **LEIA-ME.md** 📖

Boa sorte com seu site! 🚀