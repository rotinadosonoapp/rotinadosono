import { Moon, Star, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-baby-sleeping.jpg";
const HeroSection = () => {
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
    <section className="relative min-h-screen gradient-hero overflow-hidden pt-20">
      {/* Decorative Elements */}
      <div className="absolute top-32 left-10 w-3 h-3 bg-gold rounded-full animate-pulse-soft opacity-60" />
      <div className="absolute top-48 right-20 w-2 h-2 bg-coral rounded-full animate-pulse-soft opacity-40" />
      <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-sage rounded-full animate-float opacity-50" />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gold-light rounded-full animate-pulse-soft opacity-30" />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-coral-light px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-sm font-medium text-coral-dark">
                Método testado por +500 famílias
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Seu bebê dormindo{" "}
              <span className="text-coral">cedo</span> e a noite{" "}
              <span className="text-coral">inteira</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Um método gentil e eficaz para reeducar o sono do seu bebê, 
              respeitando o desenvolvimento dele. 
              <strong className="text-foreground"> Noites tranquilas para toda a família.</strong>
            </p>

            {/* Quick Benefits */}
            <div className="space-y-3">
              {[
                "Resultados em até 14 dias",
                "Funciona de 0 a 3 anos",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sage-dark flex-shrink-0" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="hero"
                size="xl"
                onClick={goToComprar}
                className="group"
              >
                Quero Noites Tranquilas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => scrollToSection("conteudo")}
              >
                Ver o Conteúdo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-coral-light border-2 border-background flex items-center justify-center"
                    >
                      <span className="text-xs font-medium text-coral-dark">
                        {["M", "P", "J", "A"][i - 1]}
                      </span>
                    </div>
                  ))}
                </div>
                <span>+500 mães satisfeitas</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-coral-light to-cream-dark rounded-3xl p-4 md:p-6 shadow-lg">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src={heroImage} 
                    alt="Bebê dormindo tranquilamente em berço aconchegante" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-md animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage/30 rounded-full flex items-center justify-center">
                      <Moon className="w-5 h-5 text-sage-dark" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dormiu às</p>
                      <p className="font-semibold text-foreground">19:30</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-md animate-float" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-gold fill-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Noite completa</p>
                      <p className="font-semibold text-foreground">10 a 12 horas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
