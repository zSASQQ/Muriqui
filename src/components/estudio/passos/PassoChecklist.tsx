import { useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { useDados } from "@/hooks/useProjeto";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ItemCheck = { label: string; done: boolean };

type Props = {
  chave: string;
  descricao: string;
  padrao: string[];
};

export function PassoChecklist({ chave, descricao, padrao }: Props) {
  const { dados, setChave } = useDados();
  const armazenado = dados[chave] as ItemCheck[] | undefined;

  const [lista, setLista] = useState<ItemCheck[]>(
    armazenado ?? padrao.map((label) => ({ label, done: false })),
  );
  const [novo, setNovo] = useState("");

  useEffect(() => {
    if (armazenado) setLista(armazenado);
  }, [armazenado]);

  const persistir = (proxima: ItemCheck[]) => {
    setLista(proxima);
    setChave(chave, proxima);
  };

  const alternar = (i: number) =>
    persistir(lista.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item)));

  const remover = (i: number) => persistir(lista.filter((_, idx) => idx !== i));

  const adicionar = () => {
    const label = novo.trim();
    if (!label) return;
    persistir([...lista, { label, done: false }]);
    setNovo("");
  };

  const feitos = lista.filter((i) => i.done).length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm text-muted-foreground">{descricao}</p>
        <span className="olho shrink-0">
          {feitos}/{lista.length}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${lista.length ? (feitos / lista.length) * 100 : 0}%` }}
        />
      </div>

      <ul className="space-y-2.5">
        {lista.map((item, i) => (
          <li key={`${item.label}-${i}`}>
            <div
              className={cn(
                "group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                item.done ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40",
              )}
            >
              <button
                type="button"
                onClick={() => alternar(i)}
                aria-pressed={item.done}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                  item.done ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {item.done && <Check className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => alternar(i)}
                className={cn(
                  "flex-1 text-left text-sm",
                  item.done && "text-muted-foreground line-through",
                )}
              >
                {item.label}
              </button>
              <button
                type="button"
                onClick={() => remover(i)}
                aria-label={`Remover ${item.label}`}
                className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Input
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionar())}
          placeholder="Adicionar item…"
        />
        <button
          type="button"
          onClick={adicionar}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}
