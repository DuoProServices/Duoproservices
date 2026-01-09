# ⚡ COMANDOS RÁPIDOS - Referência

---

## 🚀 PUBLICAR O SITE

### Opção 1: Deploy Manual (Mais Rápido)

```bash
# Instalar dependências
npm install

# Criar build de produção
npm run build

# A pasta 'dist' será criada
# Acesse: https://app.netlify.com/drop
# Arraste a pasta 'dist' para o site
```

---

### Opção 2: Deploy via GitHub

```bash
# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Site DuoPro Services pronto para deploy"

# Criar branch main
git branch -M main

# Conectar ao repositório GitHub
# (Substitua SEU-USUARIO pelo seu username)
git remote add origin https://github.com/SEU-USUARIO/duopro-services-website.git

# Enviar código para GitHub
git push -u origin main

# Depois: Conecte o repositório no Netlify
# https://app.netlify.com > Add new site > Import from Git
```

---

## 🛠️ DESENVOLVIMENTO LOCAL

```bash
# Instalar dependências (primeira vez)
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Criar build de produção
npm run build

# Testar build localmente
npm run preview
```

---

## 🔄 ATUALIZAR O SITE

### Se usou Deploy Manual:

```bash
# Fazer alterações nos arquivos...

# Criar novo build
npm run build

# Acessar Netlify
# https://app.netlify.com > Seu site > Deploys > Drag and drop

# Arrastar nova pasta 'dist'
```

### Se usou GitHub:

```bash
# Fazer alterações nos arquivos...

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub (deploy automático)
git push
```

---

## 🧹 LIMPAR E REINSTALAR

```bash
# Remover node_modules
rm -rf node_modules

# Remover package-lock.json (se tiver problemas)
rm package-lock.json

# Reinstalar dependências
npm install

# Criar novo build
npm run build
```

---

## 📁 ESTRUTURA DE PASTAS

```
/
├── public/              # Arquivos públicos
│   ├── _redirects      # Redirecionamentos
│   ├── robots.txt      # SEO
│   ├── sitemap.xml     # Mapa do site
│   └── favicon.svg     # Ícone
├── src/                 # Código fonte
│   ├── main.tsx        # Entrada
│   ├── app/            # Componentes
│   └── styles/         # Estilos
├── dist/               # Build (gerado)
├── node_modules/       # Dependências (gerado)
├── index.html          # HTML principal
├── package.json        # Configuração npm
├── vite.config.ts      # Configuração Vite
└── netlify.toml        # Configuração Netlify
```

---

## 🔍 VERIFICAR STATUS

```bash
# Ver versão do Node
node --version

# Ver versão do npm
npm --version

# Listar dependências instaladas
npm list --depth=0

# Verificar se há atualizações
npm outdated
```

---

## 🐛 TROUBLESHOOTING

### Build falha com erro de memória:

```bash
# Aumentar memória do Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Erro "Cannot find module":

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Porta já em uso (dev):

```bash
# Matar processo na porta 5173
# Linux/Mac:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F
```

### Cache de build quebrado:

```bash
# Limpar cache do Vite
rm -rf node_modules/.vite
npm run build
```

---

## 📦 GERENCIAR DEPENDÊNCIAS

```bash
# Instalar nova dependência
npm install nome-do-pacote

# Instalar dependência de desenvolvimento
npm install --save-dev nome-do-pacote

# Remover dependência
npm uninstall nome-do-pacote

# Atualizar todas as dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

---

## 🔐 VARIÁVEIS DE AMBIENTE

```bash
# Copiar exemplo
cp .env.example .env

# Editar variáveis (use seu editor preferido)
nano .env
# ou
code .env
```

---

## 📊 ANÁLISE DE BUILD

```bash
# Ver tamanho do build
npm run build
du -sh dist/

# Ver tamanho detalhado
du -sh dist/*

# Contar arquivos
find dist -type f | wc -l
```

---

## 🌐 NETLIFY CLI (Opcional)

```bash
# Instalar globalmente
npm install -g netlify-cli

# Login
netlify login

# Inicializar site
netlify init

# Deploy de teste
netlify deploy

# Deploy de produção
netlify deploy --prod

# Abrir dashboard
netlify open

# Ver logs
netlify logs
```

---

## 🔄 GIT - COMANDOS ÚTEIS

```bash
# Ver status
git status

# Ver histórico
git log --oneline

# Criar nova branch
git checkout -b nome-da-branch

# Voltar para main
git checkout main

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer mudanças em arquivo
git checkout -- nome-do-arquivo

# Ver diferenças
git diff

# Ver branches
git branch -a
```

---

## 📝 SCRIPTS PERSONALIZADOS

Adicione ao `package.json` se quiser:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "clean": "rm -rf dist node_modules",
  "reinstall": "npm run clean && npm install",
  "deploy": "npm run build && netlify deploy --prod"
}
```

Depois use:
```bash
npm run clean
npm run reinstall
npm run deploy
```

---

## ⚡ ATALHOS ÚTEIS

### Durante desenvolvimento:

| Comando | Ação |
|---------|------|
| `Ctrl + C` | Parar servidor dev |
| `r` | Reload manual (no terminal do Vite) |
| `u` | Mostrar URL do servidor |
| `o` | Abrir no navegador |
| `q` | Sair |

---

## 🎯 WORKFLOW DIÁRIO

```bash
# 1. Abrir projeto
cd caminho/para/projeto

# 2. Atualizar do GitHub (se usar)
git pull

# 3. Iniciar dev
npm run dev

# 4. Fazer alterações...

# 5. Testar build
npm run build
npm run preview

# 6. Commit (se usar Git)
git add .
git commit -m "Mensagem"
git push

# 7. Parar servidor
Ctrl + C
```

---

## 📞 COMANDOS DE SUPORTE

```bash
# Ver versões instaladas
npm ls react react-dom vite

# Limpar cache do npm
npm cache clean --force

# Verificar saúde do projeto
npm doctor

# Ver documentação de um pacote
npm docs nome-do-pacote
```

---

## ✅ CHECKLIST PRÉ-DEPLOY

Execute estes comandos antes de fazer deploy:

```bash
# 1. Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install

# 2. Verificar build
npm run build

# 3. Testar localmente
npm run preview
# Abrir http://localhost:4173 e testar

# 4. Verificar tamanho
du -sh dist/

# 5. Se tudo OK, fazer deploy!
```

---

## 🔗 LINKS ÚTEIS

- **Netlify Drop**: https://app.netlify.com/drop
- **Netlify Dashboard**: https://app.netlify.com
- **GitHub**: https://github.com
- **Google Search Console**: https://search.google.com/search-console
- **Google My Business**: https://business.google.com

---

## 📌 LEMBRETE

Mantenha este arquivo aberto enquanto trabalha no projeto!

**Dúvidas?** Consulte os guias completos:
- `LEIA-ME.md` - Guia completo
- `DEPLOY_GUIDE.md` - Deploy detalhado
- `CHECKLIST_DEPLOY.md` - Verificação

---

**Bom trabalho! 🚀**
