import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Projeto = {
  id: string;
  user_id: string;
  nome: string;
  nome_crianca: string | null;
  idade: string | null;
  orcamento: number;
  paleta_id: string | null;
  paleta_nome: string | null;
  palavras: string[];
  dados: Record<string, unknown>;
  passos_concluidos: number[];
};

export type Item = {
  id: string;
  projeto_id: string;
  user_id: string;
  nome: string;
  camada: number;
  categoria: string | null;
  preco: number;
  comprado: boolean;
  seguranca_ok: boolean;
  observacao: string | null;
};

export type Referencia = {
  id: string;
  projeto_id: string;
  user_id: string;
  url: string | null;
  titulo: string | null;
  cor_dominante: string | null;
  material: string | null;
  cheio_vazio: string | null;
  no_painel: boolean;
  arquivo_path: string | null;
  arquivo_nome: string | null;
  arquivo_tipo: string | null;
  imagem_url?: string | null;
};

export function useProjeto() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["projeto", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Projeto | null> => {
      const { data, error } = await supabase
        .from("projetos")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1);
      if (error) throw error;
      if (data && data.length > 0) return data[0] as unknown as Projeto;

      const { data: novo, error: erroNovo } = await supabase
        .from("projetos")
        .insert({ user_id: user!.id })
        .select("*")
        .single();
      if (erroNovo) throw erroNovo;
      return novo as unknown as Projeto;
    },
  });

  const salvar = useMutation({
    mutationFn: async (patch: Partial<Projeto>) => {
      const id = query.data?.id;
      if (!id) throw new Error("Projeto não carregado");
      const { error } = await supabase.from("projetos").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projeto", user?.id] }),
  });

  return { projeto: query.data ?? null, carregando: query.isLoading, salvar };
}

export function useItens(projetoId?: string) {
  const qc = useQueryClient();
  const key = ["itens", projetoId];

  const query = useQuery({
    queryKey: key,
    enabled: !!projetoId,
    queryFn: async (): Promise<Item[]> => {
      const { data, error } = await supabase
        .from("itens")
        .select("*")
        .eq("projeto_id", projetoId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Item[];
    },
  });

  const invalidar = () => qc.invalidateQueries({ queryKey: key });

  const adicionar = useMutation({
    mutationFn: async (item: {
      nome: string;
      preco: number;
      user_id: string;
      categoria?: string | null;
      observacao?: string | null;
      camada?: number;
    }) => {
      const { error } = await supabase
        .from("itens")
        .insert({ camada: 1, ...item, projeto_id: projetoId! } as never);
      if (error) throw error;
    },
    onSuccess: invalidar,
  });

  const atualizar = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Item> & { id: string }) => {
      const { error } = await supabase.from("itens").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidar,
  });

  const remover = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("itens").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidar,
  });

  return { itens: query.data ?? [], carregando: query.isLoading, adicionar, atualizar, remover };
}

export function useReferencias(projetoId?: string) {
  const qc = useQueryClient();
  const key = ["referencias", projetoId];

  const query = useQuery({
    queryKey: key,
    enabled: !!projetoId,
    queryFn: async (): Promise<Referencia[]> => {
      const { data, error } = await supabase
        .from("referencias")
        .select("*")
        .eq("projeto_id", projetoId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const referencias = (data ?? []) as unknown as Referencia[];
      const caminhos = referencias.flatMap((ref) => (ref.arquivo_path ? [ref.arquivo_path] : []));
      if (caminhos.length === 0) return referencias;

      const { data: assinadas, error: erroAssinadas } = await supabase.storage
        .from("referencias")
        .createSignedUrls(caminhos, 3600);
      if (erroAssinadas) throw erroAssinadas;
      const urls = new Map(assinadas.map((item) => [item.path, item.signedUrl]));
      return referencias.map((ref) => ({
        ...ref,
        imagem_url: ref.arquivo_path ? (urls.get(ref.arquivo_path) ?? null) : null,
      }));
    },
  });

  const invalidar = () => qc.invalidateQueries({ queryKey: key });

  const adicionar = useMutation({
    mutationFn: async (ref: Partial<Referencia> & { user_id: string; arquivo?: File | null }) => {
      const { arquivo, ...dados } = ref;
      let arquivoPath: string | null = null;

      if (arquivo) {
        if (!arquivo.type.startsWith("image/")) throw new Error("Escolha um arquivo de imagem.");
        if (arquivo.size > 10 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 10 MB.");
        const extensao = arquivo.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        arquivoPath = `${ref.user_id}/${crypto.randomUUID()}.${extensao}`;
        const { error: erroUpload } = await supabase.storage
          .from("referencias")
          .upload(arquivoPath, arquivo, { contentType: arquivo.type, upsert: false });
        if (erroUpload) throw erroUpload;
      }

      const { error } = await supabase.from("referencias").insert({
        ...dados,
        projeto_id: projetoId!,
        arquivo_path: arquivoPath,
        arquivo_nome: arquivo?.name ?? null,
        arquivo_tipo: arquivo?.type ?? null,
      } as never);
      if (error) {
        if (arquivoPath) await supabase.storage.from("referencias").remove([arquivoPath]);
        throw error;
      }
    },
    onSuccess: invalidar,
  });

  const atualizar = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Referencia> & { id: string }) => {
      const { error } = await supabase.from("referencias").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidar,
  });

  const remover = useMutation({
    mutationFn: async (id: string) => {
      const referencia = query.data?.find((item) => item.id === id);
      if (referencia?.arquivo_path) {
        const { error: erroArquivo } = await supabase.storage
          .from("referencias")
          .remove([referencia.arquivo_path]);
        if (erroArquivo) throw erroArquivo;
      }
      const { error } = await supabase.from("referencias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidar,
  });

  return { referencias: query.data ?? [], adicionar, atualizar, remover };
}

/**
 * Lê e grava valores no campo livre `dados` (jsonb) do projeto.
 * Cada ferramenta de passo guarda seu estado sob uma chave própria
 * (ex.: "conceito", "paleta", "check_mobiliario").
 */
export function useDados() {
  const { projeto, salvar } = useProjeto();
  const dados = (projeto?.dados ?? {}) as Record<string, unknown>;

  const setChave = (chave: string, valor: unknown) => {
    salvar.mutate({ dados: { ...dados, [chave]: valor } as Record<string, unknown> });
  };

  return { dados, setChave, salvando: salvar.isPending };
}
