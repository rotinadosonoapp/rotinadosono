# Criar admin do site em 2 passos (modo fácil)

Sem terminal, sem script. Só pelo painel do Supabase.

---

## Passo 1 – Criar o usuário

1. Abra o **Supabase**: [supabase.com/dashboard](https://supabase.com/dashboard) → seu projeto **Rotina do Sono**.
2. No menu lateral: **Authentication** → **Users**.
3. Clique no botão verde **Add user**.
4. Preencha:
   - **Email:** `rotinadosono.app@gmail.com`
   - **Password:** `Sonho@2025@mil`
   - Marque **Auto Confirm User** (para não precisar confirmar e-mail).
5. Clique em **Create user**.

---

## Passo 2 – Virar admin

1. No menu lateral: **SQL Editor**.
2. Clique em **New query**.
3. Cole exatamente este SQL:

```sql
UPDATE public.profiles
SET role = 'admin', plan = 'premium', updated_at = now()
WHERE email = 'rotinadosono.app@gmail.com';
```

4. Clique em **Run** (ou Ctrl+Enter).
5. Deve aparecer algo como: **Success** ou **1 row updated**.

---

## Pronto

- Acesse seu site (ex.: rotinadosono.vercel.app).
- Clique em **Entrar** ou vá em `/login`.
- Login: `rotinadosono.app@gmail.com` | Senha: `Sonho@2025@mil`
- Depois do login, acesse **Admin** ou `/admin` para gerenciar o site e o portal.

---

**Outro e-mail como admin?** Crie o usuário no Passo 1 com o e-mail desejado e no Passo 2 troque no SQL `'rotinadosono.app@gmail.com'` pelo novo e-mail.
