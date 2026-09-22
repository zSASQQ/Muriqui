// Edge Function do Supabase: cria um aluno (conta + acesso liberado).
// Usa a chave de serviço (disponível no ambiente do Supabase) e só executa
// se quem chamou for um administrador. Nunca expõe segredo ao navegador.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, serviceKey);

    // 1) Identifica quem chamou pelo token do usuário logado.
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!token) return json({ error: "Sem autenticação." }, 401);
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData.user) return json({ error: "Sessão inválida." }, 401);

    // 2) Confere se é administrador.
    const { data: perfil } = await admin
      .from("profiles")
      .select("is_admin")
      .eq("id", userData.user.id)
      .single();
    if (!perfil?.is_admin) return json({ error: "Acesso restrito a administradores." }, 403);

    // 3) Valida a entrada.
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const senha = String(body.senha ?? "");
    const nome = String(body.nome ?? "").trim() || null;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "E-mail inválido." }, 400);
    if (senha.length < 6) return json({ error: "A senha deve ter ao menos 6 caracteres." }, 400);

    // 4) Cria a conta já confirmada.
    const { data: criado, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome },
    });
    if (createErr) {
      const msg = createErr.message.toLowerCase().includes("already")
        ? "Esse e-mail já tem conta."
        : createErr.message;
      return json({ error: msg }, 400);
    }

    // 5) Garante acesso liberado e origem "manual".
    if (criado.user) {
      await admin
        .from("profiles")
        .update({ acesso_liberado: true, origem: "manual" })
        .eq("id", criado.user.id);
    }

    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
