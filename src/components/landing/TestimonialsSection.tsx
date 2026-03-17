import { Star, Quote } from "lucide-react";
import { landingImages } from "@/lib/images";

const testimonials = [
  {
    name: "Mariana S.",
    role: "Mãe do Pedro, 8 meses",
    date: "5 de jan. 2026",
    content:
      "Em 10 dias meu filho já estava dormindo das 19h às 6h da manhã! Eu não acreditava que era possível. O método é gentil e realmente funciona.",
    stars: 5,
  },
  {
    name: "Juliana M.",
    role: "Mãe da Clara, 2 anos",
    date: "10 de jan. 2026",
    content:
      "Minha filha só dormia na cama comigo. Hoje ela adora o quartinho dela e dorme a noite toda. Voltei a ter vida! Recomendo demais.",
    stars: 5,
  },
  {
    name: "Amanda R.",
    role: "Mãe do Lucas, 4 meses",
    date: "15 de jan. 2026",
    content:
      "Estava desesperada, acordava a cada 2 horas. Com a rotina do sono, em 2 semanas ele passou a fazer apenas 1 mamada noturna. Milagre!",
    stars: 5,
  },
  {
    name: "Patrícia L.",
    role: "Mãe da Sofia, 1 ano",
    date: "12 de fev. 2026",
    content:
      "O melhor investimento que fiz na maternidade. O material é super didático e a assessoria foi essencial para o meu caso específico.",
    stars: 5,
  },
  {
    name: "Fernanda C.",
    role: "Mãe do Theo, 6 meses",
    date: "18 de fev. 2026",
    content:
      "Tinha medo de fazer algum método, mas esse é realmente gentil. Meu filho aprendeu a dormir respeitando o tempo dele.",
    stars: 5,
  },
  {
    name: "Carla B.",
    role: "Mãe do Miguel, 3 anos",
    date: "5 de mar. 2026",
    content:
      "Achei que era tarde demais para mudar, mas conseguimos! Miguel agora dorme às 20h e não acorda mais de madrugada.",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-20 md:py-28 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-coral font-medium mb-4">
            Histórias reais
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Famílias que{" "}
            <span className="text-coral">transformaram suas noites</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Veja o que outras mães estão dizendo sobre o Rotina do Sono
          </p>
        </div>

        {/* Galeria de imagens */}
        <div className="flex gap-4 justify-center mb-12 px-2">
          <div className="flex-shrink-0 w-52 md:w-64 rounded-2xl overflow-hidden shadow-lg border-2 border-coral/10">
            <img
              src={landingImages.babySleepingClose}
              alt="Bebê dormindo no berço - famílias transformadas"
              className="w-full h-44 md:h-52 object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-shrink-0 w-52 md:w-64 rounded-2xl overflow-hidden shadow-lg border-2 border-coral/10 hidden sm:block">
            <img
              src={landingImages.babySleepingPeaceful}
              alt="Bebê dormindo entre nuvens e estrelas"
              className="w-full h-44 md:h-52 object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-coral/20 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-gold fill-gold"
                  />
                ))}
              </div>

              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-coral-light" />
                <p className="text-foreground leading-relaxed pl-4">
                  {testimonial.content}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-coral-light flex items-center justify-center">
                  <span className="text-sm font-semibold text-coral">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">
                    {testimonial.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
