/**
 * Configurações do site - URLs externas
 *
 * Para obter o link Hotmart:
 * 1. Acesse app.hotmart.com e faça login
 * 2. Vá em Produtos > seu produto > Página de vendas
 * 3. Copie o "Link de vendas" (ex: https://pay.hotmart.com/XXXXXXXXX)
 *
 * Defina no .env (ou na Vercel > Settings > Environment Variables):
 *   VITE_HOTMART_URL = link do produto Essencial (R$ 219,90)
 *   VITE_HOTMART_URL_COMPLETO = link do produto Completo (R$ 519,90)
 *   VITE_HOTMART_URL_PREMIUM = link do Premium presencial (R$ 999,90) — opcional
 *   VITE_HOTMART_URL_DOMICILIAR = link do Domiciliar (R$ 1.499,90) — opcional
 * Se não definir Essencial/Completo, usam os valores padrão abaixo.
 * Premium e Domiciliar: podem ser sobrescritos por .env; senão usam os padrões abaixo.
 */
const ESSENCIAL_DEFAULT = "https://go.hotmart.com/E104882583R";
const COMPLETO_DEFAULT = "https://go.hotmart.com/T104882832O";
const PREMIUM_DEFAULT = "https://go.hotmart.com/M105317541S";
const DOMICILIAR_DEFAULT = "https://go.hotmart.com/W105317412A";

export const HOTMART_URL = import.meta.env.VITE_HOTMART_URL || ESSENCIAL_DEFAULT;
export const HOTMART_URL_COMPLETO = import.meta.env.VITE_HOTMART_URL_COMPLETO || COMPLETO_DEFAULT;
export const HOTMART_URL_PREMIUM =
  (import.meta.env.VITE_HOTMART_URL_PREMIUM as string | undefined)?.trim() || PREMIUM_DEFAULT;
export const HOTMART_URL_DOMICILIAR =
  (import.meta.env.VITE_HOTMART_URL_DOMICILIAR as string | undefined)?.trim() ||
  DOMICILIAR_DEFAULT;

/** E-mail para contato quando o plano ainda não tem link de checkout (ex.: presencial). */
export const SITE_CONTACT_EMAIL = "rotinadosono.app@gmail.com";
