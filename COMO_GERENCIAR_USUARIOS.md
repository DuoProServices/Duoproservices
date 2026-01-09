# 🧑‍💼 Como Adicionar e Gerenciar Usuários no Sistema

## 📋 Visão Geral

O sistema de gestão de usuários permite que você adicione membros da equipe, controle permissões por módulo e delegue declarações fiscais. Este guia mostra exatamente como usar todas as funcionalidades.

---

## 🎯 Como Acessar a Gestão de Usuários

### Passo 1: Acesse o Admin Hub
1. Faça login como administrador
2. Vá para `/admin` (Admin Hub)
3. Clique no card **"User Management"** com o ícone de usuários roxo

### Passo 2: Veja a Dashboard de Usuários
Você verá 3 cards de estatísticas:
- **Total Users**: Número total de usuários no sistema
- **Active Users**: Usuários ativos (podem acessar o sistema)
- **Admins**: Quantos usuários têm privilégios de administrador

---

## ➕ Como Adicionar um Novo Usuário

### Método Recomendado: Via Interface de User Management ✨

**Este é o método mais simples e rápido!**

1. **Acesse User Management**:
   - Vá para `/admin` (Admin Hub)
   - Clique em "User Management"

2. **Clique no botão "Add User"** (roxo, no canto superior direito)

3. **Preencha o formulário**:
   - **Name**: Nome completo do usuário (ex: "Maria Santos")
   - **Email**: Email profissional (ex: "maria@taxfirm.ca")
   - **Password**: Senha com no mínimo 6 caracteres (ex: "Senha123!")
   - **Role**: Escolha entre Admin, Accountant ou Viewer
   - **Module Access**: Selecione os módulos que o usuário pode acessar
   - **Status**: Active (usuário pode fazer login) ou Inactive

4. **Clique em "Add User"**

5. **Pronto!** O usuário foi criado e já pode fazer login com o email e senha

**⚠️ IMPORTANTE**: 
- O email é confirmado automaticamente (não precisa de verificação)
- O usuário pode fazer login imediatamente após criação
- Envie as credenciais para o novo usuário de forma segura

### Método Alternativo 1: Via Signup Normal (Para Clientes)
```
1. O usuário acessa /signup
2. Preenche: nome, email, senha
3. Sistema cria conta automaticamente
4. Email é confirmado automaticamente (sem necessidade de email server)
5. Usuário recebe permissões padrão de "viewer"
```

### Método Alternativo 2: Via Supabase Auth Admin (Para Membros da Equipe)

**IMPORTANTE**: Para adicionar membros da equipe com permissões especiais, você precisa criá-los via código no backend:

```typescript
// Em /supabase/functions/server/index.tsx ou em um novo endpoint

// Criar novo usuário
const { data: newUser, error } = await supabase.auth.admin.createUser({
  email: 'joao@taxfirm.ca',
  password: 'senha-temporaria-123',
  user_metadata: { 
    name: 'João Silva',
    role: 'accountant' // Definir role inicial
  },
  email_confirm: true // Auto-confirma email
});

// O sistema criará automaticamente as permissões quando o usuário fizer login
```

### Método Alternativo 3: Usando o Console do Supabase

1. Acesse o Supabase Dashboard: https://supabase.com
2. Selecione seu projeto
3. Vá para **Authentication > Users**
4. Clique em **"Add User"**
5. Preencha:
   - Email: `maria@taxfirm.ca`
   - Password: `senha-temporaria`
   - Auto Confirm User: ✅ **Marque esta opção**
6. Clique em **"Create User"**

**⚠️ IMPORTANTE**: Depois de criar o usuário no Supabase:
1. O usuário deve fazer login pela primeira vez
2. O sistema criará automaticamente as permissões padrão
3. Você pode então editar as permissões na página de User Management

---

## 🔐 Tipos de Roles (Papéis)

### 1. **Admin** (Administrador)
- ✅ Acesso total ao sistema
- ✅ Pode gerenciar todos os módulos
- ✅ Pode editar permissões de outros usuários
- ✅ Acesso automático ao módulo "User Management"
- 💡 Use para: Proprietário da empresa, gerente geral

### 2. **Accountant** (Contador/Fiscalista)
- ✅ Acessa módulos específicos atribuídos
- ✅ Pode gerenciar declarações fiscais
- ✅ Pode fazer upload de documentos
- ❌ Não pode gerenciar usuários (a menos que você dê permissão explícita)
- 💡 Use para: Contadores, fiscalistas, preparadores de impostos

### 3. **Viewer** (Visualizador)
- ✅ Acesso apenas para visualização
- ✅ Pode ver relatórios e dashboards
- ❌ Não pode editar ou criar novos dados
- 💡 Use para: Assistentes, estagiários, auditores

---

## 🎛️ Módulos Disponíveis

Você pode dar acesso granular a cada módulo:

| Módulo | Descrição | Ideal Para |
|--------|-----------|-----------|
| **Dashboard** | Visão geral e analytics | Todos |
| **Customers** | Gerenciar clientes e declarações | Contadores, Admins |
| **Bookkeeping** | Controle de despesas e recibos | Contadores financeiros |
| **Financial** | Relatórios financeiros e receita | Admins, CFO |
| **Marketing** | Ferramentas de marketing e conteúdo | Marketing, Admins |
| **Users** | Gestão de equipe (apenas Admin) | Admins apenas |

---

## ✏️ Como Editar Permissões de um Usuário

### Passo a Passo Visual:

1. **Localize o usuário** na tabela de usuários
2. **Clique no botão "Edit"** (ícone de lápis) na linha do usuário
3. **Aparecerá um diálogo** com 3 seções:

#### Seção 1: Role (Papel)
```
[ Admin ] [ Accountant ] [ Viewer ]
```
- Clique em um dos três cards para selecionar o papel

#### Seção 2: Module Access (Acesso aos Módulos)
```
✅ Dashboard - General overview and analytics
✅ Customers - Manage clients and tax filings
✅ Bookkeeping - Track expenses and invoices
⬜ Financial - Revenue and financial reports
✅ Marketing - Marketing tools and campaigns
⬜ User Management - Manage team and permissions (Admin only)
```
- Clique em cada módulo para ativar/desativar (toggle)
- Módulos com ✅ estão ativos
- **Nota**: Se o usuário for Admin, User Management é ativado automaticamente

#### Seção 3: Status
```
✅ Active - User can access the system
```
ou
```
⬜ Inactive - User is blocked from accessing
```
- Clique para alternar entre Ativo/Inativo
- Usuários inativos não podem fazer login

4. **Clique em "Save Changes"** para aplicar

---

## 📊 Como Delegar Declarações Fiscais

### Opção 1: Delegar do Admin Clients Page

1. Vá para `/admin/clients`
2. Clique em um cliente
3. Na página de detalhes do cliente, você verá as declarações fiscais
4. Clique no botão **"Assign"** ao lado da declaração
5. Selecione o usuário para quem deseja delegar
6. Clique em **"Assign Case"**

### Opção 2: Via API (Para automação)

```typescript
// Endpoint: POST /make-server-c2a25be0/cases/assign
{
  "clientId": "client-123",
  "year": 2024,
  "assignedTo": "user-id-do-contador"
}
```

### Transferir uma Declaração

Se precisar transferir uma declaração de um contador para outro:

```typescript
// Endpoint: POST /make-server-c2a25be0/cases/transfer
{
  "clientId": "client-123",
  "year": 2024,
  "fromUserId": "contador-atual-id",
  "toUserId": "novo-contador-id",
  "reason": "Férias / Sobrecarga / Especialização"
}
```

**Histórico de Transferência**: O sistema mantém um registro completo de todas as transferências.

---

## 📈 Visualizando Estatísticas de Usuários

Na página de User Management, você vê para cada usuário:

### Na Tabela Principal:
- **Nome e Email**
- **Role**: Badge colorido (Admin=roxo, Accountant=azul, Viewer=cinza)
- **Status**: Ativo (verde) ou Inativo (cinza)
- **Módulos**: Primeiros 3 módulos + contador de mais módulos
- **Cases**: Número total de declarações atribuídas

### Estatísticas Detalhadas (via API):

```typescript
// Endpoint: GET /make-server-c2a25be0/productivity?period=month

// Retorna para cada usuário:
{
  "userId": "user-123",
  "name": "João Silva",
  "email": "joao@taxfirm.ca",
  "totalCases": 15,           // Total de declarações atribuídas
  "completedCases": 10,       // Declarações completadas
  "inProgressCases": 3,       // Em andamento
  "pendingCases": 2,          // Pendentes
  "revenue": 2500.00,         // Receita gerada (CAD)
  "avgCompletionTime": 5,     // Tempo médio em dias
  "recentCases": [...]        // 5 casos mais recentes
}
```

**Períodos disponíveis**:
- `week`: Última semana
- `month`: Mês atual (padrão)
- `year`: Ano atual

---

## 🔍 Exemplos Práticos

### Exemplo 1: Adicionar um Novo Contador

**Cenário**: Você contratou Maria como contadora e ela vai trabalhar com declarações pessoais.

1. **Criar usuário no Supabase** (via console ou código):
   ```typescript
   email: 'maria@taxfirm.ca'
   password: 'Senha@Temp123'
   name: 'Maria Santos'
   ```

2. **Maria faz login** pela primeira vez em `/login`

3. **Você edita as permissões**:
   - Role: **Accountant**
   - Módulos: 
     - ✅ Dashboard
     - ✅ Customers
     - ❌ Bookkeeping
     - ❌ Financial
     - ❌ Marketing
     - ❌ Users
   - Status: **Active**

4. **Delegar declarações** para Maria:
   - Vá em `/admin/clients`
   - Para cada cliente que Maria vai atender, clique em "Assign"
   - Selecione "Maria Santos"

### Exemplo 2: Dar Acesso Temporário a um Estagiário

**Cenário**: Pedro é estagiário e só pode visualizar relatórios.

1. Criar usuário: `pedro@taxfirm.ca`
2. Role: **Viewer**
3. Módulos:
   - ✅ Dashboard (só visualização)
   - ✅ Customers (só visualização)
   - ❌ Outros módulos
4. Status: **Active**

**Quando o estágio acabar**:
- Vá em User Management
- Clique em "Edit" no Pedro
- Mude Status para **Inactive**
- Pedro não conseguirá mais fazer login

### Exemplo 3: Promover um Contador a Admin

**Cenário**: João se tornou gerente e precisa de acesso total.

1. Encontre João na lista de usuários
2. Clique em "Edit"
3. Mude Role de **Accountant** para **Admin**
4. Observe que todos os módulos são ativados automaticamente
5. Clique em "Save Changes"
6. João agora tem acesso total ao sistema

---

## 🛡️ Segurança e Boas Práticas

### ✅ DO (Faça):
- Use senhas fortes para todos os usuários
- Revise permissões regularmente (mensal)
- Desative usuários inativos imediatamente
- Use role "Viewer" para novos membros inicialmente
- Mantenha o mínimo de Admins necessário
- Documente quem tem acesso a quê

### ❌ DON'T (Não Faça):
- Não compartilhe senhas entre usuários
- Não dê permissões de Admin sem necessidade
- Não deixe usuários inativos como "Active"
- Não esqueça de revogar acesso de ex-funcionários
- Não use a mesma senha para múltiplos usuários

---

## 🔧 Solução de Problemas

### Problema: Novo usuário não aparece na lista

**Solução**:
1. Verifique se o usuário foi criado no Supabase Auth
2. Certifique-se de que o usuário fez login pelo menos uma vez
3. Atualize a página (F5)
4. Verifique o console do navegador para erros

### Problema: Não consigo editar permissões

**Solução**:
1. Verifique se você está logado como Admin
2. Confirme que tem permissão no módulo "users"
3. Verifique conexão com o backend
4. Veja logs do servidor em `/supabase/functions/server/`

### Problema: Usuário não consegue acessar módulo após dar permissão

**Solução**:
1. Usuário deve fazer logout e login novamente
2. As permissões são carregadas no login
3. Verifique se salvou as mudanças (botão "Save Changes")
4. Confirme que o usuário está "Active"

### Problema: Cases atribuídos não aparecem para o usuário

**Solução**:
1. Verifique se o `assignedTo` está correto no banco
2. Confirme que o userId corresponde ao ID correto
3. O usuário precisa ter permissão no módulo "Customers"
4. Recarregue a página do cliente

---

## 📞 API Reference (Para Desenvolvedores)

### Listar todos os usuários
```
GET /make-server-c2a25be0/users/list
```

### Obter permissões de um usuário
```
GET /make-server-c2a25be0/users/permissions/:userId
```

### Atualizar permissões
```
PUT /make-server-c2a25be0/users/permissions/:userId
Body: {
  "role": "accountant",
  "modules": ["dashboard", "customers"],
  "isActive": true
}
```

### Atribuir declaração
```
POST /make-server-c2a25be0/cases/assign
Body: {
  "clientId": "client-123",
  "year": 2024,
  "assignedTo": "user-id"
}
```

### Transferir declaração
```
POST /make-server-c2a25be0/cases/transfer
Body: {
  "clientId": "client-123",
  "year": 2024,
  "fromUserId": "user-from",
  "toUserId": "user-to",
  "reason": "Motivo da transferência"
}
```

### Obter estatísticas de produtividade
```
GET /make-server-c2a25be0/productivity?period=month
```

---

## 🎨 Estrutura de Dados

### UserPermissions
```typescript
{
  userId: string;              // ID único do usuário
  email: string;               // Email do usuário
  name: string;                // Nome completo
  role: 'admin' | 'accountant' | 'viewer';
  modules: string[];           // Array de módulos permitidos
  isActive: boolean;           // Se o usuário pode acessar o sistema
  createdAt: string;           // Data de criação (ISO 8601)
  updatedAt: string;           // Última atualização (ISO 8601)
}
```

### UserWithPermissions (na lista)
```typescript
{
  ...UserPermissions,
  casesCount: number;          // Total de casos atribuídos
  pendingCases: number;        // Casos pendentes
  completedCases: number;      // Casos completados
}
```

---

## 🚀 Próximos Passos

Depois de dominar a gestão de usuários, explore:

1. **Admin Productivity Dashboard** (`/admin/productivity`) - Ver métricas de equipe
2. **Assign Cases em Batch** - Atribuir múltiplas declarações de uma vez
3. **Relatórios de Performance** - Comparar produtividade entre contadores
4. **Notificações por Email** - Avisar usuários sobre novas atribuições

---

## 📝 Resumo Rápido

```
✅ Criar usuário → Supabase Console ou Signup
✅ Primeiro login → Permissões padrão criadas
✅ Editar role → Admin / Accountant / Viewer
✅ Selecionar módulos → Dashboard, Customers, etc.
✅ Ativar/Desativar → Status Active/Inactive
✅ Delegar casos → Assign/Transfer
✅ Ver estatísticas → Cases, revenue, completion time
```

**Dica**: Sempre comece com permissões mínimas e vá aumentando conforme necessário!

---

## 💡 Precisa de Ajuda?

Se tiver dúvidas ou problemas:
1. Verifique os logs do servidor em `/supabase/functions/server/`
2. Veja o console do navegador (F12)
3. Confirme que as variáveis de ambiente estão configuradas
4. Revise este guia novamente

**Bom gerenciamento! 🎉**