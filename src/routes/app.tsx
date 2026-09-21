import { createFileRoute, Outlet, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProjeto, useItens } from "@/hooks/useProjeto";
import { Marca } from "@/components/Marca";
import { Button } from "@/components/ui/button";
import { SidebarJornada } from "@/components/estudio/SidebarJornada";
import { PainelResumo } from "@/components/estudio/PainelResumo";
import { TOTAL_PASSOS, proximoPasso, getPasso } from "@/lib/jornada";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, perfil, carregando, sair } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!carregando && !user) void navigate({ to: "/auth" });
  }, [user, carregando, navigate]);

  if (carregando || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="olho">carregando seu projeto…</p>
      </div>
    );
  }

  if (perfil && !perfil.acesso_liberado) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <Marca className="text-2xl" />
        <h1 className="mt-4 text-3xl">Ainda não encontramos sua compra</h1>
        <p className="max-w-md text-muted-foreground">
          Seu acesso é liberado automaticamente quando a compra do guia é aprovada na Hotmart. Confira se você
          entrou com o mesmo e-mail usado na compra: <strong>{perfil.email}</strong>.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="outline" onClick={() => void sair()}>
            Entrar com outro e-mail
          </Button>
          <Link to="/">
            <Button variant="ghost">Voltar ao início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <Estudio onSair={() => void sair()} nome={perfil?.nome ?? null} />;
}

function Estudio({ onSair, nome }: { onSair: () => void; nome: string | null }) {
  const { projeto, carregando, salvar } = useProjeto();
  const { itens } = useItens(projeto?.id);
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { numero?: string };

  if (carregando || !projeto) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="olho">carregando seu projeto…</p>
      </div>
    );
  }

  const concluidos = projeto.passos_concluidos ?? [];
  const numeroAtual = params.numero ? Number(params.numero) : proximoPasso(concluidos);
  const orcamento = Number(projeto.orcamento ?? 0);
  const gasto = itens.filter((i) => i.comprado).reduce((s, i) => s + Number(i.preco), 0);
  const temProximo = numeroAtual < TOTAL_PASSOS;
  const passoProximo = getPasso(numeroAtual + 1);

  const avancar = () => {
    const proximos = Array.from(new Set([...concluidos, numeroAtual])).sort((a, b) => a - b);
    salvar.mutate({ passos_concluidos: proximos });
    if (temProximo) void navigate({ to: "/app/passo/$numero", params: { numero: String(numeroAtual + 1) } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[248px_minmax(0,1fr)_320px]">
        {/* Menu lateral */}
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <SidebarJornada
            numeroAtual={numeroAtual}
            concluidos={concluidos}
            orcamento={orcamento}
            gasto={gasto}
            onSair={onSair}
          />
        </aside>

        {/* Centro */}
        <main className="min-w-0 py-6 lg:py-0">
          <header className="mb-8">
            <p className="olho flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Estúdio do Quarto
            </p>
            <h1 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
              Do Pinterest ao <span className="text-accent">Quarto Pronto</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Sete passos para transformar as referências em um projeto real, do conceito à montagem
              {nome ? ` do quarto de ${nome.split(" ")[0]}` : " do quarto"}.
            </p>
          </header>

          <Outlet />
        </main>

        {/* Coluna direita */}
        <aside className="mt-8 lg:mt-0 lg:sticky lg:top-6 lg:self-start">
          <PainelResumo
            orcamento={orcamento}
            gasto={gasto}
            itens={itens}
            temProximo={temProximo}
            onAvancar={avancar}
          />
          {passoProximo && (
            <p className="mt-4 px-1 text-right text-sm text-muted-foreground">
              Próximo: <span className="font-medium text-foreground">{passoProximo.titulo}</span>
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
