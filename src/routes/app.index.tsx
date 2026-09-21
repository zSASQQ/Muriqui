import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useProjeto } from "@/hooks/useProjeto";
import { proximoPasso } from "@/lib/jornada";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Meu projeto — muriqui" },
      { name: "description", content: "Acompanhe os 7 passos do seu projeto de quarto infantil." },
    ],
  }),
  component: Redirecionar,
});

function Redirecionar() {
  const { projeto, carregando } = useProjeto();
  const navigate = useNavigate();

  useEffect(() => {
    if (carregando || !projeto) return;
    const n = proximoPasso(projeto.passos_concluidos ?? []);
    void navigate({ to: "/app/passo/$numero", params: { numero: String(n) }, replace: true });
  }, [projeto, carregando, navigate]);

  return <p className="olho">abrindo seu projeto…</p>;
}
