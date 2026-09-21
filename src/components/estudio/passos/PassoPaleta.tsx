import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useDados } from "@/hooks/useProjeto";
import { TONS_SUGERIDOS } from "@/lib/jornada";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Conceito = { tema?: string; notas?: string };

export function PassoPaleta() {
  const { dados, setChave } = useDados();
  const conceito = (dados["conceito"] as Conceito) ?? {};
  const paleta = (dados["paleta"] as string[]) ?? [];

  const [tema, setTema] = useState(conceito.tema ?? "");
  const [notas, setNotas] = useState(conceito.notas ?? "");
  const [tom, setTom] = useState("#E07A5F");

  useEffect(() => setTema(conceito.tema ?? ""), [conceito.tema]);
  useEffect(() => setNotas(conceito.notas ?? ""), [conceito.notas]);

  const salvarConceito = (patch: Conceito) => setChave("conceito", { ...conceito, ...patch });

  const adicionarTom = (hex: string) => {
    const cor = hex.toUpperCase();
    if (!/^#[0-9A-F]{6}$/.test(cor) || paleta.includes(cor)) return;
    setChave("paleta", [...paleta, cor]);
  };

  const removerTom = (hex: string) => setChave("paleta", paleta.filter((c) => c !== hex));

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <Label htmlFor="tema">Tema / Conceito</Label>
        <Input
          id="tema"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          onBlur={() => salvarConceito({ tema })}
          placeholder="Bosque Sereno"
        />
      </div>

      <div>
        <p className="olho mb-3">Sua paleta de cores</p>
        {paleta.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum tom ainda. Adicione abaixo ou escolha um sugerido.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {paleta.map((hex) => (
              <div key={hex} className="group relative">
                <div className="h-16 w-16 rounded-lg border shadow-suave" style={{ backgroundColor: hex }} />
                <p className="mt-1 text-center text-[11px] text-muted-foreground">{hex}</p>
                <button
                  type="button"
                  onClick={() => removerTom(hex)}
                  aria-label={`Remover ${hex}`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-suave transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="olho mb-3">Tons sugeridos</p>
        <div className="flex flex-wrap gap-2">
          {TONS_SUGERIDOS.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => adicionarTom(hex)}
              aria-label={`Adicionar ${hex}`}
              className="h-9 w-9 rounded-md border shadow-suave transition-transform hover:scale-110"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border p-3">
        <input
          type="color"
          value={tom}
          onChange={(e) => setTom(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border bg-transparent"
          aria-label="Escolher cor"
        />
        <span className="font-mono text-sm text-muted-foreground">{tom.toUpperCase()}</span>
        <button
          type="button"
          onClick={() => adicionarTom(tom)}
          className="ml-auto flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Adicionar tom
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas">Notas do conceito</Label>
        <Textarea
          id="notas"
          rows={4}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          onBlur={() => salvarConceito({ notas })}
          placeholder="Atmosfera acolhedora com tons terrosos, madeira clara e toques de verde sálvia."
        />
      </div>
    </div>
  );
}
