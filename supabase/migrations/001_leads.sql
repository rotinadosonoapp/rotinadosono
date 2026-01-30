-- Tabela de leads para o site Rotina do Sono
-- Execute no Supabase: SQL Editor > New query > colar e Run

create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  name text,
  source text default 'site',
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Permite inserção anônima (site público)
create policy "Permitir insert anonimo"
  on public.leads
  for insert
  to anon
  with check (true);

-- Apenas autenticados podem ler (opcional)
create policy "Leitura para autenticados"
  on public.leads
  for select
  to authenticated
  using (true);
