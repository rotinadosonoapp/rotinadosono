/**
 * Configurações do site - URLs externas
 *
 * Para obter o link Hotmart:
 * 1. Acesse app.hotmart.com e faça login
 * 2. Vá em Produtos > seu produto > Página de vendas
 * 3. Copie o "Link de vendas" (ex: https://pay.hotmart.com/XXXXXXXXX)
 *
 * Defina no .env:
 *   VITE_HOTMART_URL = link do produto Essencial (Guia em PDF)
 *   VITE_HOTMART_URL_COMPLETO = link do produto Completo (com acompanhamento)
 * Se tiver só um produto, use o mesmo link nas duas variáveis.
 */
export const HOTMART_URL = import.meta.env.VITE_HOTMART_URL || "";
export const HOTMART_URL_COMPLETO = import.meta.env.VITE_HOTMART_URL_COMPLETO || import.meta.env.VITE_HOTMART_URL || "";
