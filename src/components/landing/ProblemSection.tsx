import { AlertCircle, Clock, Heart, Users } from "lucide-react";
import { landingImages } from "@/lib/images";

const problems = [
  {
    icon: Clock,
    title: "Noites sem fim",
    description:
      "Seu bebê acorda várias vezes durante a noite e você já não lembra o que é dormir 6 horas seguidas.",
  },
  {
    icon: AlertCircle,
    title: "Horários bagunçados",
    description:
      "Ele só dorme tarde, depois das 22h ou 23h, e você já tentou de tudo para antecipar esse horário.",
  },
  {
    icon: Users,
    title: "Cama compartilhada forçada",
    description:
      "O bebê só dorme no seu colo, na sua cama, e você perdeu sua privacidade e descanso.",
  },
  {
    icon: Heart,
    title: "Exaustão extrema",
    description:
      "A privação de sono está afetando sua saúde, humor, relacionamento e até o vínculo com seu filho.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-coral font-medium mb-4">
            Você se identifica?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            A privação de sono está <br />
            <span className="text-coral">afetando toda sua família</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Se você está lendo isso às 3h da manhã com seu bebê no colo, 
            saiba que você não está sozinha. Milhares de mães passam pelo mesmo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-coral/30 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-coral-light flex items-center justify-center flex-shrink-0 group-hover:bg-coral/20 transition-colors">
                  <problem.icon className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Imagem ilustrativa */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg border-2 border-coral/10">
            <img
              src={landingImages.babySleepingSoft}
              alt="Bebê dormindo - existe uma saída gentil"
              className="w-full h-56 object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-coral-light rounded-2xl p-6 md:p-8 max-w-2xl">
            <p className="text-lg md:text-xl font-display text-foreground leading-relaxed">
              "Eu sei exatamente como você se sente. Já estive aí, esgotada, sem esperança. 
              <span className="text-coral font-semibold"> Mas existe uma saída gentil e eficaz.</span>"
            </p>
            <p className="mt-4 text-muted-foreground font-medium">
              — Criadora do Método Rotina do Sono
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
