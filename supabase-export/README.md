# Banco externo da Muriqui

## Ordem de instalação

1. No SQL Editor do seu projeto, execute `01-schema.sql` inteiro.
2. Em Storage, crie um bucket chamado `referencias`, mantenha-o **privado** e limite cada arquivo a **10 MB**.
3. No SQL Editor, execute `02-storage-policies.sql` inteiro.
4. Em Authentication, habilite e-mail/senha e configure a URL pública da aplicação e os redirecionamentos permitidos.
5. Na Hostinger, configure as variáveis abaixo. Nunca use a chave secreta em variáveis iniciadas por `VITE_`.

```text
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
HOTMART_HOTTOK=token-configurado-na-hotmart
```

## Hotmart

Cadastre o endpoint público `https://SEU-DOMINIO/api/public/hotmart` no webhook da Hotmart. O valor de `HOTMART_HOTTOK` precisa ser o mesmo configurado na Hotmart. Eventos aprovados liberam o acesso; cancelamentos, reembolsos e chargebacks bloqueiam o acesso.

## Segurança

- As tabelas do projeto usam RLS e cada cliente acessa somente seus próprios dados.
- O bucket é privado; as imagens são exibidas por links temporários.
- A chave secreta é exclusiva do servidor. Como uma chave foi compartilhada no chat, gere uma nova antes da publicação.