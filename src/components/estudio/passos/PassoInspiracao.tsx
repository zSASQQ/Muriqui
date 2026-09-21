import { useRef, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Upload, Link2, ImageIcon, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useReferencias } from "@/hooks/useProjeto";
import { Input } from "@/components/ui/input";

export function PassoInspiracao({ projetoId }: { projetoId: string }) {
  const { user } = useAuth();
  const { referencias, adicionar, remover } = useReferencias(projetoId);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const adicionarLink = () => {
    const link = url.trim();
    if (!link || !user) return;
    adicionar.mutate(
      { user_id: user.id, titulo: "Referência", url: link, no_painel: true },
      {
        onSuccess: () => {
          setUrl("");
          toast.success("Referência adicionada.");
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const enviarImagem = (arquivo: File | null) => {
    if (!arquivo || !user) return;
    adicionar.mutate(
      { user_id: user.id, titulo: arquivo.name, arquivo, no_painel: true },
      {
        onSuccess: () => toast.success("Imagem adicionada."),
        onError: (e) => toast.error(e.message),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
          <Sparkles className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-lg">Monte seu moodboard</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Cole o link de uma imagem do Pinterest ou envie sua própria referência.
        </p>

        <div className="mx-auto mt-5 flex max-w-md gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarLink())}
            placeholder="https://pinterest.com/…"
          />
          <button
            type="button"
            onClick={adicionarLink}
            disabled={adicionar.isPending}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Link2 className="h-4 w-4" /> Adicionar
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          <Upload className="h-4 w-4" /> Enviar imagem
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            enviarImagem(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </div>

      {referencias.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {referencias.map((r) => (
            <div key={r.id} className="group relative aspect-square overflow-hidden rounded-xl border bg-secondary">
              {r.imagem_url ? (
                <img src={r.imagem_url} alt={r.titulo ?? "Referência"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}

              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs text-foreground shadow-suave"
                >
                  <Link2 className="h-3 w-3" /> Fonte
                </a>
              )}

              <button
                type="button"
                onClick={() => remover.mutate(r.id)}
                aria-label="Remover referência"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-suave transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
