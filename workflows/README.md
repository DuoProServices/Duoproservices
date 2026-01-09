# GitHub Actions Workflows

## 📁 Workflows Disponíveis

### `deploy.yml`
Deploy automático da Edge Function "server" para o Supabase.

**Quando roda:**
- Automaticamente a cada push na branch `main`
- Manualmente através do GitHub Actions UI

**Configuração necessária:**
1. Adicionar secret `SUPABASE_ACCESS_TOKEN` no GitHub
   - Vá para: Settings > Secrets and variables > Actions
   - New repository secret
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: [token do Supabase]

**Como pegar o token:**
1. Acesse: https://supabase.com/dashboard/account/tokens
2. Generate New Token
3. Copie e adicione nos secrets

**Como executar manualmente:**
1. Vá para: Actions > Deploy to Supabase
2. Clique em "Run workflow"
3. Aguarde ~2 minutos

**Deploy inclui:**
- Edge Function "server" com todas as rotas
- Flag `--no-verify-jwt` para autenticação customizada
- Arquivo `.edge-config.json` para configuração adicional
