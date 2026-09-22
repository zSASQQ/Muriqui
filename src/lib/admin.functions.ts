import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Módulo administrativo — gerência de acessos (alunos).
 * Todas as operações rodam no servidor com a chave de serviço (nunca no navegador)
 * e só executam depois de confirmar que quem chamou é administrador.
 */

export type Aluno = {
  id: string;
  email: string;
  nome: string | null;
  acesso_liberado: boolean;
  origem: string;
  is_admin: boolean;
  created_at: string;
};

async function garantirAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (!data || !(data as { is_admin?: boolean }).is_admin) {
    throw new Error("Acesso restrito a administradores.");
  }
  return supabaseAdmin;
}

export const listarAlunos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await garantirAdmin(context.userId);
    const { data, error } = await admin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as Aluno[];
  });

export const criarAluno = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { nome: string; email: string; senha: string }) => d)
  .handler(async ({ data, context }) => {
    const admin = await garantirAdmin(context.userId);
    const email = data.email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("E-mail inválido.");
    if ((data.senha ?? "").length < 6) throw new Error("A senha deve ter ao menos 6 caracteres.");

    const { data: criado, error } = await admin.auth.admin.createUser({
      email,
      password: data.senha,
      email_confirm: true,
      user_metadata: { nome: data.nome?.trim() || null },
    });
    if (error) throw new Error(error.message.toLowerCase().includes("already") ? "Esse e-mail já tem conta." : error.message);

    // O trigger cria o perfil; garantimos acesso liberado e origem "manual".
    if (criado.user) {
      await admin.from("profiles").update({ acesso_liberado: true, origem: "manual" } as never).eq("id", criado.user.id);
    }
    return { ok: true };
  });

export const definirAcesso = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { id: string; liberado: boolean }) => d)
  .handler(async ({ data, context }) => {
    const admin = await garantirAdmin(context.userId);
    const { error } = await admin
      .from("profiles")
      .update({ acesso_liberado: data.liberado } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
