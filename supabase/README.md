# Supabase – Rotina do Sono

Projeto: **eneylhffdcgkllhvziay**  
URL: https://eneylhffdcgkllhvziay.supabase.co

---

## 1. Variáveis de Ambiente

No arquivo `.env` (já configurado):

```env
VITE_SUPABASE_URL=https://eneylhffdcgkllhvziay.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

Para obter a chave anon:  
**Supabase Dashboard** → Project Settings → API → **anon public**

---

## 2. Executar Migrations

No **Supabase Dashboard → SQL Editor**, execute na ordem:

### Migration 001 (Leads)
Arquivo: `migrations/001_leads.sql`

### Migration 002 (Auth + Admin - PRINCIPAL)
Arquivo: `migrations/002_auth_and_admin.sql`

Esta migration cria:
- **profiles** - Perfis de usuários (admin/aluno)
- **courses** - Cursos
- **lessons** - Aulas
- **enrollments** - Matrículas
- **lesson_progress** - Progresso
- **payments** - Pagamentos
- Funções auxiliares (`is_admin()`, `process_payment()`)
- Políticas RLS
- Trigger para criar profile no signup

---

## 3. Criar Primeiro Admin

Após executar as migrations e criar uma conta:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'seu-email@exemplo.com';
```

---

## 4. Tabelas e Estrutura

| Tabela | Descrição |
|--------|-----------|
| profiles | Perfis (admin/aluno, plano) |
| courses | Cursos |
| lessons | Aulas de cada curso |
| enrollments | Matrículas + expiração |
| lesson_progress | Progresso do aluno |
| payments | Pagamentos (manual/gateway) |
| leads | Newsletter do site |

---

## 5. Uso no Código

```typescript
// Cliente Supabase
import { supabase } from "@/lib/supabase"

// API completa
import { auth, profiles, courses, lessons, enrollments, payments } from "@/lib/api"

// Contexto de autenticação
import { useAuth } from "@/contexts/AuthContext"
```

---

## 6. RLS (Row Level Security)

- **Aluno**: só vê/edita seus próprios dados
- **Admin**: acesso total via função `is_admin()`
- Role validada no banco, não no client

---

## TODO: Integração com Gateway

Preparado para Stripe/MercadoPago:
1. Criar webhook endpoint
2. Receber evento de pagamento confirmado
3. Chamar `process_payment(payment_id)` para liberar acesso
