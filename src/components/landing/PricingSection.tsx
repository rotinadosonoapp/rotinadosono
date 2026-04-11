import {
  CircleCheck,
  Sparkles,
  ArrowRight,
  CreditCard,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HOTMART_URL,
  HOTMART_URL_COMPLETO,
  HOTMART_URL_PREMIUM,
  HOTMART_URL_DOMICILIAR,
  SITE_CONTACT_EMAIL,
} from "@/lib/config";

type Plan = {
  name: string;
  description: string;
  price: string;
  priceNote?: string;
  features: string[];
  cta: string;
  popular: boolean;
  hotmartUrl: string;
};

const plans: Plan[] = [
  {
    name: "Plano Essencial",
    description:
      "Método completo em PDF para você organizar o sono com clareza e segurança, no seu ritmo.",
    priceNote: "Pagamento único · Conteúdo liberado na hora",
    price: "219,90",
    features: [
      "Guia passo a passo: rotina para noites mais tranquilas",
      "Acesso vitalício — consulte quando precisar",
    ],
    cta: "Começar Agora",
    popular: false,
    hotmartUrl: HOTMART_URL,
  },
  {
    name: "Plano Completo – Consultoria Online",
    description:
      "Um mês de acompanhamento estratégico com especialista: menos tentativa e erro, mais resultado.",
    priceNote: "4 mentorias ao vivo · Plano em até 48h",
    price: "519,90",
    features: [
      "4 mentorias online (até 40 min cada)",
      "Análise de progresso e ajustes na rota",
      "Plano de ação rápido — começo em até 48h",
      "Suporte personalizado durante o programa",
      "Guia completo incluso (mesmo conteúdo do Essencial)",
    ],
    cta: "Quero Meu Plano",
    popular: true,
    hotmartUrl: HOTMART_URL_COMPLETO,
  },
  {
    name: "Plano Completo Premium – Consultoria Presencial",
    description:
      "Encontros na clínica com análise profunda da rotina e ajustes presenciais para sua família.",
    priceNote: "Santarém–PA · Vagas sob consulta",
    price: "999,90",
    features: [
      "4 consultas presenciais (até 1h cada)",
      "Análise detalhada da rotina e do sono",
      "Plano imediato — início em até 72h",
      "Ajustes conforme a evolução do bebê",
      "Horários flexíveis para a família",
      "Guia completo incluso",
      "Exclusivo para Santarém – PA",
    ],
    cta: "Agendar Consultoria",
    popular: false,
    hotmartUrl: HOTMART_URL_PREMIUM,
  },
  {
    name: "Plano Completo Domiciliar – Consultoria Premium",
    description:
      "Transformação do sono no ambiente real do bebê — quarto, rotina e hábitos, com acompanhamento contínuo.",
    priceNote: "Santarém–PA · Experiência sob medida",
    price: "1.499,90",
    features: [
      "Atendimento presencial na sua casa",
      "Análise do ambiente, rotina e associações de sono",
      "Estratégia 100% personalizada",
      "Ajustes práticos no quarto e na rotina",
      "Suporte durante toda a adaptação",
      "Horários com flexibilidade total",
      "Guia completo incluso",
      "Exclusivo para Santarém – PA",
    ],
    cta: "Agendar Consultoria",
    popular: false,
    hotmartUrl: HOTMART_URL_DOMICILIAR,
  },
];

function openPlanCheckout(plan: Plan) {
  if (plan.hotmartUrl) {
    window.open(plan.hotmartUrl, "_blank", "noopener,noreferrer");
  } else {
    const subject = encodeURIComponent(`Interesse: ${plan.name}`);
    window.location.href = `mailto:${SITE_CONTACT_EMAIL}?subject=${subject}`;
  }
}

const PricingSection = () => {
  return (
    <section
      id="comprar"
      className="relative isolate overflow-hidden pt-14 pb-24 md:pt-20 md:pb-32"
    >
      {/* —— Background: gradiente + grid + glow —— */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-cream via-background to-cream-dark/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(220_30%_18%/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(220_30%_18%/0.04)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[min(70vh,520px)] w-[min(100%,900px)] -translate-x-1/2 rounded-full bg-gradient-to-b from-coral/12 via-gold/8 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-navy/5 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto px-4">
        {/* —— Cabeçalho —— */}
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy/70 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-coral" aria-hidden />
            Planos
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-navy md:text-4xl lg:text-5xl">
            Escolha o nível de apoio ideal para{" "}
            <span className="bg-gradient-to-r from-coral via-coral-dark to-gold bg-clip-text text-transparent">
              a sua família
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            Pagamento seguro, processo transparente e conteúdo pensado para
            gerar resultados reais — do autoguiado à consultoria presencial.
          </p>
        </div>

        {/* —— Grid de cards —— */}
        <div className="mx-auto grid max-w-[1440px] gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4 xl:items-stretch xl:gap-6 xl:px-2">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;

            return (
              <article
                key={plan.name}
                className={cn(
                  "group relative flex flex-col rounded-3xl border transition-all duration-300 ease-out",
                  "bg-white/75 shadow-lg shadow-navy/[0.06] backdrop-blur-md",
                  "border-white/80 hover:-translate-y-1.5 hover:border-coral/25 hover:shadow-xl hover:shadow-navy/[0.08]",
                  "p-7 md:p-8",
                  isPopular &&
                    "xl:z-20 xl:-my-3 xl:scale-[1.06] xl:border-coral/35 xl:shadow-2xl xl:shadow-coral/20 xl:ring-1 xl:ring-coral/20",
                )}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Badge Mais Popular */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 z-30 -translate-x-1/2">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg",
                        "bg-gradient-to-r from-[hsl(352,42%,38%)] via-[hsl(16,72%,50%)] to-[hsl(32,78%,46%)]",
                        "animate-pulse-soft ring-2 ring-white/60 ring-offset-2 ring-offset-transparent",
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      Mais Popular
                    </div>
                  </div>
                )}

                {/* Topo: nome + descrição */}
                <header className="mb-6 text-center">
                  <h3
                    className={cn(
                      "font-display text-lg font-bold leading-snug tracking-tight text-navy md:text-xl",
                      isPopular && "md:text-[1.35rem]",
                    )}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                </header>

                {/* Preço */}
                <div className="mb-6 text-center">
                  <div className="flex flex-wrap items-baseline justify-center gap-1">
                    <span className="font-body text-sm font-medium text-muted-foreground">
                      R$
                    </span>
                    <span
                      className={cn(
                        "font-display font-bold tabular-nums tracking-tight text-navy",
                        isPopular
                          ? "text-4xl sm:text-5xl xl:text-[2.75rem]"
                          : "text-4xl sm:text-[2.35rem]",
                      )}
                    >
                      {plan.price}
                    </span>
                  </div>

                  {plan.priceNote && (
                    <p className="mt-2 text-xs font-medium leading-snug text-muted-foreground/90">
                      {plan.priceNote}
                    </p>
                  )}
                </div>

                {/* Lista de benefícios */}
                <ul className="mb-8 flex flex-1 flex-col gap-3.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-left text-sm leading-snug text-foreground/90"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                        <CircleCheck
                          className="h-4 w-4 stroke-[2.5]"
                          aria-hidden
                        />
                      </span>
                      <span className="pt-0.5">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => openPlanCheckout(plan)}
                  className={cn(
                    "group/btn mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 pl-5 pr-4 font-body text-base font-semibold transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 focus-visible:ring-offset-2",
                    isPopular
                      ? "bg-gradient-to-r from-[hsl(352,40%,36%)] via-coral to-[hsl(36,76%,46%)] text-white shadow-lg shadow-coral/25 hover:scale-[1.02] hover:shadow-xl hover:brightness-[1.04] active:scale-[0.99]"
                      : "border border-navy/12 bg-white/80 text-navy shadow-sm backdrop-blur-sm hover:scale-[1.01] hover:border-coral/30 hover:bg-white hover:shadow-md active:scale-[0.99]",
                  )}
                >
                  {plan.cta}
                  <ArrowRight
                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1"
                    aria-hidden
                  />
                </button>
              </article>
            );
          })}
        </div>

        {/* —— Formas de pagamento —— */}
        <div className="mx-auto mt-16 max-w-2xl md:mt-20">
          <div className="rounded-3xl border border-white/70 bg-white/60 p-8 shadow-xl shadow-navy/[0.05] backdrop-blur-md md:p-10">
            <div className="text-center">
              <h4 className="mb-2 flex items-center justify-center gap-2 font-display text-lg font-bold text-navy">
                <CreditCard className="h-5 w-5 text-coral" aria-hidden />
                Formas de pagamento
              </h4>
              <p className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
                Checkout seguro nos planos digitais
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <QrCode className="h-4 w-4" aria-hidden />
                  Pix
                </span>
                <span>Cartão de crédito</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
