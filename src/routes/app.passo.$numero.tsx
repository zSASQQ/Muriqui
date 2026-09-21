import { createFileRoute, notFound } from "@tanstack/react-router";
import { useProjeto } from "@/hooks/useProjeto";
import {
  getPasso,
  TOTAL_PASSOS,
  CHECKLIST_MOBILIARIO,
  CHECKLIST_DECORACAO,
  CHECKLIST_MONTAGEM,
} from "@/lib/jornada";
import { TrilhaPassos } from "@/components/estudio/TrilhaPassos";
import { PassoInspiracao } from "@/components/estudio/passos/PassoInspiracao";
import { PassoMedidasPlanta } from "@/components/estudio/passos/PassoMedidasPlanta";
import { PassoPaleta } from "@/components/estudio/passos/PassoPaleta";
import { PassoChecklist } from "@/components/estudio/passos/PassoChecklist";
import { PassoCompras } from "@/components/estudio/passos/PassoCompras";

export const Route = createFileRoute("/app/passo/$numero")({
  beforeLoad: ({ params }) => {
    const n = Number(params.numero);
    if (!Number.isInteger(n) || n < 1 || n > TOTAL_PASSOS) throw notFound();
  },
  head: ({ params }) => {
    const passo = getPasso(Number(params.numero));
    const titulo = passo ? `${passo.titulo} — muriqui` : "Passo — muriqui";
    return {
      meta: [
        { title: titulo },
        { name: "description", content: passo?.subtitulo ?? "Um passo do Estúdio do Quarto." },
      ],
    };
  },
  component: PassoPage,
});

function PassoPage() {
  const { numero } = Route.useParams();
  const n = Number(numero);
  const passo = getPasso(n)!;
  const { projeto, carregando } = useProjeto();

  if (carregando || !projeto) return <p className="olho">carregando…</p>;

  const concluidos = projeto.passos_concluidos ?? [];
  const Icone = passo.icone;

  return (
    <div className="space-y-6">
      {/* Cabeçalho do passo + trilha */}
      <section className="papel p-6 sm:p-7">
        <p className="olho text-accent">
          Passo {n} de {TOTAL_PASSOS}
        </p>
        <h2 className="mt-1 font-display text-3xl">{passo.titulo}</h2>
        <p className="text-muted-foreground">{passo.subtitulo}</p>
        <div className="mt-7">
          <TrilhaPassos numeroAtual={n} concluidos={concluidos} />
        </div>
      </section>

      {/* Ferramenta do passo */}
      <section className="papel p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent">
            <Icone className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-xl leading-tight">{passo.titulo}</h3>
            <p className="text-sm text-muted-foreground">{passo.subtitulo}</p>
          </div>
        </div>

        <div className="mt-6">
          <FerramentaPasso numero={n} projetoId={projeto.id} />
        </div>
      </section>
    </div>
  );
}

function FerramentaPasso({ numero, projetoId }: { numero: number; projetoId: string }) {
  switch (numero) {
    case 1:
      return <PassoInspiracao projetoId={projetoId} />;
    case 2:
      return <PassoMedidasPlanta />;
    case 3:
      return <PassoPaleta />;
    case 4:
      return (
        <PassoChecklist
          chave="check_mobiliario"
          descricao="Defina as peças principais do quarto. Marque conforme for definindo cada item."
          padrao={CHECKLIST_MOBILIARIO}
        />
      );
    case 5:
      return (
        <PassoChecklist
          chave="check_decoracao"
          descricao="Os detalhes que dão personalidade: tecidos, arte, iluminação suave e elementos sensoriais."
          padrao={CHECKLIST_DECORACAO}
        />
      );
    case 6:
      return <PassoCompras />;
    case 7:
      return (
        <PassoChecklist
          chave="check_montagem"
          descricao="Checklist final para montar e finalizar o quarto com segurança e carinho."
          padrao={CHECKLIST_MONTAGEM}
        />
      );
    default:
      return (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            A planta interativa com móveis arrastáveis chega na próxima fase.
          </p>
        </div>
      );
  }
}
