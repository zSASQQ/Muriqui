# Estúdio do Quarto — redesenho do sistema interno conforme Base44

**Data:** 2026-09-21
**Projeto:** Quarto Pronto Mágico (muriqui / kid-room-planner)
**Objetivo:** Reconstruir a área logada (`/app`) para reproduzir fielmente as 9 telas do
Base44 aprovadas pela cliente Camila Tiveron, reaproveitando a marca visual e a camada
de dados que já existem.

## Decisões travadas com o cliente
- **Conteúdo:** seguir o Base44 (nomes + ferramentas das prints). Descartar os textos
  longos do método (`src/lib/passos.ts` atual) na área logada.
- **Entrega:** em 3 fases (layout → passos de conteúdo → planta interativa).
- **Visual:** fiel às prints, usando os tokens de marca existentes (`src/styles.css`),
  que já são quase idênticos ao Base44 (linho, folha/sálvia, argila/terracota, Fraunces).

## Não-objetivos
- Não mexer na landing (`/`), no login (`/auth`) nem no webhook Hotmart.
- Não alterar o gate de acesso (`acesso_liberado`).
- Não implementar login Google novo (fora de escopo).

## Arquitetura

### Shell de 3 colunas (redesenho de `src/routes/app.tsx`)
Layout fixo em todos os passos:
- **Esquerda — `SidebarJornada`:** marca "Estúdio / Quarto dos Sonhos"; lista dos 7 passos
  com ícone, título, subtítulo e estado (✓ concluído verde / atual terracota / pendente
  cinza); mini-card de orçamento (% + R$ x de R$ y) no rodapé.
- **Centro — `<Outlet/>`:** cabeçalho grande "Do Pinterest ao **Quarto Pronto**" + subtítulo,
  card de cabeçalho do passo com a **trilha horizontal** (stepper) dos 7 passos, e a
  ferramenta do passo atual.
- **Direita — `PainelResumo`:** card Orçamento, card Lista de Compras (resumo dos itens +
  "N itens pendentes"), botão escuro "Avançar / Próximo passo".

### Rotas
- `/app` → layout (shell) + redireciona para o primeiro passo não concluído.
- `/app/passo/$numero` → renderiza a ferramenta do passo N (1–7).
- Remover/aposentar `/app/paletas` e `/app/lista` como páginas próprias (viram parte dos
  passos 3 e 6). Manter o código antigo só se necessário para transição.

### Os 7 passos (novo `src/lib/jornada.ts`)
Cada passo: `{ numero, slug, titulo, subtitulo, icone }` + um componente de ferramenta.
1. **Inspiração** — Pinterest & Referências → moodboard (colar link ou upload de imagem).
2. **Medidas & Planta** — Dimensões do espaço → medidas + planta com móveis arrastáveis.
3. **Paleta & Conceito** — Cores e tema → tema, paleta com HEX, tons sugeridos, notas.
4. **Mobiliário** — Peças principais → checklist (progresso X/N) + adicionar peça.
5. **Decoração & Detalhes** — Toques finais → checklist + adicionar item.
6. **Compras & Orçamento** — Lista e budget → orçamento total + form (nome/preço/link/
   categoria) + lista com tag de categoria + valor total.
7. **Montagem & Finalização** — Checklist final → checklist + "Finalizar projeto".

## Modelo de dados (reaproveitar o existente)
- `projetos.orcamento` — orçamento total (ex.: 15000).
- `projetos.passos_concluidos` (int[]) — quais passos estão ✓.
- `projetos.paleta_id/paleta_nome/palavras` — já existem.
- `projetos.dados` (jsonb) — guarda o que é novo, sem migração:
  - `dimensoes`: `{ texto, area, observacoes }`
  - `planta`: `[{ id, tipo, x, y, w, h }]` (posições dos móveis)
  - `conceito`: `{ tema, notas }`
  - `paleta`: `[{ hex, nome? }]`
  - `checklists`: `{ mobiliario: [{label, done}], decoracao: [...], montagem: [...] }`
- `itens` (tabela) — lista de compras do Passo 6. Já tem nome, preço, comprado.
  **Mudança necessária:** adicionar coluna `categoria text` (Base44 usa categorias como
  Mobiliário, Têxtil, Iluminação, Decoração). A coluna `camada` (1–3) fica opcional/legado.
- `referencias` (tabela + bucket `referencias`) — moodboard do Passo 1. Já existe; exige
  o bucket privado `referencias` (10 MB) criado no Supabase Storage.

Hooks de dados já prontos e reutilizáveis: `useProjeto` (+ `salvar`), `useItens`,
`useReferencias` (`src/hooks/useProjeto.ts`).

## Componentes novos (previstos)
- `EstudioLayout` (shell 3 colunas) · `SidebarJornada` · `TrilhaPassos` (stepper) ·
  `PainelResumo` (Orçamento+Lista+Avançar) · `CardPasso` (moldura padrão do passo).
- Ferramentas: `PassoInspiracao`, `PassoMedidasPlanta` (+ `PlantaEditor` arrastável),
  `PassoPaleta`, `PassoChecklist` (reutilizável p/ 4, 5, 7), `PassoCompras`.

## Fases de entrega
- **Fase 1 — Casca do Estúdio:** `EstudioLayout`, `SidebarJornada`, `TrilhaPassos`,
  `PainelResumo`, navegação e estado de conclusão. Passos ainda com conteúdo placeholder.
  Resultado: já parece o Base44.
- **Fase 2 — Passos de conteúdo:** Inspiração, Paleta & Conceito, Mobiliário, Decoração,
  Montagem (checklists) e Compras & Orçamento ligados aos dados reais.
- **Fase 3 — Planta interativa:** Passo 2 com móveis arrastáveis em grade + medidas + dica.

## Notas visuais
- Fonte display Fraunces já configurada; títulos grandes serifados como nas prints.
- Cores: `--argila` (terracota) para acento/atual, `--folha` (sálvia) para concluído,
  botão "Avançar" em tom escuro (tinta). Cards com `papel` (borda + sombra suave).
- Layout responsivo: em telas estreitas, colunas empilham (menu vira topo/drawer).

## Riscos / detalhes a resolver na implementação
- **Moodboard por link do Pinterest:** buscar a imagem de uma URL exige ler o `og:image`
  (server-side) por causa de CORS. Simplificação inicial: salvar o link + permitir upload
  direto de imagem (já suportado). Preview de link fica como melhoria.
- **Planta arrastável:** usar pointer events nativos ou lib leve; manter simples (arrastar
  em grade, sem redimensionamento avançado na primeira versão).
- **Categoria vs camada:** adotar `categoria` (texto livre) como no Base44.
