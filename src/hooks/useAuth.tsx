import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Perfil = {
  id: string;
  email: string;
  nome: string | null;
  acesso_liberado: boolean;
  origem: string;
  is_admin: boolean;
};

type AuthValue = {
  user: User | null;
  session: Session | null;
  perfil: Perfil | null;
  carregando: boolean;
  recarregarPerfil: () => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  const buscarPerfil = async (userId: string) => {
    // select("*") é resiliente: se a coluna is_admin ainda não existir no banco,
    // a query não quebra (is_admin apenas fica indefinido → tratado como false).
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (!data) {
      setPerfil(null);
      return;
    }
    const p = data as Record<string, unknown>;
    setPerfil({
      id: String(p["id"]),
      email: String(p["email"]),
      nome: (p["nome"] as string | null) ?? null,
      acesso_liberado: !!p["acesso_liberado"],
      origem: String(p["origem"] ?? "manual"),
      is_admin: !!p["is_admin"],
    });
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => void buscarPerfil(s.user.id), 0);
      } else {
        setPerfil(null);
      }
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) await buscarPerfil(data.session.user.id);
      setCarregando(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthValue = {
    user: session?.user ?? null,
    session,
    perfil,
    carregando,
    recarregarPerfil: async () => {
      if (session?.user) await buscarPerfil(session.user.id);
    },
    sair: async () => {
      await supabase.auth.signOut();
      setPerfil(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}
