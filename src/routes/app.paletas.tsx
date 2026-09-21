import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PALETAS } from "@/lib/paletas";
import { useProjeto } from "@/hooks/useProjeto";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/app/paletas")({
  head: () => ({
    meta: [
      { title: "Cores para crescer — muriqui" },
      {
        name: "description",
        content: "Oito paletas para quartos infantis, com base, apoio e acento e ideias de aplicação.",
      },
      { property: "og:title", content: "Cores para crescer — muriqui" },
      { property: "og:description", content: "Oito paletas para quartos infantis com base, apoio e acento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Paletas,
});

function Paletas() {
  const { projeto, salvar } = useProjeto();

  const escolher = (id: string, nome: string) => {
    salvar.mutate(
      { paleta_id: id, paleta_nome: nome },
      { onSuccess: () => toast.success(`Paleta "${nome}" escolhida.`) },
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="olho">Um guia para escolhas com afeto</p>
        <h1 className="mt-2 text-4xl">Cores para crescer</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Comece com uma cor de base, uma de apoio e uma de acento. Use 60/30/10 como referência de
          equilíbrio, não como medida exata. Os códigos HEX são referências digitais e não equivalem a códigos
          de tinta.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {PALETAS.map((pal) => {
          const ativa = projeto?.paleta_id === pal.id;
          return (
            <article
              key={pal.id}
              className={`papel overflow-hidden ${ativa ? "border-primary ring-1 ring-primary/40" : ""}`}
            >
              <div className="flex h-28">
                {pal.cores.map((c) => (
                  <span key={c.hex} className="flex-1" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <p className="olho">Paleta {pal.numero}</p>
                  <h2 className="mt-1 text-2xl">{pal.nome}</h2>
                  <p className="text-sm text-muted-foreground">{pal.descricao}</p>
                </div>

                <dl className="grid grid-cols-3 gap-3 text-sm">
                  {pal.cores.map((c) => (
                    <div key={c.hex}>
                      <dt className="olho">{c.papel}</dt>
                      <dd className="mt-1 font-medium">{c.nome}</dd>
                      <dd className="font-mono text-xs text-muted-foreground">{c.hex}</dd>
                    </div>
                  ))}
                </dl>

                <div className="space-y-1 border-t pt-4 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Base</strong> {pal.aplicacao.base}
                  </p>
                  <p>
                    <strong className="text-foreground">Apoio</strong> {pal.aplicacao.apoio}
                  </p>
                  <p>
                    <strong className="text-foreground">Acento</strong> {pal.aplicacao.acento}
                  </p>
                </div>

                <div className="rounded-md bg-secondary/70 p-4 text-sm">
                  <p className="olho">Para ficar com a sua cara</p>
                  <p className="mt-2">{pal.suaCara}</p>
                </div>

                <Button
                  className="w-full"
                  variant={ativa ? "secondary" : "default"}
                  onClick={() => escolher(pal.id, pal.nome)}
                >
                  {ativa ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Minha paleta
                    </>
                  ) : (
                    "Escolher esta paleta"
                  )}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
