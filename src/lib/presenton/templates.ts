export type PresentonTemplateCategory =
  | "all"
  | "business"
  | "creative"
  | "minimal";

export const PRESENTON_TEMPLATE_CATEGORIES: {
  id: PresentonTemplateCategory;
  label: string;
}[] = [
  { id: "all", label: "All styles" },
  { id: "business", label: "Business" },
  { id: "creative", label: "Creative" },
  { id: "minimal", label: "Minimal" },
];

export const PRESENTON_IDEA_CHIPS = [
  "Quarterly business review with KPIs and roadmap",
  "Startup pitch deck for seed fundraising",
  "Product launch announcement for a mobile app",
  "Team onboarding and company culture overview",
  "Marketing campaign results and next steps",
  "Educational lecture on climate science basics",
] as const;

export const PRESENTON_SLIDE_COUNTS = [5, 8, 10, 12, 15] as const;

export const PRESENTON_TEMPLATES = [
  {
    id: "general",
    label: "General",
    tagline: "Clean layouts for any topic",
    category: "minimal" as const,
    preview: "/presenton/templates/General.png",
    accent: "from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]",
  },
  {
    id: "modern",
    label: "Modern",
    tagline: "Contemporary pitch and product decks",
    category: "creative" as const,
    preview: "/presenton/templates/Modern.png",
    accent: "from-[#dbeafe] via-[#93c5fd] to-[#6366f1]",
  },
  {
    id: "executive",
    label: "Executive",
    tagline: "Leadership updates and strategy",
    category: "business" as const,
    preview: "/presenton/templates/Executive.png",
    accent: "from-[#1e293b] via-[#334155] to-[#475569]",
  },
  {
    id: "standard",
    label: "Standard",
    tagline: "Professional reports and proposals",
    category: "business" as const,
    preview: "/presenton/templates/Standard.png",
    accent: "from-[#ecfdf5] via-[#a7f3d0] to-[#34d399]",
  },
  {
    id: "dynamic",
    label: "Dynamic",
    tagline: "High-impact visual storytelling",
    category: "creative" as const,
    preview: "/presenton/templates/Dynamic.png",
    accent: "from-[#fce7f3] via-[#f472b6] to-[#db2777]",
  },
  {
    id: "momentum",
    label: "Momentum",
    tagline: "Sales reports and data narratives",
    category: "business" as const,
    preview: "/presenton/templates/Momentum.png",
    accent: "from-[#ffedd5] via-[#fdba74] to-[#ea580c]",
  },
  {
    id: "swift",
    label: "Swift",
    tagline: "Fast, focused slide decks",
    category: "minimal" as const,
    preview: null,
    accent: "from-[#f5f5f4] via-[#d6d3d1] to-[#78716c]",
  },
] as const;

export type PresentonTemplateId = (typeof PRESENTON_TEMPLATES)[number]["id"];

export function getPresentonTemplate(id: string) {
  return PRESENTON_TEMPLATES.find((template) => template.id === id);
}
