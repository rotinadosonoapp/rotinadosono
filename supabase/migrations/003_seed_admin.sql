-- ============================================
-- Criar administrador geral (veja CRIAR_ADMIN_FACIL.md)
-- ============================================
-- PASSO 1: Dashboard > Authentication > Users > Add user
--   Email: rotinadosono.app@gmail.com
--   Password: Sonho@2025@mil  |  Marque "Auto Confirm User"
-- PASSO 2: Execute o SQL abaixo (SQL Editor)
-- ============================================

UPDATE public.profiles
SET role = 'admin', plan = 'premium', updated_at = now()
WHERE email = 'rotinadosono.app@gmail.com';

-- Se não existir perfil ainda (usuário criado há pouco), o trigger já criou.
-- Este UPDATE garante que seja admin.
