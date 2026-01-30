import { Heart, Award, Users, BookOpen } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Famílias atendidas" },
  { icon: Award, value: "5+", label: "Anos de experiência" },
  { icon: BookOpen, value: "100%", label: "Método próprio" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Image/Visual */}
          <div className="relative">
            <div className="relative bg-coral-light rounded-3xl p-8 md:p-12">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-cream to-coral-light overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-32 h-32 mx-auto bg-coral/20 rounded-full flex items-center justify-center">
                    <Heart className="w-16 h-16 text-coral" />
                  </div>
                  <p className="font-display text-xl font-semibold text-foreground">
                    Com amor e dedicação
                  </p>
                </div>
              </div>

              {/* Decorative card */}
              <div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Especialista em</p>
                    <p className="font-semibold text-foreground text-sm">Sono Infantil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="inline-block text-coral font-medium">
              Quem criou o método
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Uma mãe que entende <span className="text-coral">sua jornada</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Sou mãe, assim como você, e já passei por noites intermináveis, 
                exaustão extrema e a sensação de não saber mais o que fazer. 
                Foi essa experiência que me levou a estudar profundamente sobre 
                o sono infantil.
              </p>
              <p>
                Após anos de estudo e prática, desenvolvi o <strong className="text-foreground">Método Rotina do Sono</strong>, 
                que já ajudou centenas de famílias a reconquistar noites tranquilas 
                — sem deixar o bebê chorar, sem traumas, respeitando cada fase 
                do desenvolvimento.
              </p>
              <p>
                Minha missão é levar esse conhecimento a mais famílias, 
                porque sei o quanto a privação de sono afeta a maternidade 
                e toda a dinâmica familiar.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-coral-light rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-coral" />
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
