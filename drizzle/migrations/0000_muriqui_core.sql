-- PERFIS
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  nome text,
  acesso_liberado boolean NOT NULL DEFAULT false,
  origem text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perfil proprio select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "perfil proprio update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- COMPRAS HOTMART
CREATE TABLE public.hotmart_compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  nome text,
  transacao text,
  produto text,
  evento text,
  status text NOT NULL DEFAULT 'ativo',
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, transacao)
);
GRANT ALL ON public.hotmart_compras TO service_role;
ALTER TABLE public.hotmart_compras ENABLE ROW LEVEL SECURITY;

-- PROJETOS
CREATE TABLE public.projetos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nome text NOT NULL DEFAULT 'Quarto do meu filho',
  nome_crianca text,
  idade text,
  orcamento numeric NOT NULL DEFAULT 0,
  paleta_id text,
  paleta_nome text,
  palavras text[] NOT NULL DEFAULT '{}',
  dados jsonb NOT NULL DEFAULT '{}'::jsonb,
  passos_concluidos int[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projetos TO authenticated;
GRANT ALL ON public.projetos TO service_role;
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projetos proprios" ON public.projetos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ITENS DE COMPRA
CREATE TABLE public.itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id uuid NOT NULL REFERENCES public.projetos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  nome text NOT NULL,
  camada int NOT NULL DEFAULT 1,
  preco numeric NOT NULL DEFAULT 0,
  comprado boolean NOT NULL DEFAULT false,
  seguranca_ok boolean NOT NULL DEFAULT false,
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itens TO authenticated;
GRANT ALL ON public.itens TO service_role;
ALTER TABLE public.itens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "itens proprios" ON public.itens FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- REFERENCIAS (painel de estilo)
CREATE TABLE public.referencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id uuid NOT NULL REFERENCES public.projetos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  url text,
  titulo text,
  cor_dominante text,
  material text,
  cheio_vazio text,
  no_painel boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referencias TO authenticated;
GRANT ALL ON public.referencias TO service_role;
ALTER TABLE public.referencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referencias proprias" ON public.referencias FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TRIGGER: novo usuario cria perfil e checa compra hotmart
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tem_compra boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.hotmart_compras
    WHERE lower(email) = lower(NEW.email) AND status = 'ativo'
  ) INTO tem_compra;

  INSERT INTO public.profiles (id, email, nome, acesso_liberado, origem)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.raw_user_meta_data ->> 'full_name'),
    tem_compra,
    CASE WHEN tem_compra THEN 'hotmart' ELSE 'manual' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- TRIGGER: compra hotmart libera/bloqueia perfil existente
CREATE OR REPLACE FUNCTION public.sync_acesso_hotmart()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET acesso_liberado = (NEW.status = 'ativo'),
      origem = 'hotmart'
  WHERE lower(email) = lower(NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_hotmart_compra
AFTER INSERT OR UPDATE ON public.hotmart_compras
FOR EACH ROW EXECUTE FUNCTION public.sync_acesso_hotmart();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER projetos_touch BEFORE UPDATE ON public.projetos
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();