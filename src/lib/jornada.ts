import {
  Sparkles,
  Ruler,
  Palette,
  Sofa,
  Paintbrush,
  ShoppingBag,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";

/**
 * A jornada de 7 passos do Estúdio do Quarto, conforme o design aprovado (Base44).
 * Os dados de cada passo ficam no campo `dados` (jsonb) do projeto ou nas tabelas
 * `itens` / `referencias`. Aqui fica só a definição/metadados de cada passo.
 */
export type PassoJornada = {
  numero: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  icone: LucideIcon;
};

export const JORNADA: PassoJornada[] = [
  { numero: 1, slug: "inspiracao", titulo: "Inspiração", subtitulo: "Pinterest & Referências", icone: Sparkles },
  { numero: 2, slug: "medidas", titulo: "Medidas & Planta", subtitulo: "Dimensões do espaço", icone: Ruler },
  { numero: 3, slug: "paleta", titulo: "Paleta & Conceito", subtitulo: "Cores e tema", icone: Palette },
  { numero: 4, slug: "mobiliario", titulo: "Mobiliário", subtitulo: "Peças principais", icone: Sofa },
  { numero: 5, slug: "decoracao", titulo: "Decoração & Detalhes", subtitulo: "Toques finais", icone: Paintbrush },
  { numero: 6, slug: "compras", titulo: "Compras & Orçamento", subtitulo: "Lista e budget", icone: ShoppingBag },
  { numero: 7, slug: "montagem", titulo: "Montagem & Finalização", subtitulo: "Checklist final", icone: CircleCheck },
];

export const TOTAL_PASSOS = JORNADA.length;

export function getPasso(numero: number): PassoJornada | undefined {
  return JORNADA.find((p) => p.numero === numero);
}

/** Primeiro passo ainda não concluído (ou o passo 1 se tudo estiver concluído). */
export function proximoPasso(concluidos: number[]): number {
  const pendente = JORNADA.find((p) => !concluidos.includes(p.numero));
  return pendente?.numero ?? 1;
}

/* ----------------------------------------------------------------------------
 * Configurações de conteúdo dos passos (usadas pelas ferramentas da Fase 2)
 * -------------------------------------------------------------------------- */

/** Itens iniciais dos checklists (o usuário pode marcar, adicionar e remover). */
export const CHECKLIST_MOBILIARIO = [
  "Berço ou mini berço",
  "Cômoda com trocador",
  "Poltrona de amamentação",
  "Guarda-roupa",
  "Estante de organização",
];

export const CHECKLIST_DECORACAO = [
  "Cortinas blackout",
  "Tapete macio",
  "Móbile sobre o berço",
  "Luminária de abajur",
  "Quadros e arte de parede",
  "Almofadas e manta",
];

export const CHECKLIST_MONTAGEM = [
  "Montar o berço com segurança",
  "Fixar móveis na parede",
  "Instalar blackout nas janelas",
  "Organizar cômoda e trocador",
  "Testar iluminação noturna",
  "Limpeza final do quarto",
];

/** Tons sugeridos para a paleta (Passo 3). */
export const TONS_SUGERIDOS = [
  "#E07A5F",
  "#81A684",
  "#E6C86E",
  "#3D5A80",
  "#E4E0D3",
  "#1F2937",
  "#E8A45C",
  "#A7D3CB",
  "#EAD9D5",
  "#9DBFE0",
];

/** Categorias de itens da lista de compras (Passo 6). */
export const CATEGORIAS_COMPRA = [
  "Mobiliário",
  "Têxtil",
  "Iluminação",
  "Decoração",
  "Segurança",
  "Outros",
];
