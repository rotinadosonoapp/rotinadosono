/**
 * API para cadastro seguro de aluno (após compra).
 * Usa SUPABASE_SERVICE_ROLE_KEY apenas no servidor.
 *
 * Variáveis de ambiente (Vercel):
 *   VITE_SUPABASE_URL ou SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY ou SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * O frontend deve enviar o token de sessão no header Authorization.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ANON_KEY) {
      return Response.json(
        { error: "Configuração do servidor incompleta (URL, SERVICE_ROLE_KEY, ANON_KEY)" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ error: "Token de autenticação necessário" }, { status: 401 });
    }

    // Verifica se o usuário logado é admin
    const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false },
    });
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser(token);
    if (userError || !user) {
      return Response.json({ error: "Sessão inválida" }, { status: 401 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return Response.json({ error: "Apenas administradores podem cadastrar alunos" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, courseIds } = body;
    if (!name || !email) {
      return Response.json(
        { error: "Nome e e-mail são obrigatórios" },
        { status: 400 }
      );
    }

    const courses = Array.isArray(courseIds) ? courseIds : courseIds ? [courseIds] : [];
    const redirectUrl = request.headers.get("origin") || "https://rotinadosono.vercel.app";

    const { data: inviteData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
        data: { name: name.trim() },
        redirectTo: `${redirectUrl}/reset-password`,
      });

    if (inviteError) {
      if (inviteError.message?.includes("already been registered")) {
        return Response.json(
          { error: "Este e-mail já está cadastrado" },
          { status: 409 }
        );
      }
      return Response.json(
        { error: inviteError.message || "Erro ao enviar convite" },
        { status: 400 }
      );
    }

    const userId = inviteData.user?.id;
    if (!userId) {
      return Response.json({ error: "Erro ao obter ID do usuário" }, { status: 500 });
    }

    // Profile é criado pelo trigger; atualizamos name
    await supabaseAdmin
      .from("profiles")
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq("id", userId);

    // Matrículas nos cursos
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 ano
    for (const courseId of courses) {
      await supabaseAdmin.from("enrollments").upsert(
        {
          user_id: userId,
          course_id: courseId,
          access_expires_at: expiresAt.toISOString(),
          status: "active",
        },
        { onConflict: "user_id,course_id" }
      );
    }

    return Response.json({
      success: true,
      userId,
      message: "Aluno cadastrado. Convite enviado por e-mail para definir senha.",
    });
  } catch (err) {
    console.error("create-student error:", err);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
