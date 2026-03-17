/**
 * Configurações do site - URLs externas
 *
 * Para obter o link Hotmart:
 * 1. Acesse app.hotmart.com e faça login
 * 2. Vá em Produtos > seu produto > Página de vendas
 * 3. Copie o "Link de vendas" (ex: https://pay.hotmart.com/XXXXXXXXX)
 *
 * Defina no .env (ou na Vercel > Settings > Environment Variables):
 *   VITE_HOTMART_URL = link do produto Essencial (R$ 200)
 *   VITE_HOTMART_URL_COMPLETO = link do produto Completo (R$ 400)
 * Se não definir, usam os valores padrão abaixo.
 */
const ESSENCIAL_DEFAULT = "https://go.hotmart.com/E104882583R";
const COMPLETO_DEFAULT = "https://go.hotmart.com/T1048828320";

export const HOTMART_URL = import.meta.env.VITE_HOTMART_URL || ESSENCIAL_DEFAULT;
export const HOTMART_URL_COMPLETO = import.meta.env.VITE_HOTMART_URL_COMPLETO || COMPLETO_DEFAULT;
