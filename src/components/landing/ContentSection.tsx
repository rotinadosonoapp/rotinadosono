import {
  FileText,
  Presentation,
  MessageCircle,
  CircleCheck,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { landingImages } from "@/lib/images";

type ContentItem = {
  icon: typeof FileText;
  title: string;
  description: string;
  highlights: string[];
  featured?: boolean;
};

const contentItems: ContentItem[] = [
  {
    icon: FileText,
    title: "Guia completo em PDF",
    description:
      "Seu manual principal: método organizado, linguagem clara e passos acionáveis para implementar a rotina com segurança.",
    highlights: [
      "Fundamentos do sono do bebê, sem jargão desnecessário",
      "Rituais e transições que acalmam e organizam o dia",
      "Como navegar regressões e noites mais difíceis",
      "Orientações por faixa etária (0 a 3 anos)",
    ],
  },
  {
    icon: Presentation,
    title: "Apresentação visual (PowerPoint)",
    description:
      "Resumo visual para consulta rápida — ideal para lembrar o essencial quando o cansaço aperta.",
    highlights: [
      "Visão panorâmica do método em poucos slides",
      "Checklists e modelos de rotina prontos para usar",
      "Cronogramas e lembretes práticos por etapa",
      "Consulta rápida no celular ou no computador",
    ],
  },
  {
    icon: MessageCircle,
    title: "Consultoria Personalizada",
    description:
      "Quando o caso pede olhar de especialista: análise do seu contexto, plano sob medida e suporte na implementação.",
    highlights: [
      "Leitura aprofundada do seu cenário familiar",
      "Plano de ação alinhado ao seu bebê e à sua rotina",
      "Canal de suporte durante o período do programa",
      "Ajustes finos conforme a evolução do sono",
    ],
    featured: true,
  },
];

const ContentSection = () => {
  const goToComprar = () => {
    const el = document.getElementById("comprar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="conteudo"
      className="relative isolate overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20"
    >
      {/* Fundo alinhado à seção de planos: gradiente + grid + glow suave */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-background via-cream/80 to-cream"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(220_30%_18%/0.035)_1px,transparent_1px),linear-gradient(to_bottom,hsl(220_30%_18%/0.035)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black_20%,transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[min(50vh,420px)] w-[min(100%,720px)] -translate-x-1/2 rounded-full bg-gradient-to-b from-coral/10 via-transparent to-transparent blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto px-4">
        {/* Cabeçalho — mesma hierarquia da área de planos */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy/70 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-coral" aria-hidden />
            Sua jornada
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-navy md:text-4xl lg:text-5xl">
            Tudo o que você recebe na{" "}
            <span className="bg-gradient-to-r from-coral via-coral-dark to-gold bg-clip-text text-transparent">
              sua jornada
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Conteúdos práticos, materiais de apoio e possibilidade de
            acompanhamento — para tornar a rotina do sono mais leve, clara e
            segura antes de você escolher o plano ideal abaixo.
          </p>
        </div>

        {/* Imagem — mesmo vocabulário de borda/sombra dos cards premium */}
        <div className="mb-12 flex justify-center md:mb-16">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white/40 shadow-xl shadow-navy/[0.06] backdrop-blur-sm">
            <img
              src={landingImages.babySleepingPeaceful}
              alt="Bebê em sono tranquilo — rotina do sono com acolhimento"
              className="h-48 w-full object-cover sm:h-56 md:h-64"
              loading="lazy"
            />
          </div>
        </div>

        {/* Grid de cards — largura e ritmo próximos à seção #comprar */}
        <div className="mx-auto grid max-w-[1440px] gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-6">
          {contentItems.map((item) => {
            const Icon = item.icon;
            const isFeatured = item.featured;

            return (
              <article
                key={item.title}
                className={cn(
                  "group relative flex flex-col rounded-3xl border p-7 transition-all duration-300 ease-out md:p-8",
                  "bg-white/75 shadow-lg shadow-navy/[0.06] backdrop-blur-md",
                  "border-white/80 hover:-translate-y-1.5 hover:border-coral/25 hover:shadow-xl hover:shadow-navy/[0.08]",
                  isFeatured &&
                    "border-coral/25 shadow-lg shadow-coral/10 ring-1 ring-coral/15 lg:ring-offset-2 lg:ring-offset-cream/50",
                )}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md",
                        "bg-gradient-to-r from-[hsl(352,40%,36%)] via-coral to-[hsl(36,76%,46%)]",
                        "ring-2 ring-white/70",
                      )}
                    >
                      <Sparkles className="h-3 w-3" aria-hidden />
                      Experiência guiada
                    </span>
                  </div>
                )}

                <div
                  className={cn(
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors duration-300",
                    isFeatured
                      ? "border-coral/20 bg-gradient-to-br from-coral/12 to-gold/10 text-coral-dark"
                      : "border-navy/8 bg-white/90 text-coral shadow-sm group-hover:border-coral/20",
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </div>

                <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-navy md:text-[1.35rem]">
                  {item.title}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                  {item.description}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-3.5 border-t border-navy/[0.06] pt-6">
                  {item.highlights.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-left text-sm leading-snug text-foreground/90"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                        <CircleCheck
                          className="h-4 w-4 stroke-[2.5]"
                          aria-hidden
                        />
                      </span>
                      <span className="pt-0.5">{line}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* CTA — ponte suave para a seção de planos */}
        <div className="mx-auto mt-14 max-w-xl text-center md:mt-16">
          <p className="mb-5 text-sm font-medium text-muted-foreground">
            Nos planos abaixo você escolhe só o PDF, o acompanhamento online ou
            as experiências presenciais — com tudo isso organizado em um só
            lugar.
          </p>
          <button
            type="button"
            onClick={goToComprar}
            className="group/cta inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[hsl(352,40%,36%)] via-coral to-[hsl(36,76%,46%)] px-8 py-4 font-body text-base font-semibold text-white shadow-lg shadow-coral/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:brightness-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            Ver planos e investimento
            <ArrowDown
              className="h-5 w-5 transition-transform duration-300 group-hover/cta:translate-y-0.5"
              aria-hidden
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
