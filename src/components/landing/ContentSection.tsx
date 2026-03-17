import { FileText, Presentation, MessageCircle, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingImages } from "@/lib/images";

const contentItems = [
  {
    icon: FileText,
    title: "Guia Completo em PDF",
    description:
      "E-book com o método passo a passo, explicando cada fase do sono e como criar a rotina ideal.",
    highlights: [
      "Entendendo o sono do bebê",
      "Rituais de sono eficazes",
      "Como lidar com regressões",
      "Adaptações por idade (0 a 3 anos)",
    ],
  },
  {
    icon: Presentation,
    title: "Apresentação Visual (PowerPoint)",
    description:
      "Material visual resumido para consulta rápida, com checklist e cronogramas práticos.",
    highlights: [
      "Resumo visual do método",
      "Checklist diário",
      "Modelos de rotina prontos",
      "Dicas para cada etapa",
    ],
  },
  {
    icon: MessageCircle,
    title: "Assessoria Personalizada",
    description:
      "Acompanhamento individual para casos que precisam de atenção especial.",
    highlights: [
      "Análise do seu caso",
      "Plano personalizado",
      "Suporte por 30 dias",
      "Ajustes conforme evolução",
    ],
    premium: true,
  },
];

const ContentSection = () => {
  const goToComprar = () => {
    const el = document.getElementById("comprar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="conteudo" className="pt-20 md:pt-28 pb-10 md:pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-coral font-medium mb-4">
            O que está incluso
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Tudo que você precisa para{" "}
            <span className="text-coral">transformar o sono</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Material completo e prático para você aplicar hoje mesmo
            e começar a ver resultados nas próximas noites.
          </p>
        </div>

        {/* Imagem ilustrativa */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-lg border-2 border-coral/10">
            <img
              src={landingImages.babySleepingPeaceful}
              alt="Bebê dormindo - tudo que você precisa para transformar o sono"
              className="w-full h-52 object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {contentItems.map((item, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-6 md:p-8 border-2 transition-all duration-300 hover:shadow-lg ${
                item.premium
                  ? "border-gold shadow-gold"
                  : "border-border hover:border-coral/30"
              }`}
            >
              {item.premium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-gold text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Premium
                  </div>
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                  item.premium ? "bg-gold/20" : "bg-coral-light"
                }`}
              >
                <item.icon
                  className={`w-7 h-7 ${
                    item.premium ? "text-gold" : "text-coral"
                  }`}
                />
              </div>

              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground mb-6">{item.description}</p>

              <ul className="space-y-3">
                {item.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        item.premium ? "text-gold" : "text-sage-dark"
                      }`}
                    />
                    <span className="text-sm text-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="hero"
            size="xl"
            onClick={goToComprar}
          >
            Quero Acesso Completo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
