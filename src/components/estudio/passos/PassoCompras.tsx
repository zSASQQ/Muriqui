import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Check, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProjeto, useItens } from "@/hooks/useProjeto";
import { CATEGORIAS_COMPRA } from "@/lib/jornada";
import { brl } from "@/lib/passos";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function PassoCompras() {
  const { user } = useAuth();
  const { projeto, salvar } = useProjeto();
  const { itens, adicionar, atualizar, remover } = useItens(projeto?.id);

  const [orcamento, setOrcamento] = useState(String(projeto?.orcamento || ""));
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [link, setLink] = useState("");
  const [categoria, setCategoria] = useState<string>(CATEGORIAS_COMPRA[0] ?? "Mobiliário");

  useEffect(() => setOrcamento(String(projeto?.orcamento || "")), [projeto?.orcamento]);

  const salvarOrcamento = () => {
    const valor = Number(orcamento.replace(",", ".")) || 0;
    if (valor !== Number(projeto?.orcamento ?? 0)) salvar.mutate({ orcamento: valor });
  };

  const adicionarItem = () => {
    if (!nome.trim() || !user) return;
    adicionar.mutate(
      {
        user_id: user.id,
        nome: nome.trim(),
        preco: Number(preco.replace(",", ".")) || 0,
        categoria,
        observacao: link.trim() || null,
      },
      {
        onSuccess: () => {
          setNome("");
          setPreco("");
          setLink("");
          toast.success("Item adicionado à lista.");
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const total = itens.reduce((s, i) => s + Number(i.preco), 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="orcamento">Orçamento total do projeto (R$)</Label>
        <Input
          id="orcamento"
          inputMode="decimal"
          value={orcamento}
          onChange={(e) => setOrcamento(e.target.value)}
          onBlur={salvarOrcamento}
          placeholder="15000"
        />
      </div>

      <div className="rounded-xl border p-4">
        <p className="olho mb-3">Adicionar item à lista</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do item" />
          <Input
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            inputMode="decimal"
            placeholder="Preço (R$)"
          />
          <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link de compra (opcional)" />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {CATEGORIAS_COMPRA.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={adicionarItem}
          disabled={adicionar.isPending}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Adicionar à lista
        </button>
      </div>

      {itens.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="olho">Valor total da lista</span>
            <span className="font-display text-lg">{brl(total)}</span>
          </div>
          <ul className="space-y-2.5">
            {itens.map((i) => (
              <li
                key={i.id}
                className="group flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => atualizar.mutate({ id: i.id, comprado: !i.comprado })}
                  aria-label={i.comprado ? "Marcar como não comprado" : "Marcar como comprado"}
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                    i.comprado ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {i.comprado && <Check className="h-4 w-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm", i.comprado && "text-muted-foreground line-through")}>
                    {i.nome}
                  </p>
                  {i.categoria && (
                    <span className="mt-0.5 inline-block rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                      {i.categoria}
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-sm text-muted-foreground">{brl(Number(i.preco))}</span>
                <button
                  type="button"
                  onClick={() => remover.mutate(i.id)}
                  aria-label={`Remover ${i.nome}`}
                  className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
