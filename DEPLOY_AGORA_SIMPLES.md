# 🚀 DEPLOY AGORA - GUIA ULTRA SIMPLES

## ⚡ 3 PASSOS PARA COLOCAR NO AR

### PASSO 1: PREPARAR (2 minutos)

```bash
# 1. Testar se tudo funciona
npm install
npm run build

# 2. Testar o build
npm run preview
```

✅ Se abrir em `http://localhost:4173` e funcionar = Está pronto!

---

### PASSO 2: FAZER DEPLOY (5 minutos)

#### Opção A: Netlify (MAIS FÁCIL) ⭐

1. **Via Interface (Arrastar e Soltar)**
   - Acesse: https://app.netlify.com
   - Faça login (ou crie conta grátis)
   - Clique em "Add new site" → "Deploy manually"
   - Arraste a pasta `dist/` para o upload
   - Aguarde 30 segundos
   - ✅ **PRONTO! Site no ar!**

2. **Via CLI (Recomendado para atualizações)**
   ```bash
   # Instalar Netlify CLI
   npm install -g netlify-cli
   
   # Fazer login
   netlify login
   
   # Deploy
   netlify deploy --prod
   
   # Escolher:
   # - Create & configure a new site
   # - Publish directory: dist
   ```

#### Opção B: Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

#### Opção C: Render

1. Acesse: https://render.com
2. "New" → "Static Site"
3. Conecte GitHub
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy!

---

### PASSO 3: CONFIGURAR VARIÁVEIS (3 minutos)

**No Netlify:**
1. Site settings → Environment variables
2. Adicionar:
   ```
   VITE_SUPABASE_URL = https://akjqlobybuqenweavgjp.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Redeploy o site

**No Vercel:**
1. Project Settings → Environment Variables
2. Adicionar as mesmas variáveis
3. Redeploy

---

## 🎯 PRÓXIMOS PASSOS ESSENCIAIS

### 1. Configurar Email (CRÍTICO!) ⚠️

Sem isso, emails não funcionam:

**Supabase Edge Functions:**
1. Acesse: https://supabase.com/dashboard
2. Projeto → Edge Functions → Secrets
3. Adicionar: `RESEND_API_KEY`
4. Obter key em: https://resend.com (grátis até 3000 emails/mês)

### 2. Google Search Console (15 minutos)

```
1. https://search.google.com/search-console
2. Adicionar propriedade: seu-site.netlify.app
3. Verificar propriedade (método HTML)
4. Submeter sitemap: seu-site.netlify.app/sitemap.xml
```

**Resultado:** Site aparecerá no Google em 1-4 semanas!

### 3. Atualizar Informações de Contato

Editar `/index.html`, linha 66:
```html
"telephone": "+1-XXX-XXX-XXXX",  <!-- ATUALIZAR AQUI -->
```

---

## 🔧 COMANDOS ÚTEIS

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Testar build localmente
npm run preview

# Deploy no Netlify
netlify deploy --prod

# Deploy no Vercel
vercel --prod
```

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Failed to fetch" no login

**Solução:** Variáveis de ambiente não configuradas
- Verificar Netlify/Vercel environment variables
- Redeploy após adicionar

### ❌ Emails não enviam

**Solução:** RESEND_API_KEY não configurada
- Configurar em Supabase Edge Functions secrets
- Obter em https://resend.com

### ❌ Upload de documentos falha

**Solução:** Buckets não criados
- No dashboard admin, clicar "Magic Setup"
- Ou criar manualmente no Supabase Storage

### ❌ Site não aparece no Google

**Solução:** Aguardar ou acelerar
- Normal levar 1-4 semanas
- Usar Google Search Console para solicitar indexação
- Verificar robots.txt não está bloqueando

---

## ✅ CHECKLIST COMPLETO

**Básico (Obrigatório):**
- [ ] Deploy feito (Netlify/Vercel)
- [ ] Variáveis de ambiente configuradas
- [ ] Site acessível publicamente
- [ ] Login/Signup funcionando
- [ ] RESEND_API_KEY configurada

**SEO (Importante):**
- [ ] Google Search Console verificado
- [ ] Sitemap submetido
- [ ] Telefone atualizado no index.html
- [ ] Google Analytics instalado (opcional)

**Marketing (Quando estiver pronto):**
- [ ] Domínio próprio (ex: duoproservices.ca)
- [ ] Email profissional (ex: contact@duoproservices.ca)
- [ ] Google My Business (se tiver escritório)
- [ ] Redes sociais criadas
- [ ] Primeiro blog post

---

## 🎉 PRONTO!

**Seu site está no ar!** 🚀

### Próximos passos recomendados:

1. **Hoje:** Testar tudo funcionando
2. **Esta semana:** Google Search Console + Analytics
3. **Este mês:** Domínio próprio + Marketing

### Documentação completa:

- **Deploy detalhado:** `GUIA_COMPLETO_PRODUCAO_SEO.md`
- **Google/SEO:** `GUIA_RAPIDO_GOOGLE.md`
- **Backend:** `BACKEND_DEPLOY_GUIDE.md`

---

**Dúvidas?**

Veja a documentação completa nos guias acima ou procure ajuda na comunidade Netlify/Vercel.

**Boa sorte! 🎯**
