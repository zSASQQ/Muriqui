import { useState } from "react";
import { toast } from "sonner";
import { CAMADAS, brl } from "@/lib/passos";
import { useItens, useProjeto } from "@/hooks/useProjeto";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

export function ListaCompras({ mostrarSeguranca = false }: { mostrarSeguranca?: boolean }) {
  const { user } = useAuth();
  const { projeto } = useProjeto();
  const { itens, adicionar, atualizar, remover } = useItens(projeto?.id);
  const [camada, setCamada] = useState("1");

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nome = String(fd.get("nome")).trim();
    if (!nome || !user) return;
    adicionar.mutate(
      {
        nome,
        camada: Number(camada),
        preco: Number(String(fd.get("preco")).replace(",", ".")) || 0,
        user_id: user.id,
      },
      {
        onSuccess: () => {
          form.reset();
          toast.success("Item adicionado.");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={enviar} className="papel grid gap-4 p-5 sm:grid-cols-[1fr_140px_150px_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="item-nome">Item</Label>
          <Input id="item-nome" name="nome" placeholder="Cortina blackout" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-preco">Preço (R$)</Label>
          <Input id="item-preco" name="preco" inputMode="decimal" placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Camada</Label>
          <Select value={camada} onValueChange={setCamada}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAMADAS.map((c) => (
                <SelectItem key={c.numero} value={String(c.numero)}>
                  {c.numero}. {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Adicionar</Button>
      </form>

      {CAMADAS.map((c) => {
        const doGrupo = itens.filter((i) => i.camada === c.numero);
        const gasto = doGrupo.reduce((s, i) => s + Number(i.preco), 0);
        const previsto = Number(projeto?.orcamento ?? 0) * c.percentual;
        const pct = previsto > 0 ? Math.min(100, Math.round((gasto / previsto) * 100)) : 0;

        return (
          <section key={c.numero} className="papel p-6">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="olho">Camada {c.numero}</p>
                <h3 className="text-xl">{c.nome}</h3>
                <p className="text-sm text-muted-foreground">{c.descricao}</p>
              </div>
              <p className="text-right text-sm">
                <span className="font-display text-xl">{brl(gasto)}</span>
                {previsto > 0 && (
                  <span className="block text-muted-foreground">
                    de {brl(previsto)} ({Math.round(c.percentual * 100)}%)
                  </span>
                )}
              </p>
            </header>

            {previsto > 0 && <Progress value={pct} className="mt-4 h-1.5" />}

            <ul className="mt-5 divide-y">
              {doGrupo.length === 0 && (
                <li className="py-4 text-sm text-muted-foreground">Nenhum item nesta camada ainda.</li>
              )}
              {doGrupo.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center gap-3 py-3">
                  <Checkbox
                    checked={i.comprado}
                    onCheckedChange={(v) => atualizar.mutate({ id: i.id, comprado: !!v })}
                    aria-label="Comprado"
                  />
                  <span className={`flex-1 ${i.comprado ? "text-muted-foreground line-through" : ""}`}>
                    {i.nome}
                  </span>
                  {mostrarSeguranca && (
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox
                        checked={i.seguranca_ok}
                        onCheckedChange={(v) => atualizar.mutate({ id: i.id, seguranca_ok: !!v })}
                      />
                      checklist ok
                    </label>
                  )}
                  <span className="font-mono text-sm">{brl(Number(i.preco))}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover ${i.nome}`}
                    onClick={() => remover.mutate(i.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
