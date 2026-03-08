/**
 * Cria o usuário admin no Supabase (Auth + perfil admin).
 * Use a Service Role Key em .env (nunca commite essa chave).
 *
 * Como rodar:
 *   1. No Supabase: Settings > API > copie "service_role" (secret).
 *   2. No .env na raiz do projeto adicione:
 *      VITE_SUPABASE_URL=https://eneylhffdcgkllhvziay.supabase.co
 *      SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
 *   3. Na pasta do projeto: node scripts/create-admin-user.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env");

if (existsSync(envPath)) {
  const env = readFileSync(envPath, "utf8");
  env.split("\n").forEach((line) => {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Erro: defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env ou no ambiente."
  );
  console.error(
    "Service Role Key: Supabase Dashboard > Settings > API > service_role (secret)"
  );
  process.exit(1);
}

const ADMIN_EMAIL = "rotinadosono.app@gmail.com";
const ADMIN_PASSWORD = "Sonho@2025@mil";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("Criando usuário admin:", ADMIN_EMAIL);

  const { data: userData, error: createError } =
    await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: "Admin Rotina do Sono" },
    });

  if (createError) {
    if (createError.message?.includes("already been registered")) {
      console.log("Usuário já existe. Atualizando perfil para admin...");
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", ADMIN_EMAIL)
        .single();
      if (existing) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin", plan: "premium", updated_at: new Date().toISOString() })
          .eq("email", ADMIN_EMAIL);
        if (updateError) {
          console.error("Erro ao promover a admin:", updateError.message);
          process.exit(1);
        }
        console.log("Perfil atualizado para admin. Senha NÃO foi alterada.");
        console.log("Para trocar a senha, use no Dashboard: Authentication > Users > usuário > Send password recovery");
        return;
      }
    }
    console.error("Erro ao criar usuário:", createError.message);
    process.exit(1);
  }

  const userId = userData.user?.id;
  if (!userId) {
    console.error("Usuário criado mas ID não retornado.");
    process.exit(1);
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: "admin", plan: "premium", updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateError) {
    console.error("Usuário criado no Auth, mas erro ao definir admin:", updateError.message);
    console.log("Rode no SQL Editor do Supabase:");
    console.log(`  UPDATE public.profiles SET role = 'admin', plan = 'premium' WHERE email = '${ADMIN_EMAIL}';`);
    process.exit(1);
  }

  console.log("OK! Admin criado com sucesso.");
  console.log("  E-mail:", ADMIN_EMAIL);
  console.log("  Senha:  (a que você definiu no script)");
  console.log("Acesse o site em /login e depois /admin.");
}

main();
