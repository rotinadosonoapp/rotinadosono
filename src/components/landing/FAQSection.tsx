import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "A partir de qual idade posso aplicar o método?",
    answer:
      "O método pode ser aplicado desde o nascimento até os 5 anos de idade. O material traz adaptações específicas para cada faixa etária, respeitando as necessidades de desenvolvimento de cada fase.",
  },
  {
    question: "O método envolve deixar o bebê chorar?",
    answer:
      "Não! O Rotina do Sono é um método gentil que prioriza o vínculo e a segurança emocional do bebê. Trabalhamos com técnicas que respeitam o choro como comunicação, mas sem abandono ou deixar chorar sozinho.",
  },
  {
    question: "Em quanto tempo vou ver resultados?",
    answer:
      "A maioria das famílias observa melhorias significativas nas primeiras 7 a 14 dias de aplicação consistente. Alguns casos mais complexos podem levar até 21 dias. O importante é a consistência na aplicação.",
  },
  {
    question: "Funciona para bebês que mamam à noite?",
    answer:
      "Sim! O método ensina a diferenciar entre fome real e hábito de mamar para dormir. Trabalhamos a redução gradual das mamadas noturnas, respeitando as necessidades nutricionais de cada idade.",
  },
  {
    question: "Meu bebê só dorme no colo. Vai funcionar?",
    answer:
      "Esse é um dos casos mais comuns e o método é especialmente eficaz para isso. Você aprenderá técnicas de transição gradual que ajudam o bebê a desenvolver autonomia para dormir sem precisar de colo.",
  },
  {
    question: "O que acontece se eu precisar de ajuda extra?",
    answer:
      "No plano Essencial, você tem suporte por e-mail. No plano Completo, você conta com assessoria individualizada por 30 dias via WhatsApp, onde analisamos seu caso específico e fazemos ajustes personalizados.",
  },
  {
    question: "Posso parcelar o pagamento?",
    answer:
      "Sim! Você pode pagar em até 12x no cartão de crédito. Também aceitamos Pix (com desconto).",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-coral font-medium mb-4">
            Dúvidas frequentes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Tudo que você precisa saber
          </h2>
          <p className="text-lg text-muted-foreground">
            Respondemos as perguntas mais comuns das mães que chegam até nós
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-coral/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-coral py-6 [&[data-state=open]]:text-coral">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
