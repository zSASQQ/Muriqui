import { createFileRoute, Link } from "@tanstack/react-router";
import { Marca, Assinatura } from "@/components/Marca";
import { Button } from "@/components/ui/button";
import { PASSOS } from "@/lib/passos";
import { PALETAS } from "@/lib/paletas";
import { useAuth } from "@/hooks/useAuth";
import heroImg from "@/assets/hero-quarto.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Do Pinterest ao Quarto Pronto — muriqui" },
      {
        name: "description",
        content:
          "Um mapa em 7 passos para sair da pasta de referências e montar o quarto do seu filho: painel de estilo, paleta, medidas, camadas de compra, orçamento e segurança.",
      },
      { property: "og:title", content: "Do Pinterest ao Quarto Pronto — muriqui" },
      {
        property: "og:description",
        content: "O método da Muriqui para transformar referências em um quarto infantil bonito e funcional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { user } = useAuth();
  const paletaDestaque = PALETAS.find((paleta) => paleta.id === "bosque-de-afeto");

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Marca className="text-2xl" />
        <Link to={user ? "/app" : "/auth"}>
          <Button variant="ghost" size="sm">
            {user ? "Meu projeto" : "Entrar"}
          </Button>
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-8 pb-20 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="olho">Guia para ambientes infantis</p>
          <h1 className="mt-5 text-5xl leading-[1.05] text-foreground md:text-6xl">
            Do Pinterest ao <em className="not-italic destaque">Quarto Pronto</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Você salvou 347 pins e o quarto continua igual. Não é falta de gosto — é falta de mapa. Aqui você
            percorre os 7 passos, um de cada vez, e sai com decisões tomadas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={user ? "/app" : "/auth"}>
              <Button size="lg">{user ? "Continuar meu projeto" : "Começar meu projeto"}</Button>
            </Link>
            <a href="#passos">
              <Button size="lg" variant="outline">
                Ver os 7 passos
              </Button>
            </a>
          </div>
          <Assinatura className="mt-10" />
        </div>

        <div className="relative">
          <img
            src={heroImg}
            alt="Quarto infantil em tons de linho, verde folha e argila"
            width={1200}
            height={1400}
            className="w-full rounded-lg object-cover shadow-[var(--shadow-cartao)]"
          />
          <div className="papel absolute -bottom-8 -left-6 hidden w-56 p-4 md:block">
            <p className="olho">Sua paleta</p>
            <div className="mt-3 flex gap-2">
              {paletaDestaque?.cores.map((c) => (
                <span
                  key={c.hex}
                  className="h-10 flex-1 rounded-sm border"
                  style={{ backgroundColor: c.hex }}
                  title={`${c.nome} ${c.hex}`}
                />
              ))}
            </div>
            <p className="mt-3 font-display text-sm">Bosque de afeto</p>
          </div>
        </div>
      </section>

      <section className="border-y bg-secondary/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2">
          <div className="papel p-7">
            <p className="olho">Você está aqui</p>
            <p className="mt-3 font-display text-2xl">
              Pasta cheia. Nenhuma decisão tomada. Quarto igual há semanas.
            </p>
          </div>
          <div className="papel border-primary/40 p-7">
            <p className="olho">Você vai chegar aqui</p>
            <p className="mt-3 font-display text-2xl text-primary">
              Paleta definida. Lista de compras pronta. Quarto montado neste fim de semana.
            </p>
          </div>
        </div>
      </section>

      <section id="passos" className="mx-auto max-w-6xl px-6 py-20">
        <p className="olho">Capítulo 6</p>
        <h2 className="mt-3 text-4xl">Seu plano de ação em 7 passos</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Cada passo tem tempo estimado, um entregável e uma única pergunta: você fez isso?
        </p>

        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {PASSOS.map((p) => (
            <li key={p.numero} className="papel flex gap-5 p-6">
              <span className="font-display text-3xl text-accent">{String(p.numero).padStart(2, "0")}</span>
              <div>
                <h3 className="text-xl leading-snug">{p.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.resumo}</p>
                <p className="olho mt-3">{p.tempo}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t bg-secondary/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="olho">Cores para crescer</p>
          <h2 className="mt-3 text-4xl">Oito paletas para explorar</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PALETAS.map((pal) => (
              <div key={pal.id} className="papel overflow-hidden">
                <div className="flex h-24">
                  {pal.cores.map((c) => (
                    <span key={c.hex} className="flex-1" style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
                <div className="p-4">
                  <p className="olho">Paleta {pal.numero}</p>
                  <p className="mt-1 font-display text-lg">{pal.nome}</p>
                  <p className="text-sm text-muted-foreground">{pal.tema}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl">Inspiração sem método é só uma pasta cheia de sonhos.</h2>
        <p className="mt-4 text-muted-foreground">
          Já comprou na Hotmart? Use o mesmo e-mail da compra para entrar — seu acesso é liberado
          automaticamente.
        </p>
        <Link to={user ? "/app" : "/auth"} className="mt-8 inline-block">
          <Button size="lg">{user ? "Continuar meu projeto" : "Acessar o guia"}</Button>
        </Link>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10">
          <Marca className="text-xl" />
          <Assinatura />
        </div>
      </footer>
    </div>
  );
}
