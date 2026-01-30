# Área do Aluno + Painel Admin - Setup

## Visão Geral

Sistema implementado:
- **Login/Cadastro** com e-mail e senha
- **Área do Aluno** (`/dashboard`) - cursos, progresso, pagamentos
- **Painel Admin** (`/admin`) - gerenciar usuários, cursos, aulas e pagamentos
- **Controle de Acesso** por tempo (expiração)
- **RLS** no Supabase para segurança

---

## 1. Configuração do Supabase

### 1.1 Executar Migrations

No **Supabase Dashboard → SQL Editor**:

1. Crie uma nova query
2. Cole o conteúdo de `supabase/migrations/002_auth_and_admin.sql`
3. Clique em **Run**

Isso cria todas as tabelas, funções e políticas de segurança.

### 1.2 Criar Administrador Geral

**Admin padrão:** rotinadosono.app@gmail.com

1. No **Supabase Dashboard** → **Authentication** → **Users** → **Add user**
   - Email: `rotinadosono.app@gmail.com`
   - Password: `Somo@2025@mil`
   - Clique em **Create user**

2. No **SQL Editor**, execute o conteúdo de `supabase/migrations/003_seed_admin.sql` (ou rode):

```sql
UPDATE public.profiles SET role = 'admin', plan = 'premium' WHERE email = 'rotinadosono.app@gmail.com';
```

3. Faça login no site em `/login` com esse e-mail e senha.

**Para outro admin:** crie a conta pelo site (`/cadastro`) e depois execute no SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'seu-email@exemplo.com';
```

---

## 2. Rotas do Sistema

### Públicas
- `/` - Landing page
- `/login` - Login
- `/cadastro` - Criar conta
- `/forgot-password` - Recuperar senha

### Área do Aluno (requer login)
- `/dashboard` - Home do aluno
- `/dashboard/courses` - Lista de cursos
- `/dashboard/courses/:id` - Conteúdo do curso
- `/dashboard/billing` - Pagamentos
- `/dashboard/profile` - Perfil

### Painel Admin (requer role=admin)
- `/admin` - Dashboard
- `/admin/users` - Gerenciar usuários
- `/admin/courses` - Gerenciar cursos
- `/admin/courses/:id/lessons` - Gerenciar aulas
- `/admin/payments` - Gerenciar pagamentos

---

## 3. Funcionalidades do Admin

### Usuários
- Ver lista de todos os usuários
- Editar nome, tipo (admin/aluno), plano
- Enviar e-mail de reset de senha
- Estender acesso (+30, +90, +365 dias)

### Cursos
- CRUD completo (criar, editar, excluir)
- Campos: título, descrição, capa, publicado
- Ver e gerenciar aulas de cada curso

### Aulas
- CRUD completo
- Tipos: vídeo, PDF, texto, link
- Ordenação
- Marcar como gratuita

### Pagamentos
- Criar pagamento manual
- Marcar como pago (libera acesso automaticamente)
- Ver histórico

---

## 4. Controle de Acesso

### Como funciona
1. Admin cria um **pagamento** para o usuário
2. Admin marca como **pago**
3. Sistema automaticamente:
   - Atualiza plano do usuário
   - Cria/renova matrículas em todos os cursos publicados
   - Define data de expiração

### Expiração
- Aluno vê aviso quando faltam 7 dias
- Após expirar, conteúdo é bloqueado
- Admin pode estender manualmente

---

## 5. Arquivos Criados

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx   # Proteção de rotas
│   └── layouts/
│       ├── AdminLayout.tsx      # Layout do admin
│       └── DashboardLayout.tsx  # Layout do aluno
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Cadastro.tsx
│   │   └── ForgotPassword.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── AdminCourses.tsx
│   │   ├── AdminLessons.tsx
│   │   └── AdminPayments.tsx
│   └── dashboard/
│       ├── DashboardHome.tsx
│       ├── DashboardCourses.tsx
│       ├── DashboardCourseDetail.tsx
│       ├── DashboardBilling.tsx
│       └── DashboardProfile.tsx
├── lib/
│   └── api.ts                   # Serviços de API
└── types/
    └── database.ts              # Tipos TypeScript

supabase/
└── migrations/
    └── 002_auth_and_admin.sql   # Tabelas + RLS
```

---

## 6. Variáveis de Ambiente

Já configuradas no `.env`:

```env
VITE_SUPABASE_URL=https://eneylhffdcgkllhvziay.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave
```

Na **Vercel**, adicionar as mesmas variáveis.

---

## 7. TODO Futuro

- [ ] Integrar Stripe/MercadoPago (webhooks)
- [ ] Upload de arquivos no Supabase Storage
- [ ] Notificações por e-mail (expiração próxima)
- [ ] Dashboard com métricas avançadas
- [ ] Certificados de conclusão

---

## Suporte

Em caso de dúvidas: contato@rotinadosono.com.br
