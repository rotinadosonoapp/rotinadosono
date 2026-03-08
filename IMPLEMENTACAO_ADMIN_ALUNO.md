# Implementação Admin vs Aluno - Rotina do Sono

## Diagnóstico do problema

O admin autenticava corretamente, mas o sistema:

1. **Redirecionava antes do profile carregar** – O `Login` fazia `navigate(from)` após 500ms, sem esperar o profile. O `isAdmin` ainda era `false` nesse momento.
2. **AuthContext definia `loading = false` cedo demais** – O `fetchProfile()` era chamado de forma assíncrona, mas `loading` era definido como `false` antes de terminar.
3. **Admin via layout de aluno** – Com `isAdmin` incorreto, o `PublicOnlyRoute` redirecionava para `/dashboard` em vez de `/admin`.
4. **Sem distinção de rotas por role** – Admin podia acessar `/dashboard` e ver "Área do Aluno".

---

## Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/contexts/AuthContext.tsx` | `loading` só vira `false` após profile carregar; `isStudent`, `displayName`; `fetchProfile` aguardado em `SIGNED_IN` |
| `src/components/auth/ProtectedRoute.tsx` | Admin em rota de aluno → redirect para `/admin` |
| `src/pages/auth/Login.tsx` | Removido `navigate` manual; redirect feito pelo `PublicOnlyRoute` |
| `src/components/layouts/AdminLayout.tsx` | Título "Painel Administrativo"; menu "Alunos", "Pedidos/Pagamentos"; uso de `displayName` |
| `src/components/layouts/DashboardLayout.tsx` | Uso de `displayName` |
| `src/pages/dashboard/DashboardHome.tsx` | Uso de `displayName` |
| `src/pages/admin/AdminUsers.tsx` | Filtro por alunos; busca; botão "Cadastrar aluno"; diálogo de cursos (liberar/revogar) |
| `src/lib/api.ts` | `enrollments.grantCourse`, `enrollments.revokeCourse`; `admin.createStudentViaApi`; `admin.getStats` tenta RPC `admin_dashboard_metrics` |
| `src/types/database.ts` | `Profile.full_name` opcional |
| `src/App.tsx` | Rota `/reset-password` |
| `api/create-student.ts` | **Novo** – API serverless para cadastro seguro de aluno |
| `src/pages/auth/ResetPassword.tsx` | **Novo** – Página para definir senha após convite/reset |

---

## Variáveis de ambiente

### Frontend (.env)

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### API / Vercel (para cadastro de aluno)

No Vercel: **Project Settings > Environment Variables**

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` ou `SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` ou `SUPABASE_ANON_KEY` | Chave anônima (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service_role (secret) – **nunca no frontend** |

---

## Instruções de teste

### 1. Login admin

1. Acesse `/login`
2. Faça login com usuário admin
3. Aguarde o carregamento (spinner)
4. Deve redirecionar para `/admin` com layout "Painel Administrativo"

### 2. Login aluno

1. Acesse `/login`
2. Faça login com usuário aluno
3. Deve redirecionar para `/dashboard` com layout "Área do Aluno"

### 3. Proteção de rotas

- Aluno em `/admin` → redirect para `/dashboard`
- Admin em `/dashboard` → redirect para `/admin`

### 4. Cadastro de aluno (admin)

1. Login como admin
2. Vá em **Alunos**
3. Clique em **Cadastrar aluno**
4. Preencha nome, e-mail e selecione cursos
5. Clique em **Cadastrar**
6. O aluno recebe e-mail de convite para definir senha

### 5. Liberar/revogar curso

1. Em **Alunos**, clique no ícone de livro (Cursos) de um aluno
2. Veja os cursos liberados
3. Use **Revogar** (X) para remover acesso
4. Use o select + **Liberar** para adicionar novo curso

### 6. Dashboard do aluno

- Exibe cursos reais via `enrollments.getMyEnrollments()` e `getMyCoursesWithProgress()`
- Nome exibido vem de `profile.name` ou `profile.full_name`

---

## API de cadastro de aluno

**Endpoint:** `POST /api/create-student`

**Headers:** `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "name": "Nome do Aluno",
  "email": "aluno@email.com",
  "courseIds": ["uuid-curso-1", "uuid-curso-2"]
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "userId": "uuid",
  "message": "Aluno cadastrado. Convite enviado por e-mail para definir senha."
}
```

**Desenvolvimento local:** use `vercel dev` para rodar frontend + API juntos.

---

## RPC opcional

Se existir a função `admin_dashboard_metrics()` no Supabase, o painel admin usa seus dados. Caso contrário, usa as consultas diretas atuais.
