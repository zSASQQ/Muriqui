ALTER TABLE public.referencias
ADD COLUMN arquivo_path text,
ADD COLUMN arquivo_nome text,
ADD COLUMN arquivo_tipo text;

CREATE INDEX referencias_user_projeto_idx ON public.referencias (user_id, projeto_id);

CREATE POLICY "referencias imagens selecionar"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'referencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "referencias imagens inserir"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'referencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "referencias imagens atualizar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'referencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'referencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "referencias imagens remover"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'referencias'
  AND (storage.foldername(name))[1] = auth.uid()::text
);