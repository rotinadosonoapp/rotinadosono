import { Moon, Sun, Heart, Sparkles, Clock, Shield } from "lucide-react";

const benefits = [
  {
    icon: Moon,
    title: "Noites completas de sono",
    description:
      "Seu bebê aprenderá a dormir a noite toda, acordando descansado e você também.",
    color: "coral",
  },
  {
    icon: Sun,
    title: "Rotina estruturada",
    description:
      "Horários previsíveis que respeitam o ritmo natural do seu bebê e da família.",
    color: "gold",
  },
  {
    icon: Heart,
    title: "Método gentil",
    description:
      "Sem deixar chorar. Respeitamos o vínculo e a segurança emocional do bebê.",
    color: "sage",
  },
  {
    icon: Clock,
    title: "Resultados em até 14 dias",
    description:
      "Com consistência, você verá mudanças significativas nas primeiras semanas.",
    color: "coral",
  },
  {
    icon: Shield,
    title: "Baseado em ciência",
    description:
      "Método fundamentado em estudos sobre desenvolvimento infantil e sono.",
    color: "gold",
  },
  {
    icon: Sparkles,
    title: "Autonomia do sono",
    description:
      "Seu bebê aprenderá a adormecer sozinho, sem depender de colo ou mama.",
    color: "sage",
  },
];

const colorVariants = {
  coral: {
    bg: "bg-coral-light",
    icon: "text-coral",
    hover: "group-hover:bg-coral/20",
  },
  gold: {
    bg: "bg-gold/10",
    icon: "text-gold",
    hover: "group-hover:bg-gold/20",
  },
  sage: {
    bg: "bg-sage/30",
    icon: "text-sage-dark",
    hover: "group-hover:bg-sage/40",
  },
};

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="py-20 md:py-28 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-coral font-medium mb-4">
            Transformação real
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            O que você vai conquistar com o{" "}
            <span className="text-coral">Rotina do Sono</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Mais do que técnicas, você terá um novo olhar sobre o sono infantil
            e ferramentas práticas para transformar suas noites.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const colors = colorVariants[benefit.color as keyof typeof colorVariants];
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-coral/20 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.hover} flex items-center justify-center mb-5 transition-colors`}
                >
                  <benefit.icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
