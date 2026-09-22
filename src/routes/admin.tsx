import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Plus, Search, ArrowLeft, Check, Ban } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Marca } from "@/components/Marca";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Alunos — muriqui" }] }),
  component: AdminPage,
});

type Aluno = {
  id: string;
  email: string;
  nome: string | null;
  acesso_liberado: boolean;
  origem: string;
  is_admin: boolean;
  created_at: string;
};

function AdminPage() {
  const { user, perfil, carregando, sair } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!carregando && !user) void navigate({ to: "/auth" });
  }, [user, carregando, navigate]);

  if (carregando || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="olho">carregando…</p>
      </div>
    );
  }

  if (!perfil?.is_admin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <Marca className="text-2xl" />
        <h1 className="mt-4 text-3xl">Área restrita</h1>
        <p className="max-w-md text-muted-foreground">Esta página é só para administradores.</p>
        <Link to="/app">
          <Button variant="outline">Voltar ao app</Button>
        </Link>
      </div>
    );
  }

  return <Painel onSair={() => void sair()} />;
}

function Painel({ onSair }: { onSair: () => void }) {
  const qc = useQueryClient();
  const [busca, setBusca] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { data: alunos = [], isLoading } = useQuery({
    queryKey: ["alunos"],
    queryFn: async (): Promise<Aluno[]> => {
      // Leitura direta com RLS: a política "admin ve todos perfis" libera todos os perfis para admins.
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, nome, acesso_liberado, origem, is_admin, created_at")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Aluno[];
    },
  });

  const criar = useMutation({
    mutationFn: async () => {
      // Criar conta usa a chave secreta → roda numa função do Supabase (Edge Function).
      const { data, error } = await supabase.functions.invoke("criar-aluno", {
        body: { nome, email, senha },
      });
      if (error) throw new Error((data as { error?: string })?.error || error.message);
      if (data && (data as { error?: string }).error) throw new Error((data as { error?: string }).error);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alunos"] });
      setNome("");
      setEmail("");
      setSenha("");
      toast.success("Aluno criado e com acesso liberado.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const acesso = useMutation({
    mutationFn: async (v: { id: string; liberado: boolean }) => {
      // Update direto com RLS: a política "admin atualiza perfis" permite ao admin liberar/bloquear.
      const { error } = await supabase
        .from("profiles")
        .update({ acesso_liberado: v.liberado } as never)
        .eq("id", v.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alunos"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const filtrados = alunos.filter((a) => {
    const q = busca.trim().toLowerCase();
    if (!q) return true;
    return a.email.toLowerCase().includes(q) || (a.nome ?? "").toLowerCase().includes(q);
  });

  const fmtData = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/app" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao app
          </Link>
          <Marca className="text-lg" />
          <Button variant="ghost" size="sm" onClick={onSair}>
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div>
          <p className="olho flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-accent" /> Administração
          </p>
          <h1 className="mt-2 font-display text-4xl">Alunos</h1>
          <p className="mt-2 text-muted-foreground">Gerencie os acessos ao guia.</p>
        </div>

        {/* Adicionar aluno */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            criar.mutate();
          }}
          className="papel space-y-4 p-6"
        >
          <p className="olho">Adicionar aluno</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Camila Tiveron" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aluna@email.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha (mín. 6)</Label>
              <Input
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="senha do aluno"
                required
                minLength={6}
              />
            </div>
          </div>
          <Button type="submit" disabled={criar.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            {criar.isPending ? "Criando…" : "Criar e liberar acesso"}
          </Button>
        </form>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por e-mail ou nome…"
            className="pl-9"
          />
        </div>

        {/* Lista */}
        <div className="papel overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b px-5 py-3 sm:grid-cols-[1.5fr_1fr_auto_auto]">
            <span className="olho">Aluno</span>
            <span className="olho hidden sm:block">Origem</span>
            <span className="olho hidden sm:block">Desde</span>
            <span className="olho text-right">Acesso</span>
          </div>

          {isLoading ? (
            <p className="olho px-5 py-6">carregando alunos…</p>
          ) : filtrados.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">Nenhum aluno encontrado.</p>
          ) : (
            <ul className="divide-y">
              {filtrados.map((a) => (
                <li
                  key={a.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 sm:grid-cols-[1.5fr_1fr_auto_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.nome || "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.email}</p>
                  </div>
                  <span className="hidden text-sm text-muted-foreground sm:block">
                    {a.origem === "hotmart" ? "Hotmart" : "Manual"}
                    {a.is_admin ? " · Admin" : ""}
                  </span>
                  <span className="hidden text-sm text-muted-foreground sm:block">{fmtData(a.created_at)}</span>
                  <div className="flex items-center justify-end gap-3">
                    <span
                      className={cn(
                        "hidden rounded-full px-2 py-0.5 text-xs sm:inline-block",
                        a.acesso_liberado ? "bg-primary/12 text-primary" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {a.acesso_liberado ? "Liberado" : "Bloqueado"}
                    </span>
                    <Button
                      variant={a.acesso_liberado ? "outline" : "default"}
                      size="sm"
                      disabled={acesso.isPending}
                      onClick={() => acesso.mutate({ id: a.id, liberado: !a.acesso_liberado })}
                    >
                      {a.acesso_liberado ? (
                        <>
                          <Ban className="mr-1.5 h-3.5 w-3.5" /> Bloquear
                        </>
                      ) : (
                        <>
                          <Check className="mr-1.5 h-3.5 w-3.5" /> Liberar
                        </>
                      )}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
