import { Mail, Instagram, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/favicon.png" 
                alt="Rotina do Sono" 
                className="h-24 md:h-32 lg:h-40 w-auto object-contain"
              />
            </div>
            <p className="text-primary-foreground/70 leading-relaxed max-w-md">
              Ajudando famílias a reconquistar noites tranquilas com um método 
              gentil e eficaz de reeducação do sono infantil.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li>
                <a href="#beneficios" className="hover:text-primary-foreground transition-colors">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#conteudo" className="hover:text-primary-foreground transition-colors">
                  Conteúdo
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-primary-foreground transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary-foreground transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li>
                <a
                  href="mailto:contato@rotinadosono.com.br"
                  className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  contato@rotinadosono.com.br
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @rotinadosono
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Rotina do Sono. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </a>
            </div>
          </div>
          <p className="text-center text-sm text-primary-foreground/40 mt-4 flex items-center justify-center gap-1">
            Feito com <Heart className="w-3 h-3 fill-coral text-coral" /> para famílias que merecem descansar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
