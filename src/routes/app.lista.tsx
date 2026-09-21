import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ListaCompras } from "@/components/ListaCompras";
import { useItens, useProjeto } from "@/hooks/useProjeto";
import { brl } from "@/lib/passos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/lista")({
  head: () => ({
    meta: [
      { title: "Minha lista de compras — muriqui" },
      {
        name: "description",
        content: "Sua lista dividida em estrutura, conforto e personalidade, com o orçamento por camada.",
      },
      { property: "og:title", content: "Minha lista de compras — muriqui" },
      { property: "og:description", content: "Lista em três camadas com orçamento distribuído." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Lista,
});

function Lista() {
  const { projeto, salvar } = useProjeto();
  const { itens } = useItens(projeto?.id);
  const total = itens.reduce((s, i) => s + Number(i.preco), 0);
  const orcamento = Number(projeto?.orcamento ?? 0);

  const definirOrcamento = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valor = Number(String(new FormData(e.currentTarget).get("orcamento")).replace(",", ".")) || 0;
    salvar.mutate({ orcamento: valor }, { onSuccess: () => toast.success("Orçamento atualizado.") });
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="olho">Passos 4 e 5</p>
        <h1 className="mt-2 text-4xl">Minha lista de compras</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Cada item entra em uma camada. A ordem importa mais do que o valor: estrutura primeiro, conforto
          depois, personalidade por último.
        </p>
      </header>

      <form onSubmit={definirOrcamento} className="papel flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="orcamento">Orçamento total (R$)</Label>
          <Input
            id="orcamento"
            name="orcamento"
            inputMode="decimal"
            defaultValue={orcamento || ""}
            placeholder="2000"
            className="w-40"
          />
        </div>
        <Button type="submit" variant="secondary">
          Salvar
        </Button>
        <div className="ml-auto text-right">
          <p className="olho">Somado na lista</p>
          <p className="font-display text-2xl">{brl(total)}</p>
          {orcamento > 0 && (
            <p className={`text-sm ${total > orcamento ? "text-destructive" : "text-muted-foreground"}`}>
              {total > orcamento
                ? `${brl(total - orcamento)} acima do orçamento`
                : `${brl(orcamento - total)} ainda disponíveis`}
            </p>
          )}
        </div>
      </form>

      <ListaCompras mostrarSeguranca />
    </div>
  );
}
