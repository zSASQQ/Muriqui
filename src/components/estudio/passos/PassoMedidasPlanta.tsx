import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { LayoutGrid, Lightbulb } from "lucide-react";
import { useDados } from "@/hooks/useProjeto";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TipoMovel = "berco" | "comoda" | "poltrona" | "guardaroupa" | "tapete" | "janela" | "porta";

type ConfigMovel = { nome: string; cor: string; w: number; h: number; parede?: boolean; xPad: number; yPad: number };

const MOVEIS: Record<TipoMovel, ConfigMovel> = {
  berco: { nome: "Berço", cor: "#E07A5F", w: 26, h: 24, xPad: 6, yPad: 26 },
  comoda: { nome: "Cômoda", cor: "#81A684", w: 12, h: 22, xPad: 82, yPad: 58 },
  poltrona: { nome: "Poltrona", cor: "#E6C86E", w: 16, h: 20, xPad: 6, yPad: 62 },
  guardaroupa: { nome: "Guarda-roupa", cor: "#B08968", w: 26, h: 14, xPad: 34, yPad: 66 },
  tapete: { nome: "Tapete", cor: "#D9CFC0", w: 34, h: 30, xPad: 40, yPad: 22 },
  janela: { nome: "Janela", cor: "#9DBFE0", w: 22, h: 5, parede: true, xPad: 42, yPad: 0 },
  porta: { nome: "Porta", cor: "#81A684", w: 16, h: 5, parede: true, xPad: 6, yPad: 0 },
};

const ORDEM: TipoMovel[] = ["berco", "comoda", "poltrona", "guardaroupa", "tapete", "janela", "porta"];

type Peca = { id: string; tipo: TipoMovel; x: number; y: number };

const seedInicial = (): Peca[] =>
  ORDEM.map((tipo) => ({ id: tipo, tipo, x: MOVEIS[tipo].xPad, y: MOVEIS[tipo].yPad }));

type Dimensoes = { texto?: string; area?: string; observacoes?: string };

export function PassoMedidasPlanta() {
  const { dados, setChave } = useDados();
  const dimensoes = (dados["dimensoes"] as Dimensoes) ?? {};
  const plantaSalva = dados["planta"] as Peca[] | undefined;

  const [texto, setTexto] = useState(dimensoes.texto ?? "");
  const [area, setArea] = useState(dimensoes.area ?? "");
  const [obs, setObs] = useState(dimensoes.observacoes ?? "");

  useEffect(() => setTexto(dimensoes.texto ?? ""), [dimensoes.texto]);
  useEffect(() => setArea(dimensoes.area ?? ""), [dimensoes.area]);
  useEffect(() => setObs(dimensoes.observacoes ?? ""), [dimensoes.observacoes]);

  const salvarDim = (patch: Dimensoes) => setChave("dimensoes", { ...dimensoes, ...patch });

  return (
    <div className="space-y-7">
      <p className="text-sm text-muted-foreground">
        Anote as medidas do quarto para planejar a disposição dos móveis com precisão. Considere portas,
        janelas e tomadas.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dim">Dimensões (largura x profundidade)</Label>
          <Input
            id="dim"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onBlur={() => salvarDim({ texto })}
            placeholder="3,5m x 3,0m"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Área aproximada (m²)</Label>
          <Input
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            onBlur={() => salvarDim({ area })}
            placeholder="Ex: 10,5 m²"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="obs">Observações do espaço</Label>
        <Textarea
          id="obs"
          rows={3}
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          onBlur={() => salvarDim({ observacoes: obs })}
          placeholder="Janela grande na parede leste, tomada atrás da porta, pé-direito alto…"
        />
      </div>

      <PlantaEditor pecas={plantaSalva ?? seedInicial()} onChange={(p) => setChave("planta", p)} />

      <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p className="text-sm text-muted-foreground">
          Dica: deixe pelo menos 60 cm de circulação ao redor do berço e evite posicioná-lo sob janelas ou
          perto de tomadas livres.
        </p>
      </div>
    </div>
  );
}

function PlantaEditor({ pecas: pecasIniciais, onChange }: { pecas: Peca[]; onChange: (p: Peca[]) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const [pecas, setPecas] = useState<Peca[]>(pecasIniciais);

  // Ressincroniza quando os dados salvos mudam (ex.: outro dispositivo), mas não durante um arraste.
  useEffect(() => {
    if (!dragRef.current) setPecas(pecasIniciais);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pecasIniciais)]);

  const presentes = new Set(pecas.map((p) => p.tipo));

  const alternarMovel = (tipo: TipoMovel) => {
    const proxima = presentes.has(tipo)
      ? pecas.filter((p) => p.tipo !== tipo)
      : [...pecas, { id: tipo, tipo, x: MOVEIS[tipo].xPad, y: MOVEIS[tipo].yPad }];
    setPecas(proxima);
    onChange(proxima);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>, peca: Peca) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const leftPx = (peca.x / 100) * rect.width;
    const topPx = (peca.y / 100) * rect.height;
    dragRef.current = { id: peca.id, dx: e.clientX - rect.left - leftPx, dy: e.clientY - rect.top - topPx };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>, peca: Peca) => {
    const d = dragRef.current;
    const container = containerRef.current;
    if (!d || d.id !== peca.id || !container) return;
    const rect = container.getBoundingClientRect();
    const cfg = MOVEIS[peca.tipo];
    let x = ((e.clientX - rect.left - d.dx) / rect.width) * 100;
    let y = ((e.clientY - rect.top - d.dy) / rect.height) * 100;
    x = Math.max(0, Math.min(100 - cfg.w, x));
    y = cfg.parede ? 0 : Math.max(0, Math.min(100 - cfg.h, y));
    setPecas((atual) => atual.map((p) => (p.id === peca.id ? { ...p, x, y } : p)));
  };

  const onPointerUp = () => {
    if (dragRef.current) {
      dragRef.current = null;
      onChange(pecas);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Planta do quarto</span>
        <span className="text-xs text-muted-foreground">— arraste os móveis no espaço</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {ORDEM.map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => alternarMovel(tipo)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
              presentes.has(tipo) ? "border-border bg-card" : "border-dashed border-border text-muted-foreground",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: MOVEIS[tipo].cor }} />
            {MOVEIS[tipo].nome}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-card"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--border) 60%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 60%, transparent) 1px, transparent 1px)",
          backgroundSize: "10% 10%",
          touchAction: "none",
        }}
      >
        {pecas.map((peca) => {
          const cfg = MOVEIS[peca.tipo];
          return (
            <div
              key={peca.id}
              onPointerDown={(e) => onPointerDown(e, peca)}
              onPointerMove={(e) => onPointerMove(e, peca)}
              onPointerUp={onPointerUp}
              className="absolute flex cursor-grab items-center justify-center rounded-md text-center text-[11px] font-medium shadow-suave select-none active:cursor-grabbing"
              style={{
                left: `${peca.x}%`,
                top: `${peca.y}%`,
                width: `${cfg.w}%`,
                height: `${cfg.h}%`,
                backgroundColor: `color-mix(in oklab, ${cfg.cor} 78%, white)`,
                border: `1.5px solid ${cfg.cor}`,
                color: "oklch(0.28 0.02 60)",
              }}
            >
              {cfg.nome}
            </div>
          );
        })}
      </div>
    </div>
  );
}
