# 🚀 Guia Completo de Deploy no Netlify

## Preparação Concluída ✅

Seu projeto já está 100% pronto para deploy! Os seguintes arquivos foram configurados:

- ✅ `netlify.toml` - Configuração do Netlify
- ✅ `public/_redirects` - Redirecionamento para React Router
- ✅ `.env.example` - Exemplo de variáveis de ambiente
- ✅ `package.json` - Scripts de build configurados

## 📋 Opções de Deploy

### OPÇÃO 1: Deploy Automático via GitHub (MAIS RECOMENDADO) 🌟

#### Passo 1: Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito > **"New repository"**
3. Configure:
   - **Repository name**: `duopro-services-website` (ou outro nome)
   - **Description**: "Website profissional para fiscalista canadense"
   - **Visibility**: Public ou Private (ambos funcionam)
4. Clique em **"Create repository"**

#### Passo 2: Conectar seu Código ao GitHub

```bash
# No terminal, na pasta do seu projeto:
git init
git add .
git commit -m "Initial commit - DuoPro Services website"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/duopro-services-website.git
git push -u origin main
```

**Substitua** `SEU-USUARIO` pelo seu username do GitHub.

#### Passo 3: Conectar GitHub ao Netlify

1. Acesse [app.netlify.com](https://app.netlify.com) e faça login
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Autorize o Netlify a acessar sua conta GitHub (se necessário)
5. Selecione o repositório `duopro-services-website`
6. Configure o deploy:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. Clique em **"Deploy site"**

#### Passo 4: Aguardar Deploy

- O deploy leva cerca de 2-5 minutos
- Você pode acompanhar o progresso na aba "Deploys"
- Quando concluído, você verá: ✅ **"Published"**

---

### OPÇÃO 2: Deploy Manual via Interface do Netlify (MAIS RÁPIDO) ⚡

#### Passo 1: Fazer Build Local

```bash
# No terminal, execute:
npm install
npm run build
```

Isso criará uma pasta `dist` com os arquivos otimizados.

#### Passo 2: Deploy via Drag & Drop

1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta **`dist`** inteira para a área indicada
3. Aguarde o upload (geralmente 1-2 minutos)
4. Pronto! Seu site estará online

**⚠️ Desvantagem**: Você precisará repetir este processo a cada atualização.

---

### OPÇÃO 3: Deploy via Netlify CLI (PARA DESENVOLVEDORES) 💻

#### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

#### Passo 2: Login no Netlify

```bash
netlify login
```

Isso abrirá seu navegador para autorizar.

#### Passo 3: Inicializar e Deploy

```bash
# Build do projeto
npm run build

# Inicializar site no Netlify
netlify init

# Ou fazer deploy direto
netlify deploy --prod --dir=dist
```

---

## 🌐 Após o Deploy

### 1. Configurar Domínio Personalizado (Opcional)

Se você tem um domínio (ex: `duoproservices.ca`):

1. No Netlify: **Site settings** > **Domain management**
2. Clique em **"Add custom domain"**
3. Digite seu domínio
4. Siga as instruções para configurar DNS

### 2. Habilitar HTTPS (Automático)

O Netlify ativa HTTPS automaticamente via Let's Encrypt. Aguarde alguns minutos após o deploy.

### 3. Configurar Variáveis de Ambiente (Se Necessário)

1. No Netlify: **Site settings** > **Environment variables**
2. Adicione:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://akjqlobybuqenweavgjp.supabase.co`
3. Adicione:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: (a chave que está no arquivo `.env.example`)

**Nota**: As variáveis já estão hardcoded no código, então isso é opcional.

---

## 🔍 Otimização para Google (SEO)

### 1. Google Search Console

1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Clique em **"Add property"**
3. Digite a URL do seu site Netlify (ex: `https://seu-site.netlify.app`)
4. Siga as instruções de verificação:
   - **Opção recomendada**: HTML tag (copie a tag e adicione no `index.html`)
5. Após verificação, clique em **"Solicitar indexação"**

### 2. Sitemap (Automático)

Para melhorar o SEO, você pode adicionar um sitemap. Vou criar um para você:

**Arquivo a criar**: `/public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seu-site.netlify.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seu-site.netlify.app/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://seu-site.netlify.app/signup</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://seu-site.netlify.app/dashboard</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Substitua** `seu-site.netlify.app` pela URL real do seu site.

Depois de criar o arquivo, submeta no Google Search Console:
- **Sitemaps** > **Add a new sitemap** > Digite: `sitemap.xml`

### 3. Google My Business

1. Acesse [business.google.com](https://business.google.com)
2. Crie um perfil para "DuoPro Services"
3. Adicione:
   - Endereço (se aplicável)
   - Telefone
   - Website (URL do Netlify)
   - Categoria: "Serviços de Contabilidade Fiscal"

### 4. Meta Tags (Já Incluídas) ✅

O site já possui meta tags otimizadas para SEO:
- Title, Description
- Open Graph (Facebook/LinkedIn)
- Twitter Cards
- Canonical URLs

---

## 🎯 Monitoramento

### Analytics (Opcional)

Para monitorar visitantes:

1. **Google Analytics**:
   - Crie uma conta em [analytics.google.com](https://analytics.google.com)
   - Obtenha o código de tracking
   - Adicione no `index.html` (antes de `</head>`)

2. **Netlify Analytics** (Pago):
   - Sem necessidade de código
   - Dados de servidor precisos
   - **Site settings** > **Analytics**

---

## ✅ Checklist Final

Antes de compartilhar o site:

- [ ] Site deployado no Netlify
- [ ] HTTPS ativo (cadeado verde no navegador)
- [ ] Todas as páginas funcionando (/login, /signup, /dashboard)
- [ ] Formulário de contato testado
- [ ] Widget Calendly funcionando
- [ ] Sistema de idiomas funcionando (EN/FR/PT)
- [ ] Upload de documentos testado
- [ ] Google Search Console configurado
- [ ] Sitemap submetido

---

## 🆘 Problemas Comuns

### Build Falhou no Netlify

**Erro**: `Module not found` ou `Cannot find package`

**Solução**:
```bash
# Limpe node_modules e reinstale
rm -rf node_modules
npm install
npm run build
```

### Página 404 ao Acessar Rotas

**Erro**: `/login` ou `/dashboard` retornam 404

**Solução**: Verifique se o arquivo `/public/_redirects` existe com:
```
/* /index.html 200
```

### Supabase Não Conecta

**Erro**: `Supabase client error`

**Solução**: Verifique as variáveis de ambiente no Netlify ou o arquivo `utils/supabase/info.tsx`.

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs de deploy no Netlify
2. Consulte a [documentação do Netlify](https://docs.netlify.com)
3. Entre em contato comigo para ajustes

---

**Boa sorte com o lançamento! 🎉**

Seu site ficou profissional e está pronto para conquistar clientes no Canadá! 🇨🇦
