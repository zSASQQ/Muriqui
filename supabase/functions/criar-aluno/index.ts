// Edge Function do Supabase: gerência de alunos (criar e excluir).
// Usa a chave de serviço (disponível no ambiente do Supabase) e só executa
// se quem chamou for administrador. Nunca expõe segredo ao navegador.
//
// Publicada no Supabase com o slug "hyper-endpoint".
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
    const chamador = userData.user;

    // 2) Confere se é administrador.
    const { data: perfil } = await admin
      .from("profiles")
      .select("is_admin")
      .eq("id", chamador.id)
      .single();
    if (!perfil?.is_admin) return json({ error: "Acesso restrito a administradores." }, 403);

    const body = await req.json().catch(() => ({}));
    const acao = String(body.acao ?? "criar");

    // ---- EXCLUIR ALUNO ----
    if (acao === "excluir") {
      const id = String(body.id ?? "");
      if (!id) return json({ error: "Aluno não informado." }, 400);
      if (id === chamador.id) return json({ error: "Você não pode excluir a si mesmo." }, 400);

      // Remove os projetos do aluno (em cascata: itens e referências).
      await admin.from("projetos").delete().eq("user_id", id);
      // Remove a conta (em cascata: o perfil).
      const { error: delErr } = await admin.auth.admin.deleteUser(id);
      if (delErr) return json({ error: delErr.message }, 400);
      return json({ ok: true });
    }

    // ---- CRIAR ALUNO (padrão) ----
    const email = String(body.email ?? "").trim().toLowerCase();
    const senha = String(body.senha ?? "");
    const nome = String(body.nome ?? "").trim() || null;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "E-mail inválido." }, 400);
    if (senha.length < 6) return json({ error: "A senha deve ter ao menos 6 caracteres." }, 400);

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
