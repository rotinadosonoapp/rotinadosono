import { supabase, isSupabaseConfigured } from "./supabase";

export type Lead = {
  id?: string;
  email: string;
  name?: string;
  source?: string;
  created_at?: string;
};

/**
 * Salva um lead (email/nome) no Supabase.
 * Requer tabela `leads` e chave anon no .env (VITE_SUPABASE_ANON_KEY).
 */
export async function saveLead(lead: Lead): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase não configurado. Adicione VITE_SUPABASE_ANON_KEY no .env" };
  }

  const { error } = await supabase.from("leads").insert({
    email: lead.email,
    name: lead.name ?? null,
    source: lead.source ?? "site",
  });

  if (error) {
    console.error("Supabase lead error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
