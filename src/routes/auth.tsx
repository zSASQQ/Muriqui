import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Marca, Assinatura } from "@/components/Marca";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — muriqui" },
      {
        name: "description",
        content: "Acesse o guia Do Pinterest ao Quarto Pronto com o mesmo e-mail usado na compra.",
      },
      { property: "og:title", content: "Entrar — muriqui" },
      { property: "og:description", content: "Acesse o guia Do Pinterest ao Quarto Pronto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, carregando } = useAuth();
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!carregando && user) void navigate({ to: "/app" });
  }, [user, carregando, navigate]);

  const entrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")).trim().toLowerCase(),
      password: String(form.get("senha")),
    });
    setEnviando(false);
    if (error) {
      toast.error(error.message.includes("Invalid login") ? "E-mail ou senha incorretos." : error.message);
      return;
    }
    void navigate({ to: "/app" });
  };

  const cadastrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setEnviando(true);
    const { data, error } = await supabase.auth.signUp({
      email: String(form.get("email")).trim().toLowerCase(),
      password: String(form.get("senha")),
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: { nome: String(form.get("nome")) },
      },
    });
    setEnviando(false);
    if (error) {
      toast.error(
        error.message.toLowerCase().includes("already")
          ? "Esse e-mail já tem conta. Use a aba Entrar."
          : error.message,
      );
      return;
    }
    if (data.session) {
      void navigate({ to: "/app" });
    } else {
      toast.success("Conta criada! Confirme o e-mail que enviamos para você.");
    }
  };

  const comGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto w-full max-w-6xl px-6 py-6">
        <Link to="/">
          <Marca className="text-2xl" />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-20">
        <p className="olho">Guia para ambientes infantis</p>
        <h1 className="mt-3 text-4xl">Seu projeto começa aqui</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Use o mesmo e-mail da compra na Hotmart para liberar o acesso automaticamente.
        </p>

        <div className="papel mt-8 p-6">
          <Tabs defaultValue="entrar">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entrar">Entrar</TabsTrigger>
              <TabsTrigger value="criar">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="entrar" className="mt-6">
              <form onSubmit={entrar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="e-email">E-mail</Label>
                  <Input id="e-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-senha">Senha</Label>
                  <Input id="e-senha" name="senha" type="password" required autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full" disabled={enviando}>
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="criar" className="mt-6">
              <form onSubmit={cadastrar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="c-nome">Seu nome</Label>
                  <Input id="c-nome" name="nome" required autoComplete="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-email">E-mail da compra</Label>
                  <Input id="c-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-senha">Senha</Label>
                  <Input
                    id="c-senha"
                    name="senha"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={enviando}>
                  Criar minha conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="olho">ou</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={comGoogle}>
            Continuar com o Google
          </Button>
        </div>

        <Assinatura className="mt-10 text-center" />
      </main>
    </div>
  );
}
