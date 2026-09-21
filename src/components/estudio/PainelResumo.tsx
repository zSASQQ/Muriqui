import { Wallet, ShoppingBag, ArrowRight } from "lucide-react";
import { brl } from "@/lib/passos";

type ItemResumo = { id: string; nome: string; preco: number; comprado: boolean };

type Props = {
  orcamento: number;
  gasto: number;
  itens: ItemResumo[];
  temProximo: boolean;
  onAvancar: () => void;
};

export function PainelResumo({ orcamento, gasto, itens, temProximo, onAvancar }: Props) {
  const restante = Math.max(0, orcamento - gasto);
  const pct = orcamento > 0 ? Math.min(100, (gasto / orcamento) * 100) : 0;
  const pendentes = itens.filter((i) => !i.comprado).length;

  return (
    <div className="space-y-5">
      <div className="papel p-5">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Orçamento</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <span className="font-display text-3xl">{brl(gasto)}</span>
          <span className="text-sm text-muted-foreground">de {brl(orcamento)}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Restam {brl(restante)}</p>
      </div>

      <div className="papel p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Lista de Compras</span>
          </div>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {itens.length} {itens.length === 1 ? "item" : "itens"}
          </span>
        </div>

        {itens.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhum item ainda.</p>
        ) : (
          <>
            <ul className="mt-4 space-y-2.5">
              {itens.slice(0, 6).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-foreground/90">{i.nome}</span>
                  <span className="shrink-0 text-muted-foreground">{brl(Number(i.preco))}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              {pendentes} {pendentes === 1 ? "item pendente" : "itens pendentes"}
            </p>
          </>
        )}
      </div>

      {temProximo && (
        <button
          type="button"
          onClick={onAvancar}
          className="flex w-full items-center justify-between rounded-xl bg-foreground px-5 py-4 text-left text-background transition-opacity hover:opacity-90"
        >
          <span>
            <span className="olho block text-background/70">Avançar</span>
            <span className="mt-0.5 block font-display text-lg">Próximo passo</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      )}
    </div>
  );
}
