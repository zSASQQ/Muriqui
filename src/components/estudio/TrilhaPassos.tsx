import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { JORNADA, TOTAL_PASSOS } from "@/lib/jornada";
import { cn } from "@/lib/utils";

type Props = {
  numeroAtual: number;
  concluidos: number[];
};

export function TrilhaPassos({ numeroAtual, concluidos }: Props) {
  const progresso = ((numeroAtual - 1) / (TOTAL_PASSOS - 1)) * 100;

  return (
    <div className="relative pt-1">
      {/* linha de fundo */}
      <div className="absolute left-0 right-0 top-6 h-0.5 bg-border" />
      {/* linha de progresso (terracota) até o passo atual */}
      <div className="absolute left-0 top-6 h-0.5 bg-accent transition-all" style={{ width: `${progresso}%` }} />

      <ol className="relative flex justify-between">
        {JORNADA.map((p) => {
          const feito = concluidos.includes(p.numero);
          const atual = p.numero === numeroAtual;
          const Icone = p.icone;
          return (
            <li key={p.numero} className="flex w-0 flex-1 flex-col items-center gap-2 text-center">
              <Link
                to="/app/passo/$numero"
                params={{ numero: String(p.numero) }}
                aria-label={p.titulo}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-colors",
                  atual && "border-accent bg-accent text-accent-foreground",
                  feito && !atual && "border-primary bg-primary text-primary-foreground",
                  !feito && !atual && "border-border text-muted-foreground",
                )}
              >
                {feito && !atual ? <Check className="h-5 w-5" /> : <Icone className="h-[18px] w-[18px]" />}
              </Link>
              <span
                className={cn(
                  "px-1 text-[11px] leading-tight",
                  atual ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {p.titulo}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
