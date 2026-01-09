# ✅ CHECKLIST DE PRODUÇÃO - DUOPRO SERVICES

Use este checklist para garantir que tudo está configurado corretamente antes e depois do deploy.

---

## 🚀 PRÉ-DEPLOY

### Código e Build

- [ ] `npm install` funciona sem erros
- [ ] `npm run build` completa com sucesso
- [ ] `npm run preview` mostra o site funcionando
- [ ] Nenhum erro no console do navegador
- [ ] Todas as páginas carregam corretamente:
  - [ ] Homepage (/)
  - [ ] Login (/login)
  - [ ] Signup (/signup)
  - [ ] Dashboard (/dashboard) - após login

### Conteúdo

- [ ] **Telefone atualizado** no `/index.html` (linha 66)
  - Atual: `+1-XXX-XXX-XXXX`
  - ⚠️ **MUDAR PARA SEU NÚMERO REAL!**

- [ ] Email confirmado: `duoproservices.info@gmail.com`

- [ ] Logo e imagens:
  - [ ] `/public/favicon.svg` existe
  - [ ] `/public/og-image.jpg` (1200x630px) - criar se não existir
  - [ ] `/public/apple-touch-icon.png` - criar se não existir

### Configurações Supabase

- [ ] Projeto Supabase ativo
- [ ] URL: `https://akjqlobybuqenweavgjp.supabase.co` ✅
- [ ] Anon Key disponível ✅
- [ ] Service Role Key disponível ✅

---

## 🌐 DEPLOY

### Escolher Plataforma

- [ ] **Netlify** (recomendado)
  - Grátis
  - Fácil de usar
  - HTTPS automático
  - CI/CD com GitHub

- [ ] **Vercel** (alternativa)
  - Grátis
  - Performance excelente
  - Deploy automático

- [ ] **Render** (alternativa)
  - Grátis
  - Simples

### Deploy Executado

- [ ] Site deployado com sucesso
- [ ] URL do site funcionando
- [ ] HTTPS ativo (🔒 no navegador)
- [ ] Sem erros 404

### URL do Site:
```
https://_____________________.netlify.app
```

---

## ⚙️ VARIÁVEIS DE AMBIENTE

### No Netlify/Vercel

- [ ] `VITE_SUPABASE_URL` configurada
- [ ] `VITE_SUPABASE_ANON_KEY` configurada
- [ ] Site re-deployado após adicionar variáveis

### No Supabase (Edge Functions)

- [ ] `SUPABASE_URL` (automático) ✅
- [ ] `SUPABASE_ANON_KEY` (automático) ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (automático) ✅
- [ ] `RESEND_API_KEY` - ⚠️ **CONFIGURAR!**

**Como configurar RESEND_API_KEY:**
```
1. Criar conta em https://resend.com (grátis - 3000 emails/mês)
2. Obter API Key
3. Supabase Dashboard → Edge Functions → Secrets
4. Adicionar: RESEND_API_KEY = re_xxxxxxxxxxxxx
```

---

## 🧪 TESTES PÓS-DEPLOY

### Funcionalidades Básicas

- [ ] **Homepage carrega**
  - [ ] Todas as seções visíveis
  - [ ] Botões funcionam
  - [ ] Imagens carregam
  - [ ] Responsivo (testar no mobile)

- [ ] **Signup funciona**
  - [ ] Criar nova conta
  - [ ] Receber confirmação
  - [ ] Redirecionado para onboarding

- [ ] **Login funciona**
  - [ ] Fazer login com conta criada
  - [ ] Redirecionado para dashboard
  - [ ] Dados do usuário aparecem

- [ ] **Dashboard funciona**
  - [ ] Timeline visível
  - [ ] Botão de upload funciona
  - [ ] Navegação funciona

### Funcionalidades do Cliente

- [ ] **Upload de Documentos**
  - [ ] Cliente consegue fazer upload
  - [ ] Arquivos aparecem na lista
  - [ ] Download funciona
  - [ ] Delete funciona

- [ ] **Tax Report Review**
  - [ ] Cliente vê relatório após admin enviar
  - [ ] Botão de aprovação funciona
  - [ ] Botão de rejeição funciona

- [ ] **Sistema de Mensagens**
  - [ ] Cliente pode enviar mensagem
  - [ ] Mensagem aparece no histórico
  - [ ] Admin recebe notificação

### Funcionalidades Admin

- [ ] **Login como Admin**
  - Email: seu-email-admin
  - Verificar em `/src/app/config/admins.ts`

- [ ] **Dashboard Admin**
  - [ ] Ver lista de clientes
  - [ ] Ver detalhes do cliente
  - [ ] Ver documentos enviados

- [ ] **Upload de Tax Documents**
  - [ ] Upload Federal (CRA)
  - [ ] Upload Provincial (Quebec)
  - [ ] **Email automático enviado** ⚠️ (requer RESEND_API_KEY)

- [ ] **Sistema Financeiro**
  - [ ] Dashboard financeiro carrega
  - [ ] KPIs aparecem
  - [ ] Charts funcionam
  - [ ] Export CSV funciona
  - [ ] Export PDF funciona

- [ ] **Bookkeeping**
  - [ ] Adicionar expense
  - [ ] Adicionar invoice
  - [ ] Receipt scanner funciona
  - [ ] Balanço atualiza

---

## 🔍 SEO E GOOGLE

### Google Search Console

- [ ] Conta criada
- [ ] Propriedade verificada
- [ ] Sitemap submetido
- [ ] Primeiras páginas solicitadas para indexação

**URL Sitemap:**
```
https://seu-site.com/sitemap.xml
```

**URLs para solicitar indexação:**
- [ ] `https://seu-site.com/`
- [ ] `https://seu-site.com/login`
- [ ] `https://seu-site.com/signup`

### Google Analytics (Opcional mas Recomendado)

- [ ] Conta criada
- [ ] Measurement ID obtido
- [ ] Código instalado no `/index.html`
- [ ] Primeiros dados aparecendo (24-48h)

**Measurement ID:**
```
G-___________________
```

### Meta Tags e SEO

- [ ] Título único em cada página
- [ ] Descriptions otimizadas
- [ ] Open Graph tags
- [ ] Structured Data (JSON-LD)
- [ ] Sitemap.xml acessível
- [ ] Robots.txt acessível

---

## 📧 EMAIL E NOTIFICAÇÕES

### Sistema de Emails

- [ ] RESEND_API_KEY configurada
- [ ] Email de teste enviado
- [ ] Template de email funciona
- [ ] Emails em 3 idiomas (EN/FR/PT)

**Tipos de Email:**
- [ ] Email de boas-vindas (signup)
- [ ] Tax documents prontos (CRA)
- [ ] Tax documents prontos (Quebec)
- [ ] CRA Assessment recebido
- [ ] Mensagens do admin

### Testar Emails

```
1. Criar conta de teste
2. Fazer upload de documentos como cliente
3. Como admin, fazer upload de tax documents
4. Verificar se email foi enviado
5. Verificar se email está em português/inglês/francês correto
```

---

## 🔐 SEGURANÇA E COMPLIANCE

### Supabase Storage

- [ ] Buckets criados:
  - [ ] `documents-c2a25be0` (privado)
  - [ ] Outros buckets necessários

- [ ] RLS Policies configuradas
- [ ] Somente donos acessam seus arquivos
- [ ] Admin acessa todos os arquivos

### Auth e Segurança

- [ ] Email confirmation habilitado (ou desabilitado intencionalmente)
- [ ] Password requirements (mín. 6 caracteres)
- [ ] Session timeout configurado
- [ ] HTTPS ativo (sempre)

### Privacy e Legal

- [ ] Privacy Policy criada (recomendado)
- [ ] Terms of Service criados (recomendado)
- [ ] Cookie consent (se aplicável)
- [ ] GDPR/PIPEDA compliance (para Canadá)

---

## 🎨 BRANDING E IDENTIDADE

### Visual

- [ ] Logo profissional
- [ ] Cores consistentes
- [ ] Tipografia profissional
- [ ] Design responsivo

### Conteúdo

- [ ] Texto em 3 idiomas (EN/FR/PT)
- [ ] Traduções corretas
- [ ] Tom profissional
- [ ] Sem erros de gramática/ortografia

---

## 📱 REDES SOCIAIS E MARKETING

### Perfis Criados

- [ ] **LinkedIn Company Page**
  - URL: ___________________

- [ ] **Facebook Business Page**
  - URL: ___________________

- [ ] **Instagram Business**
  - URL: ___________________

- [ ] **Twitter/X** (opcional)
  - URL: ___________________

### Conteúdo Preparado

- [ ] 10+ posts agendados
- [ ] Bio completa em todas as redes
- [ ] Link para o site em todas as bios
- [ ] Imagens de capa/perfil

---

## 📊 MONITORAMENTO

### Ferramentas Configuradas

- [ ] **Google Analytics**
  - Visitantes
  - Páginas mais vistas
  - Origem do tráfego

- [ ] **Microsoft Clarity** (opcional)
  - Heatmaps
  - Session recordings

- [ ] **UptimeRobot** (opcional)
  - Monitorar se site está online
  - Alertas se cair

### Métricas a Monitorar

- [ ] Visitantes únicos/dia
- [ ] Taxa de conversão (visitante → cadastro)
- [ ] Taxa de rejeição (bounce rate)
- [ ] Páginas mais populares
- [ ] Tempo médio no site

---

## 🎯 MARKETING E DIVULGAÇÃO

### Registro em Diretórios

- [ ] **Yelp Canada**
- [ ] **Yellow Pages**
- [ ] **Better Business Bureau**
- [ ] **Google My Business** (se tiver escritório físico)
- [ ] **Diretórios de contadores**

### Primeiras Campanhas

- [ ] Email para contatos existentes
- [ ] Post de lançamento nas redes sociais
- [ ] Grupo de imigrantes/comunidades
- [ ] Networking local

---

## 📈 CRESCIMENTO

### Conteúdo para Criar

- [ ] **Blog Post 1:** "Tax Filing Deadlines Canada 2025"
- [ ] **Blog Post 2:** "Newcomer's Guide to Canadian Taxes"
- [ ] **Blog Post 3:** "Small Business Tax Deductions"
- [ ] **Video 1:** "How to Use Our Platform"
- [ ] **Infográfico:** "Tax Process Timeline"

### Otimizações Futuras

- [ ] A/B testing de CTAs
- [ ] Speed optimization
- [ ] Additional features baseado em feedback
- [ ] Mobile app (longo prazo)

---

## 🔄 MANUTENÇÃO

### Diária

- [ ] Verificar emails de clientes
- [ ] Responder mensagens
- [ ] Verificar novos cadastros

### Semanal

- [ ] Verificar analytics
- [ ] Postar nas redes sociais
- [ ] Backup de dados importantes

### Mensal

- [ ] Review de métricas
- [ ] Atualizar conteúdo
- [ ] Planejar próximo mês
- [ ] Solicitar reviews de clientes satisfeitos

---

## ✅ CHECKLIST FINAL PRÉ-LAUNCH

**Tudo pronto para lançar?**

- [ ] ✅ Site deployado e funcionando
- [ ] ✅ Todas as features testadas
- [ ] ✅ Email configurado (RESEND_API_KEY)
- [ ] ✅ Google Search Console configurado
- [ ] ✅ Informações de contato atualizadas
- [ ] ✅ Redes sociais criadas
- [ ] ✅ Primeiros posts agendados
- [ ] ✅ Plano de marketing definido

---

## 🎉 PARABÉNS!

Se você marcou todos os itens acima, seu site está **100% pronto para produção!**

### Próximos Passos:

1. **Anunciar lançamento** nas redes sociais
2. **Email para lista** de contatos
3. **Ativar campanhas** de marketing
4. **Monitorar resultados** diariamente nos primeiros dias
5. **Iterar e melhorar** baseado no feedback

---

## 📞 INFORMAÇÕES IMPORTANTES

### URLs para Salvar

```
Site Principal: https://_________________________.netlify.app
Google Search Console: https://search.google.com/search-console
Google Analytics: https://analytics.google.com
Supabase Dashboard: https://supabase.com/dashboard
Resend Dashboard: https://resend.com/dashboard
```

### Credenciais Admin

```
Email: _________________________
Password: _________________________
(Guardar em local seguro!)
```

### Contatos Importantes

```
Suporte Netlify: https://www.netlify.com/support/
Suporte Supabase: https://supabase.com/support
Resend Support: https://resend.com/support
```

---

## 🆘 SE ALGO NÃO FUNCIONA

**Consulte:**

1. [`SOLUCAO_DE_PROBLEMAS.md`](./SOLUCAO_DE_PROBLEMAS.md) - Problemas comuns
2. [`DEBUG_EMAIL.md`](./DEBUG_EMAIL.md) - Problemas com email
3. [`COMECE_POR_AQUI.md`](./COMECE_POR_AQUI.md) - Índice master

---

**Data de Launch:** _____ / _____ / 2025

**Última verificação:** _____ / _____ / _____

**Status geral:** 
- [ ] 🟢 Tudo OK
- [ ] 🟡 Alguns pendentes
- [ ] 🔴 Precisa atenção

---

**Boa sorte com o lançamento! 🚀🎉**
