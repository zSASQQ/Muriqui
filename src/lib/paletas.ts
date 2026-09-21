export type Cor = { papel: "Base" | "Apoio" | "Acento"; nome: string; hex: string };

export type Paleta = {
  id: string;
  numero: string;
  nome: string;
  tema: string;
  descricao: string;
  cores: Cor[];
  aplicacao: { base: string; apoio: string; acento: string };
  suaCara: string;
};

export const PALETAS: Paleta[] = [
  {
    id: "bosque-de-afeto",
    numero: "01",
    nome: "Bosque de afeto",
    tema: "natureza e afeto",
    descricao: "Natural, acolhedor e cheio de pequenas descobertas.",
    cores: [
      { papel: "Base", nome: "Linho claro", hex: "#F4F0E6" },
      { papel: "Apoio", nome: "Verde folha", hex: "#9EAF92" },
      { papel: "Acento", nome: "Argila", hex: "#BB7656" },
    ],
    aplicacao: {
      base: "Linho claro nas paredes de fundo e em parte dos tecidos.",
      apoio: "Verde folha em uma área de pintura ou na cabeceira.",
      acento: "Argila em uma manta, uma estampa ou pequenos objetos.",
    },
    suaCara:
      "Madeira clara e tecidos de trama aparente. Traga o verde de uma paisagem querida e inclua desenhos da criança. Para um conjunto mais leve, leve o verde para os tecidos.",
  },
  {
    id: "sol-de-quintal",
    numero: "02",
    nome: "Sol de quintal",
    tema: "luz e brincadeira",
    descricao: "Uma combinação luminosa com um toque de brincadeira.",
    cores: [
      { papel: "Base", nome: "Areia clara", hex: "#F6F1E4" },
      { papel: "Apoio", nome: "Mel", hex: "#E0B473" },
      { papel: "Acento", nome: "Azul sereno", hex: "#7FA0B5" },
    ],
    aplicacao: {
      base: "Areia clara nas paredes e nas superfícies amplas.",
      apoio: "Mel em tecidos, cabeceira ou um móvel de presença.",
      acento: "Azul sereno em detalhes repetidos em dois pontos do quarto.",
    },
    suaCara:
      "Madeira de tom mel e algodão de textura simples. Se o piso já for amarelado, compare as amostras juntas. Você pode reduzir o mel nos tecidos e deixar o azul aparecer um pouco mais.",
  },
  {
    id: "mare-de-descobertas",
    numero: "03",
    nome: "Maré de descobertas",
    tema: "areia e azul",
    descricao: "Azul, areia e terra em um encontro de tons suaves.",
    cores: [
      { papel: "Base", nome: "Areia", hex: "#F5F1E8" },
      { papel: "Apoio", nome: "Azul maré", hex: "#AEC9CF" },
      { papel: "Acento", nome: "Terra", hex: "#C47359" },
    ],
    aplicacao: {
      base: "Areia nas paredes e nos tecidos maiores.",
      apoio: "Azul maré em uma área de pintura ou na roupa de cama.",
      acento: "Terra em pequenos detalhes, repetidos em dois pontos do quarto.",
    },
    suaCara:
      "Madeira clara e tecidos com listras delicadas. A inspiração pode vir de uma viagem ou de um livro. Use as cores sem precisar transformar o quarto inteiro em um tema de praia.",
  },
  {
    id: "jardim-de-historias",
    numero: "04",
    nome: "Jardim de histórias",
    tema: "rosa e verde",
    descricao: "Rosa e verde para compor uma história que pode ser de todos.",
    cores: [
      { papel: "Base", nome: "Rosa leitoso", hex: "#F7F0EC" },
      { papel: "Apoio", nome: "Rosa antigo", hex: "#D4A5A5" },
      { papel: "Acento", nome: "Verde oliva", hex: "#7D8B5F" },
    ],
    aplicacao: {
      base: "Rosa leitoso nas paredes de fundo.",
      apoio: "Rosa antigo em tecidos ou em uma faixa de pintura.",
      acento: "Verde oliva em uma estampa, um detalhe de móvel ou um tecido.",
    },
    suaCara:
      "Madeira natural e uma única família de estampas. Troque flores por listras, animais ou formas abstratas se isso representar melhor a criança. O nome da paleta é só uma inspiração.",
  },
  {
    id: "terra-de-aventuras",
    numero: "05",
    nome: "Terra de aventuras",
    tema: "tons de terra",
    descricao: "Tons terrosos para quem gosta de cor com presença.",
    cores: [
      { papel: "Base", nome: "Cal quente", hex: "#F2EAE1" },
      { papel: "Apoio", nome: "Barro", hex: "#C08A6A" },
      { papel: "Acento", nome: "Musgo", hex: "#6E7A5A" },
    ],
    aplicacao: {
      base: "Cal quente nas paredes e no piso claro.",
      apoio: "Barro em uma parede de destaque ou em tecidos amplos.",
      acento: "Musgo nos detalhes do enxoval ou em uma peça escolhida.",
    },
    suaCara:
      "Madeira média e tecidos sem brilho. Se o quarto já tiver muita madeira escura, experimente manter as paredes claras e usar o barro nos tecidos. Observe o conjunto real.",
  },
  {
    id: "ceu-de-lavanda",
    numero: "06",
    nome: "Céu de lavanda",
    tema: "lavanda e azul",
    descricao: "Lavanda e azul para explorar uma combinação delicada.",
    cores: [
      { papel: "Base", nome: "Névoa", hex: "#F4F1F5" },
      { papel: "Apoio", nome: "Lavanda", hex: "#C6BBD9" },
      { papel: "Acento", nome: "Azul manhã", hex: "#8FA9C4" },
    ],
    aplicacao: {
      base: "Névoa nas paredes e nas superfícies amplas.",
      apoio: "Lavanda em tecidos ou em uma área de pintura.",
      acento: "Azul manhã em um objeto querido ou numa estampa.",
    },
    suaCara:
      "Madeira clara e tecidos de trama leve. Se a criança gosta de roxo intenso, um objeto nessa cor pode assumir o papel de acento. Teste o conjunto antes de acrescentar outros tons.",
  },
  {
    id: "festa-de-brincar",
    numero: "07",
    nome: "Festa de brincar",
    tema: "cor nos detalhes",
    descricao: "Uma base clara abre espaço para cores mais presentes.",
    cores: [
      { papel: "Base", nome: "Branco quente", hex: "#F7F5EF" },
      { papel: "Apoio", nome: "Amarelo festa", hex: "#E8B34A" },
      { papel: "Acento", nome: "Coral", hex: "#D96A52" },
    ],
    aplicacao: {
      base: "Branco quente nas paredes, deixando espaço para os brinquedos.",
      apoio: "Amarelo festa em um móvel, um tapete ou uma faixa pintada.",
      acento: "Coral em almofadas, ganchos e pequenos objetos.",
    },
    suaCara:
      "Madeira clara e grafismos de desenho simples. Inclua os brinquedos e livros que já ficam à vista no seu painel de cores. Se eles forem muito variados, teste tecidos com menos estampa.",
  },
  {
    id: "abraco-natural",
    numero: "08",
    nome: "Abraço natural",
    tema: "neutros e textura",
    descricao: "Neutros, textura e um contraste que aparece nos detalhes.",
    cores: [
      { papel: "Base", nome: "Aveia", hex: "#F1ECE3" },
      { papel: "Apoio", nome: "Areia tostada", hex: "#CFC3B2" },
      { papel: "Acento", nome: "Cacau", hex: "#6B4A36" },
    ],
    aplicacao: {
      base: "Aveia nas paredes e nos tecidos de maior área.",
      apoio: "Areia tostada em cortinas, tapete ou marcenaria.",
      acento: "Cacau em detalhes pontuais e peças de madeira escura.",
    },
    suaCara:
      "Madeira natural e tecidos com texturas diferentes. Uma peça colorida de que a criança gosta pode substituir o cacau como acento. Preserve a base e teste uma mudança por vez.",
  },
];

export const getPaleta = (id?: string | null) => PALETAS.find((p) => p.id === id);
