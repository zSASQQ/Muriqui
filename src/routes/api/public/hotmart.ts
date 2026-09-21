import { createFileRoute } from "@tanstack/react-router";

/**
 * Webhook da Hotmart.
 * Configure na Hotmart: Ferramentas > Webhook (API e Notificações)
 * URL: https://<seu-dominio>/api/public/hotmart
 * A Hotmart envia o token no cabeçalho "x-hotmart-hottok".
 */

const EVENTOS_LIBERA = new Set([
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
  "PURCHASE_PROTEST", // tratado abaixo como bloqueio
]);

const EVENTOS_BLOQUEIA = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_EXPIRED",
  "PURCHASE_PROTEST",
  "SUBSCRIPTION_CANCELLATION",
]);

type HotmartPayload = {
  event?: string;
  data?: {
    buyer?: { email?: string; name?: string };
    purchase?: { transaction?: string; status?: string };
    product?: { name?: string };
    subscriber?: { email?: string };
  };
  // formato legado (v1)
  email?: string;
  name?: string;
  prod_name?: string;
  transaction?: string;
  status?: string;
};

function extrair(payload: HotmartPayload) {
  const email = payload.data?.buyer?.email ?? payload.data?.subscriber?.email ?? payload.email ?? null;
  const nome = payload.data?.buyer?.name ?? payload.name ?? null;
  const transacao = payload.data?.purchase?.transaction ?? payload.transaction ?? null;
  const produto = payload.data?.product?.name ?? payload.prod_name ?? null;
  const evento = (payload.event ?? payload.status ?? "UNKNOWN").toUpperCase();
  return { email, nome, transacao, produto, evento };
}

export const Route = createFileRoute("/api/public/hotmart")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const hottok = process.env["HOTMART_HOTTOK"];
        const recebido =
          request.headers.get("x-hotmart-hottok") ?? request.headers.get("hottok") ?? undefined;

        if (!hottok) {
          return Response.json({ error: "HOTMART_HOTTOK nao configurado" }, { status: 500 });
        }
        if (recebido !== hottok) {
          return Response.json({ error: "Token invalido" }, { status: 401 });
        }

        let payload: HotmartPayload;
        try {
          payload = (await request.json()) as HotmartPayload;
        } catch {
          return Response.json({ error: "Corpo invalido" }, { status: 400 });
        }

        const { email, nome, transacao, produto, evento } = extrair(payload);
        if (!email) {
          return Response.json({ error: "Comprador sem e-mail" }, { status: 400 });
        }

        const libera = EVENTOS_LIBERA.has(evento) && !EVENTOS_BLOQUEIA.has(evento);
        const bloqueia = EVENTOS_BLOQUEIA.has(evento);
        if (!libera && !bloqueia) {
          return Response.json({ ok: true, ignorado: evento });
        }

        const { supabaseAdmin: admin } = await import("@/integrations/supabase/client.server");

        const { error } = await admin.from("hotmart_compras").upsert(
          {
            email: email.toLowerCase(),
            nome,
            transacao: transacao ?? evento,
            produto,
            evento,
            status: libera ? "ativo" : "cancelado",
            payload: payload as never,
          },
          { onConflict: "email,transacao" },
        );

        if (error) {
          console.error("hotmart webhook:", error.message);
          return Response.json({ error: "Falha ao registrar compra" }, { status: 500 });
        }

        return Response.json({ ok: true, evento, acesso: libera ? "liberado" : "bloqueado" });
      },
    },
  },
});
