-- ============================================
-- ROTINA DO SONO - Área do Aluno + Admin
-- Migration: Tabelas, RLS e Funções
-- Execute no Supabase: SQL Editor > New query
-- ============================================

-- 1) PROFILES (vinculado ao auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  role text not null default 'aluno' check (role in ('admin', 'aluno')),
  plan text default 'basic' check (plan in ('basic', 'premium')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) COURSES (cursos)
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_url text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3) LESSONS (aulas)
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  content_type text not null default 'video' check (content_type in ('video', 'pdf', 'text', 'link')),
  content_url text,
  duration_minutes int,
  order_index int not null default 0,
  is_free boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4) ENROLLMENTS (matrículas)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  access_expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_id)
);

-- 5) LESSON_PROGRESS (progresso das aulas)
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- 6) PAYMENTS (pagamentos)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'manual' check (provider in ('manual', 'stripe', 'mercadopago')),
  plan text not null default 'basic' check (plan in ('basic', 'premium')),
  amount numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  reference_id text,
  days_to_add int default 30,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ÍNDICES
-- ============================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_enrollments_user on public.enrollments(user_id);
create index if not exists idx_enrollments_status on public.enrollments(status);
create index if not exists idx_lessons_course on public.lessons(course_id);
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_status on public.payments(status);

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para verificar se usuário é admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Função para obter role do usuário atual
create or replace function public.get_my_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Função para criar profile automaticamente no signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'aluno'
  );
  return new;
end;
$$;

-- Trigger para criar profile no signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Função para processar pagamento (chamada pelo admin)
create or replace function public.process_payment(payment_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_payment record;
  v_days int;
  v_course_id uuid;
begin
  -- Verifica se é admin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem processar pagamentos';
  end if;

  -- Busca o pagamento
  select * into v_payment from public.payments where id = payment_id;
  
  if not found then
    raise exception 'Pagamento não encontrado';
  end if;

  -- Atualiza status do pagamento
  update public.payments
  set status = 'paid', paid_at = now(), updated_at = now()
  where id = payment_id;

  -- Atualiza plano do usuário
  update public.profiles
  set plan = v_payment.plan, updated_at = now()
  where id = v_payment.user_id;

  -- Adiciona/renova acesso em todos os cursos publicados
  v_days := coalesce(v_payment.days_to_add, 30);
  
  for v_course_id in select id from public.courses where is_published = true loop
    insert into public.enrollments (user_id, course_id, access_expires_at, status)
    values (
      v_payment.user_id,
      v_course_id,
      now() + (v_days || ' days')::interval,
      'active'
    )
    on conflict (user_id, course_id) do update set
      access_expires_at = greatest(
        coalesce(enrollments.access_expires_at, now()),
        now()
      ) + (v_days || ' days')::interval,
      status = 'active',
      updated_at = now();
  end loop;
end;
$$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.payments enable row level security;

-- ============================================
-- POLICIES: PROFILES
-- ============================================
drop policy if exists "Profiles: users can view own profile" on public.profiles;
create policy "Profiles: users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles: users can update own profile" on public.profiles;
create policy "Profiles: users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (
    -- Usuário comum não pode mudar role/plan
    (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()))
    or public.is_admin()
  );

drop policy if exists "Profiles: admin can insert" on public.profiles;
create policy "Profiles: admin can insert"
  on public.profiles for insert
  with check (public.is_admin() or auth.uid() = id);

drop policy if exists "Profiles: admin can delete" on public.profiles;
create policy "Profiles: admin can delete"
  on public.profiles for delete
  using (public.is_admin());

-- ============================================
-- POLICIES: COURSES
-- ============================================
drop policy if exists "Courses: anyone can view published" on public.courses;
create policy "Courses: anyone can view published"
  on public.courses for select
  using (is_published = true or public.is_admin());

drop policy if exists "Courses: admin can insert" on public.courses;
create policy "Courses: admin can insert"
  on public.courses for insert
  with check (public.is_admin());

drop policy if exists "Courses: admin can update" on public.courses;
create policy "Courses: admin can update"
  on public.courses for update
  using (public.is_admin());

drop policy if exists "Courses: admin can delete" on public.courses;
create policy "Courses: admin can delete"
  on public.courses for delete
  using (public.is_admin());

-- ============================================
-- POLICIES: LESSONS
-- ============================================
drop policy if exists "Lessons: enrolled users can view" on public.lessons;
create policy "Lessons: enrolled users can view"
  on public.lessons for select
  using (
    public.is_admin()
    or is_free = true
    or exists (
      select 1 from public.enrollments e
      where e.user_id = auth.uid()
        and e.course_id = lessons.course_id
        and e.status = 'active'
        and (e.access_expires_at is null or e.access_expires_at > now())
    )
  );

drop policy if exists "Lessons: admin can insert" on public.lessons;
create policy "Lessons: admin can insert"
  on public.lessons for insert
  with check (public.is_admin());

drop policy if exists "Lessons: admin can update" on public.lessons;
create policy "Lessons: admin can update"
  on public.lessons for update
  using (public.is_admin());

drop policy if exists "Lessons: admin can delete" on public.lessons;
create policy "Lessons: admin can delete"
  on public.lessons for delete
  using (public.is_admin());

-- ============================================
-- POLICIES: ENROLLMENTS
-- ============================================
drop policy if exists "Enrollments: users can view own" on public.enrollments;
create policy "Enrollments: users can view own"
  on public.enrollments for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Enrollments: admin can insert" on public.enrollments;
create policy "Enrollments: admin can insert"
  on public.enrollments for insert
  with check (public.is_admin());

drop policy if exists "Enrollments: admin can update" on public.enrollments;
create policy "Enrollments: admin can update"
  on public.enrollments for update
  using (public.is_admin());

drop policy if exists "Enrollments: admin can delete" on public.enrollments;
create policy "Enrollments: admin can delete"
  on public.enrollments for delete
  using (public.is_admin());

-- ============================================
-- POLICIES: LESSON_PROGRESS
-- ============================================
drop policy if exists "Progress: users can view own" on public.lesson_progress;
create policy "Progress: users can view own"
  on public.lesson_progress for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Progress: users can insert own" on public.lesson_progress;
create policy "Progress: users can insert own"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Progress: users can delete own" on public.lesson_progress;
create policy "Progress: users can delete own"
  on public.lesson_progress for delete
  using (auth.uid() = user_id or public.is_admin());

-- ============================================
-- POLICIES: PAYMENTS
-- ============================================
drop policy if exists "Payments: users can view own" on public.payments;
create policy "Payments: users can view own"
  on public.payments for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Payments: admin can insert" on public.payments;
create policy "Payments: admin can insert"
  on public.payments for insert
  with check (public.is_admin());

drop policy if exists "Payments: admin can update" on public.payments;
create policy "Payments: admin can update"
  on public.payments for update
  using (public.is_admin());

drop policy if exists "Payments: admin can delete" on public.payments;
create policy "Payments: admin can delete"
  on public.payments for delete
  using (public.is_admin());

-- ============================================
-- STORAGE BUCKET (opcional)
-- ============================================
-- Crie o bucket "content" no Supabase Dashboard > Storage
-- Ou descomente abaixo (requer extensão):
-- insert into storage.buckets (id, name, public)
-- values ('content', 'content', true)
-- on conflict do nothing;

-- ============================================
-- COMENTÁRIOS
-- ============================================
comment on table public.profiles is 'Perfis de usuários (admin/aluno)';
comment on table public.courses is 'Cursos disponíveis';
comment on table public.lessons is 'Aulas de cada curso';
comment on table public.enrollments is 'Matrículas dos alunos nos cursos';
comment on table public.lesson_progress is 'Progresso do aluno nas aulas';
comment on table public.payments is 'Pagamentos (manual ou gateway)';
