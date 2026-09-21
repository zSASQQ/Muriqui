export type Passo = {
  numero: number;
  titulo: string;
  tempo: string;
  resumo: string;
  entregavel: string;
  pergunta: string;
  texto: string[];
};

export const PASSOS: Passo[] = [
  {
    numero: 1,
    titulo: "Filtrar suas referências e definir seu painel de estilo",
    tempo: "30 minutos",
    resumo: "Suas referências já têm uma resposta. Você só precisa saber onde olhar.",
    entregavel: "Três palavras-sensação e um painel com no máximo 5 imagens.",
    pergunta: "Você montou o seu painel de estilo?",
    texto: [
      "Abra suas pastas salvas e selecione no máximo 12 imagens. Não as mais bonitas — as que aparecem mais de uma vez nos seus favoritos.",
      "Para cada imagem favorita, anote a cor dominante, o material principal e se o espaço parece cheio ou vazio. O padrão que se repete é o seu estilo de verdade.",
      "Clareza de estilo não é saber tudo que você quer. É saber exatamente o que você não quer.",
    ],
  },
  {
    numero: 2,
    titulo: "Escolher a paleta de cores e testar no espaço real",
    tempo: "uma tarde",
    resumo: "Cores que funcionam sem erro: uma base, um apoio e um acento.",
    entregavel: "Paleta escolhida e amostra de 30x30 cm observada em três horários.",
    pergunta: "Você pintou a amostra e observou de manhã, à tarde e à noite?",
    texto: [
      "Com base no painel, escolha uma cor de base, uma de apoio e uma de acento. Use a regra 60/30/10 como referência de equilíbrio, não como medida exata.",
      "Compre amostra de tinta e pinte um quadrado de 30x30 cm na parede que vai receber a cor.",
      "Os códigos HEX identificam cores digitais e não equivalem a códigos de tinta de um fabricante. Confirme sempre com o leque físico.",
    ],
  },
  {
    numero: 3,
    titulo: "Mapear o quarto atual: o que fica, o que sai e o que entra",
    tempo: "1 hora",
    resumo: "Ler o espaço como uma decoradora lê: medidas, luz e circulação.",
    entregavel: "Medidas anotadas e as três listas preenchidas.",
    pergunta: "Você mediu o quarto e classificou tudo que está nele?",
    texto: [
      "Tire foto de cada parede. Meça o cômodo com fita métrica e anote largura, comprimento e altura do teto.",
      "Olhe para cada móvel e objeto com uma pergunta direta: isso serve para a fase atual do meu filho?",
      "O que não serve mais sai — doação, venda ou descarte. O que fica ganha posição confirmada. O que entra vai para a lista do próximo passo.",
    ],
  },
  {
    numero: 4,
    titulo: "Montar sua lista de compras dividida pelas três camadas",
    tempo: "40 minutos",
    resumo: "Camada 1 estrutura, Camada 2 conforto, Camada 3 personalidade.",
    entregavel: "Lista completa com cada item dentro de uma camada.",
    pergunta: "Cada item da sua lista tem uma camada definida?",
    texto: [
      "Camada 1 é estrutural: berço ou cama, colchão, cômoda com trocador, armário. Se você parar aqui, a criança já tem onde dormir e onde guardar as roupas.",
      "Camada 2 é funcional: cortina blackout, poltrona, tapete, iluminação além da luz de teto, porta-objetos da rotina.",
      "Camada 3 é decorativa: o que torna o quarto do seu filho — adesivo, almofada, nicho temático, os desenhos dele.",
    ],
  },
  {
    numero: 5,
    titulo: "Definir e distribuir o orçamento por camada",
    tempo: "20 minutos",
    resumo: "60% estrutura, 25% conforto, 15% personalidade.",
    entregavel: "Valor total distribuído e comparado com a lista real.",
    pergunta: "Seu orçamento está distribuído pelas três camadas?",
    texto: [
      "Pegue o valor total disponível e distribua 60% para a Camada 1, 25% para a Camada 2 e 15% para a Camada 3.",
      "Ajuste conforme o que você já tem — se o berço já existe, esse valor migra para onde houver lacuna real.",
      "O problema não é quanto você vai gastar. É gastar sem saber o que está construindo.",
    ],
  },
  {
    numero: 6,
    titulo: "Aplicar o checklist de segurança antes de confirmar qualquer compra",
    tempo: "15 minutos por item",
    resumo: "Um quarto seguro não é o quarto sem graça.",
    entregavel: "Cada item da lista com o checklist respondido.",
    pergunta: "Todos os itens passaram pelas quatro perguntas?",
    texto: [
      "O produto tem certificação do Inmetro?",
      "As bordas e acabamentos são seguros para a faixa etária do meu filho?",
      "O item vai estar fora do alcance ou sob supervisão?",
      "A instalação exige fixação na parede — e eu já verifiquei se é viável no meu espaço?",
    ],
  },
  {
    numero: 7,
    titulo: "Começar hoje",
    tempo: "30 minutos",
    resumo: "O quarto perfeito não é o que está no Pinterest. É o que está pronto.",
    entregavel: "Uma data marcada e a primeira ação feita.",
    pergunta: "Você marcou o dia da execução?",
    texto: [
      "Você chegou até aqui com conhecimento suficiente para começar. Não falta mais informação, falta só a primeira ação.",
      "O quarto do seu filho não precisa ser perfeito na primeira semana. Ele precisa ser seguro, funcional e feito com intenção.",
    ],
  },
];

export const CAMADAS = [
  { numero: 1, nome: "Estrutura", descricao: "O que o quarto precisa para existir.", percentual: 0.6 },
  { numero: 2, nome: "Conforto", descricao: "O que torna o quarto utilizável no dia a dia.", percentual: 0.25 },
  { numero: 3, nome: "Personalidade", descricao: "O que torna o quarto do seu filho.", percentual: 0.15 },
] as const;

export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
    Number.isFinite(v) ? v : 0,
  );
