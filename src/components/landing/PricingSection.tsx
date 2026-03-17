import { Check, Star, ArrowRight, CreditCard, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOTMART_URL, HOTMART_URL_COMPLETO } from "@/lib/config";

const plans = [
  {
    name: "Essencial",
    description: "Tudo que você precisa para começar",
    price: "200",
    originalPrice: "247",
    maxInstallments: 5,
    features: [
      "Guia Completo em PDF",
      "Acesso vitalício",
    ],
    cta: "Quero Começar",
    popular: false,
    hotmartUrl: HOTMART_URL,
  },
  {
    name: "Completo",
    description: "Inclui acompanhamento personalizado",
    price: "400",
    originalPrice: "497",
    maxInstallments: 5,
    features: [
      "Tudo do plano Essencial",
      "Apresentação visual (Power Point)",
      "Assessoria individual por 30 dias",
      "Análise personalizada do caso",
      "Plano de ação sob medida",
      "Suporte via WhatsApp",
    ],
    cta: "Quero Acompanhamento",
    popular: true,
    hotmartUrl: HOTMART_URL_COMPLETO,
  },
];

const PricingSection = () => {
  return (
    <section id="comprar" className="pt-10 md:pt-12 pb-20 md:pb-28 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <span className="inline-block text-coral font-medium mb-2">
            Invista no descanso da sua família
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-2">
            Escolha o plano ideal para{" "}
            <span className="text-coral">sua família</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Pagamento seguro. Acesso imediato.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-3xl p-8 md:p-10 border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-coral shadow-coral scale-105"
                  : "border-border hover:border-coral/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-coral text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-lg text-muted-foreground line-through">
                    R$ {plan.originalPrice}
                  </span>
                  <span className="bg-coral-light text-coral px-2 py-1 rounded text-sm font-semibold">
                    -{Math.round((1 - parseInt(plan.price) / parseInt(plan.originalPrice)) * 100)}%
                  </span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="text-5xl font-display font-bold text-foreground">
                    {plan.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ou em até {plan.maxInstallments}x de R$ {(parseInt(plan.price) / plan.maxInstallments).toFixed(2)}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sage/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-sage-dark" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "outline"}
                size="xl"
                className="w-full group"
                onClick={() => {
                  const url = plan.hotmartUrl;
                  if (url) {
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5 text-coral" />
                Formas de Pagamento
              </h4>
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <QrCode className="w-4 h-4" />
                  Pix
                </div>
                <div className="text-sm text-muted-foreground">Cartão</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
