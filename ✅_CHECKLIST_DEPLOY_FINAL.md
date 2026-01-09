# ✅ CHECKLIST DE DEPLOY - VERSÃO SIMPLIFICADA

**Data:** 4 de Janeiro de 2026  
**Objetivo:** Publicar site oficialmente em produção

---

## 🎯 FASE 1: PRÉ-DEPLOY (Preparação)

### Verificações de Código
- [x] ✅ Build local funciona (`npm run build`)
- [x] ✅ Preview funciona (`npm run preview`)
- [x] ✅ Sem erros no console
- [x] ✅ Todos os modais abrem/fecham corretamente
- [x] ✅ Internacionalização EN/FR funciona

### Informações de Contato
- [x] ✅ Email: duoproservices.info@gmail.com
- [ ] ⚠️ **Telefone:** Atualizar em `/index.html` linha 58 e 97
  - Atual: `+1-XXX-XXX-XXXX`
  - Trocar por seu número real

### Variáveis de Ambiente (Prontas)
- [x] ✅ VITE_SUPABASE_URL
- [x] ✅ VITE_SUPABASE_ANON_KEY
- [ ] ⏳ RESEND_API_KEY (precisa criar conta)

---

## 🚀 FASE 2: DEPLOY NO NETLIFY

### 1. Criar Conta Netlify
- [ ] Acessar: https://app.netlify.com
- [ ] Fazer login com GitHub
- [ ] Autorizar acesso ao repositório

### 2. Configurar Site
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Selecionar repositório GitHub
- [ ] Configurar build:
  ```
  Build command: npm run build
  Publish directory: dist
  ```

### 3. Adicionar Variáveis de Ambiente
- [ ] Click "Show advanced" → "New variable"
- [ ] Adicionar:
  ```
  VITE_SUPABASE_URL = https://akjqlobybuqenweavgjp.supabase.co
  VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFranFsb2J5YnVxZW53ZWF2Z2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MTkzODQsImV4cCI6MjA1MDM5NTM4NH0.I4qjE4JONJswqCy29IlJ9J-pF5REviFD9FPZ0C8U3XM
  ```

### 4. Deploy!
- [ ] Click "Deploy site"
- [ ] Aguardar 2-3 minutos
- [ ] Copiar URL do site (ex: `random-name-123.netlify.app`)

---

## 📧 FASE 3: CONFIGURAR EMAILS

### 1. Criar Conta Resend
- [ ] Acessar: https://resend.com
- [ ] Criar conta grátis
- [ ] Verificar email

### 2. Criar API Key
- [ ] Dashboard → API Keys → "Create API Key"
- [ ] Nome: "DuoPro Production"
- [ ] Copiar key (começa com `re_...`)
- [ ] **⚠️ GUARDAR EM LUGAR SEGURO - aparece só uma vez!**

### 3. Adicionar no Netlify
- [ ] Netlify → Site settings → Environment variables
- [ ] Click "Add a variable"
- [ ] Name: `RESEND_API_KEY`
- [ ] Value: `re_sua_key_aqui`
- [ ] Click "Create variable"

### 4. Re-deploy
- [ ] Netlify → Deploys → Trigger deploy → "Deploy site"
- [ ] Aguardar novo deploy

---

## 🧪 FASE 4: TESTAR TUDO

### Testes Funcionais Essenciais
- [ ] **Homepage:** Abre sem erros
- [ ] **Signup:** Criar conta de teste
- [ ] **Login:** Fazer login com conta criada
- [ ] **Dashboard:** Portal do cliente carrega
- [ ] **Upload:** Fazer upload de documento teste
- [ ] **Idioma:** Mudar para FR e voltar para EN
- [ ] **Mobile:** Abrir no celular e testar navegação

### Teste de Email
- [ ] Fazer signup com email real
- [ ] Verificar se recebeu email de confirmação
- [ ] Clicar no link do email
- [ ] Confirmar que funciona

### Teste Admin
- [ ] Fazer login com: duoproservices.info@gmail.com
- [ ] Acessar `/admin`
- [ ] Verificar painel admin carrega
- [ ] Testar ver lista de clientes
- [ ] Testar criar novo tax filing

---

## 🔍 FASE 5: SEO E GOOGLE

### Google Search Console
- [ ] Acessar: https://search.google.com/search-console
- [ ] Adicionar propriedade (URL do site)
- [ ] Escolher método de verificação: "HTML file"
- [ ] Baixar arquivo de verificação
- [ ] Colocar arquivo em `/public/`
- [ ] Commit e push
- [ ] Aguardar deploy
- [ ] Voltar ao Search Console e clicar "Verify"

### Submeter Sitemap
- [ ] No Search Console → Sitemaps
- [ ] Adicionar: `https://seu-site.netlify.app/sitemap.xml`
- [ ] Click "Submit"
- [ ] Aguardar processamento (24-48h)

### Solicitar Indexação
- [ ] Search Console → URL Inspection
- [ ] Cole: `https://seu-site.netlify.app`
- [ ] Click "Request Indexing"
- [ ] Repetir para:
  - [ ] `/login`
  - [ ] `/signup`

### Google Analytics (Opcional mas Recomendado)
- [ ] Criar conta: https://analytics.google.com
- [ ] Criar propriedade GA4
- [ ] Copiar Measurement ID (G-XXXXXXXXXX)
- [ ] Adicionar código no `/index.html` (ver guia)
- [ ] Commit e push

---

## 🌐 FASE 6: DOMÍNIO PRÓPRIO (Opcional - mas profissional)

### Comprar Domínio
- [ ] Escolher registrador (Namecheap, GoDaddy, Google Domains)
- [ ] Buscar domínio disponível:
  - [ ] `duoproservices.ca` (recomendado!)
  - [ ] `duoproservices.com`
- [ ] Comprar domínio (~$15-25/ano)

### Configurar no Netlify
- [ ] Netlify → Domain settings
- [ ] Click "Add custom domain"
- [ ] Digite seu domínio
- [ ] Seguir instruções de DNS
- [ ] Aguardar propagação (até 48h)

### SSL Automático
- [ ] Netlify configura SSL automaticamente
- [ ] Verificar se site abre com `https://`

---

## 🔧 FASE 7: BACKEND (Supabase Functions)

### Instalar Supabase CLI
```bash
npm install -g supabase
```

### Deploy das Functions
```bash
# Login
supabase login

# Link projeto
supabase link --project-ref akjqlobybuqenweavgjp

# Deploy functions
supabase functions deploy make-server-c2a25be0
supabase functions deploy server
```

### Configurar Secrets
```bash
supabase secrets set RESEND_API_KEY=re_sua_key_aqui
supabase secrets set STRIPE_SECRET_KEY=sk_test_sua_key_aqui
```

### Verificar
- [ ] Testar endpoints do servidor
- [ ] Verificar logs: `supabase functions logs server`

---

## 📊 FASE 8: MONITORAMENTO

### Configurar Ferramentas Grátis
- [ ] **UptimeRobot:** https://uptimerobot.com
  - Monitorar se site está online
  - Alertas por email
  
- [ ] **Microsoft Clarity:** https://clarity.microsoft.com
  - Heatmaps de cliques
  - Gravações de sessões
  
- [ ] **Netlify Analytics:** Já está ativo automaticamente

---

## 🎉 FASE 9: ANUNCIAR O SITE!

### Redes Sociais
- [ ] Criar post no LinkedIn anunciando
- [ ] Compartilhar no Facebook
- [ ] Criar Instagram Business
- [ ] Tweet sobre o lançamento

### Diretórios de Negócios (Grátis)
- [ ] Google My Business (se tiver escritório)
- [ ] Yelp Canada
- [ ] Yellow Pages
- [ ] LinkedIn Company Page
- [ ] Facebook Business Page

### Email para Contatos
- [ ] Lista de pessoas que podem precisar do serviço
- [ ] Email simples: "Estou lançando meu serviço de impostos!"
- [ ] Incluir link do site
- [ ] Oferecer desconto para primeiros clientes

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Site não carrega
**Solução:**
1. Verificar variáveis de ambiente no Netlify
2. Ver logs do deploy (Netlify → Deploys → Ver log de erro)
3. Testar build local: `npm run build && npm run preview`

### Emails não funcionam
**Solução:**
1. Verificar RESEND_API_KEY está configurada
2. Verificar domain do Resend está verificado
3. Ver logs do Supabase Functions

### Upload de documentos falha
**Solução:**
1. Ir em `/admin` 
2. Click no botão "Magic Setup" (cria buckets automaticamente)
3. Verificar policies RLS no Supabase

### CORS errors
**Solução:**
1. Supabase → Authentication → URL Configuration
2. Adicionar seu domínio do Netlify na lista

---

## 📈 PRÓXIMOS PASSOS (Pós-Launch)

### Semana 1
- [ ] Monitorar erros diariamente
- [ ] Fazer pequenos ajustes baseado em feedback
- [ ] Conseguir 3-5 usuários teste
- [ ] Coletar feedback

### Semana 2-4
- [ ] Escrever primeiro blog post sobre impostos
- [ ] Criar 10 posts para redes sociais
- [ ] Registrar em 5-10 diretórios
- [ ] Otimizar baseado em Google Analytics

### Mês 2-3
- [ ] Iniciar campanha Google Ads ($10-20/dia teste)
- [ ] Conseguir primeiros reviews
- [ ] Adicionar mais conteúdo SEO
- [ ] Criar vídeos explicativos

---

## 📞 AJUDA E SUPORTE

### Documentação Oficial
- **Netlify:** https://docs.netlify.com
- **Supabase:** https://supabase.com/docs
- **Resend:** https://resend.com/docs

### Arquivos de Referência
- `🚀_DEPLOY_OFICIAL_PASSO_A_PASSO.md` - Guia detalhado
- `GUIA_COMPLETO_PRODUCAO_SEO.md` - Estratégia SEO completa
- `BACKEND_DEPLOY_GUIDE.md` - Deploy do backend

---

## ✅ RESUMO RÁPIDO (TL;DR)

**Para colocar o site no ar em 30 minutos:**

1. ✅ Deploy no Netlify (10 min)
2. ✅ Configurar RESEND_API_KEY (5 min)
3. ✅ Testar signup/login/upload (10 min)
4. ✅ Configurar Google Search Console (5 min)

**Pronto! Seu site está online!** 🎉

---

## 💰 CUSTOS TOTAIS

### Obrigatórios
- **Netlify:** GRÁTIS
- **Supabase:** GRÁTIS (até 500MB)
- **Resend:** GRÁTIS (até 100 emails/dia)

### Opcionais
- **Domínio .ca:** ~$15-25/ano
- **Google Ads:** $300-1000/mês (quando quiser anunciar)

**Total mínimo para começar: $0/mês!** 🎉  
(Só precisa pagar domínio se quiser)

---

**Status Atual:** ✅ TUDO PRONTO PARA DEPLOY  
**Tempo Estimado:** 30-60 minutos  
**Próxima Ação:** Acessar https://app.netlify.com e começar!

🚀 **BOA SORTE!**

---

**Última atualização:** 4 de Janeiro de 2026  
**Criado por:** Sistema de Deploy Automatizado DuoPro
