import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingImages } from "@/lib/images";
import { HOTMART_URL } from "@/lib/config";

const CTASection = () => {
  const goToComprar = () => {
    if (HOTMART_URL) {
      window.open(HOTMART_URL, "_blank", "noopener,noreferrer");
    } else {
      const el = document.getElementById("comprar");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-coral relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary-foreground/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-primary-foreground/30 rounded-full animate-pulse-soft" />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary-foreground/20 rounded-full animate-pulse-soft" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-8">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-primary-foreground/30 shadow-xl">
              <img
                src={landingImages.babySleepingClose}
                alt="Bebê dormindo no berço de balanço"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-coral/10" />
            </div>
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-primary-foreground/30 shadow-xl hidden sm:block">
              <img
                src={landingImages.babySleepingPeaceful}
                alt="Bebê dormindo entre nuvens"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-coral/10" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
            Sua família merece noites tranquilas
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Não deixe a exaustão dominar sua maternidade. Comece hoje a 
            transformação que vai devolver o descanso para toda sua família.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="xl"
              onClick={goToComprar}
              className="group bg-primary-foreground text-coral hover:bg-primary-foreground/90"
            >
              Quero Começar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/70">
            Pagamento seguro · Acesso imediato
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
