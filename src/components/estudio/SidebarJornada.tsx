import { Link } from "@tanstack/react-router";
import { Sparkles, CircleCheck, Users } from "lucide-react";
import { JORNADA } from "@/lib/jornada";
import { brl } from "@/lib/passos";
import { cn } from "@/lib/utils";

type Props = {
  numeroAtual: number;
  concluidos: number[];
  orcamento: number;
  gasto: number;
  onSair: () => void;
  isAdmin: boolean;
};

export function SidebarJornada({ numeroAtual, concluidos, orcamento, gasto, onSair, isAdmin }: Props) {
  const pct = orcamento > 0 ? Math.min(100, Math.round((gasto / orcamento) * 100)) : 0;

  return (
    <div className="flex h-full flex-col gap-8">
      <Link to="/app" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-display text-lg leading-tight">Estúdio</span>
          <span className="block text-sm text-muted-foreground">Quarto dos Sonhos</span>
        </span>
      </Link>

      <nav>
        <p className="olho mb-4">A jornada de 7 passos</p>
        <ul className="space-y-1">
          {JORNADA.map((p) => {
            const feito = concluidos.includes(p.numero);
            const atual = p.numero === numeroAtual;
            const Icone = p.icone;
            return (
              <li key={p.numero}>
                <Link
                  to="/app/passo/$numero"
                  params={{ numero: String(p.numero) }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    atual ? "bg-card shadow-suave" : "hover:bg-card/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      atual && "bg-accent text-accent-foreground",
                      feito && !atual && "bg-primary/12 text-primary",
                      !feito && !atual && "bg-secondary text-muted-foreground",
                    )}
                  >
                    {feito && !atual ? <CircleCheck className="h-5 w-5" /> : <Icone className="h-[18px] w-[18px]" />}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block truncate text-sm", atual ? "font-medium text-foreground" : "text-foreground/90")}>
                      {p.titulo}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{p.subtitulo}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {isAdmin && (
        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-card/60"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
            <Users className="h-[18px] w-[18px]" />
          </span>
          <span>
            <span className="block text-foreground/90">Alunos</span>
            <span className="block text-xs text-muted-foreground">Gerenciar acessos</span>
          </span>
        </Link>
      )}

      <div className="mt-auto papel p-4">
        <div className="flex items-center justify-between">
          <span className="olho">Orçamento</span>
          <span className="text-sm font-medium text-accent">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {brl(gasto)} de {brl(orcamento)}
        </p>
      </div>

      <button
        type="button"
        onClick={onSair}
        className="-mt-3 self-start px-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Sair
      </button>
    </div>
  );
}
