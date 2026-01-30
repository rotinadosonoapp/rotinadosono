import { ArrowRight, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
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
          <div className="w-16 h-16 mx-auto mb-6 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Moon className="w-8 h-8 text-primary-foreground" />
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
              onClick={() => scrollToSection("comprar")}
              className="group bg-primary-foreground text-coral hover:bg-primary-foreground/90"
            >
              Quero Começar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/70">
            Garantia de 7 dias · Pagamento seguro · Acesso imediato
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
