-- ============================================
-- Criar administrador geral
-- ============================================
-- PASSO 1: Crie o usuário no Supabase Dashboard:
--   Authentication > Users > Add user
--   Email: rotinadosono.app@gmail.com
--   Password: Somo@2025@mil
--
-- PASSO 2: Execute este SQL (após o usuário existir)
-- ============================================

UPDATE public.profiles
SET role = 'admin', plan = 'premium', updated_at = now()
WHERE email = 'rotinadosono.app@gmail.com';

-- Se não existir perfil ainda (usuário criado há pouco), o trigger já criou.
-- Este UPDATE garante que seja admin.
