# Reformulação do estúdio Muriqui

## Objetivo
Reproduzir de perto a experiência das telas enviadas, mantendo a identidade visual, os textos e os dados da Muriqui. A área pública e a tela de acesso permanecem como estão; a reformulação será concentrada no ambiente interno.

## Estrutura visual
- Criar menu lateral fixo no computador com os 7 passos, estado atual, concluídos e resumo do orçamento.
- Criar navegação recolhível no celular, sem perder acesso aos passos.
- Adotar o cabeçalho editorial “Do Pinterest ao Quarto Pronto”, com nome da criança/projeto.
- Exibir em cada passo um painel horizontal de progresso com etapas concluídas, etapa atual e próximo passo.
- Organizar a área de trabalho em conteúdo principal e coluna lateral com orçamento, resumo da lista e botão de avanço.
- Preservar a paleta Muriqui de linho, argila e verde, refinando tipografia, bordas, sombras e densidade para se aproximar das referências.

## Os 7 passos
1. **Inspiração** — envio de imagem ou link, painel visual de referências e palavras-sensação.
2. **Medidas & Planta** — medidas, área, observações e planta interativa com móveis posicionáveis.
3. **Paleta & Conceito** — tema, paleta escolhida, tons sugeridos e notas do conceito.
4. **Mobiliário** — checklist editável de peças principais, inclusão e remoção de itens.
5. **Decoração & Detalhes** — checklist editável de acabamentos e elementos decorativos.
6. **Compras & Orçamento** — orçamento total, inclusão de produtos, categorias, preços e lista completa.
7. **Montagem & Finalização** — checklist final de instalação, organização e segurança.

## Comportamento e dados
- Reordenar o conteúdo atual para corresponder à jornada das referências, sem perder informações já salvas.
- Salvar campos, listas, checklists e posições da planta no projeto existente.
- Manter imagens de referência no armazenamento privado já configurado.
- Manter itens e valores na lista de compras existente, com atualização imediata dos resumos laterais.
- Permitir concluir/reabrir cada etapa e refletir o estado em toda a navegação.
- Usar o nome da criança quando disponível e textos neutros quando ainda não preenchido.

## Implementação técnica
- Refatorar o ambiente interno em componentes compartilhados para menu, cabeçalho, progresso, painel lateral e cartões de etapa.
- Reestruturar a tela dinâmica dos passos para os sete conteúdos acima.
- Criar a planta visual com interação por arrastar, limites do espaço e posições persistidas no campo de dados do projeto.
- Reaproveitar as tabelas atuais; esta reformulação não exige novas tabelas nem migração de banco.
- Preservar autenticação, liberação Hotmart, regras de acesso e rotas existentes.

## Validação
- Testar todos os sete menus, salvamento, avanço, conclusão, orçamento, lista e upload de imagens.
- Conferir a experiência em computador e celular, inclusive menu recolhível, planta e coluna lateral.
- Verificar ausência de cortes, sobreposições, erros de navegação e perda de dados existentes.
