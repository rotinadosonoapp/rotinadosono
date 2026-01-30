import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/rotina_do_sono_site.png" 
              alt="Rotina do Sono" 
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("beneficios")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollToSection("conteudo")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Conteúdo
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant="hero"
              size="default"
              onClick={() => scrollToSection("comprar")}
            >
              Quero Começar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("beneficios")}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-left py-2"
              >
                Benefícios
              </button>
              <button
                onClick={() => scrollToSection("conteudo")}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-left py-2"
              >
                Conteúdo
              </button>
              <button
                onClick={() => scrollToSection("depoimentos")}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-left py-2"
              >
                Depoimentos
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-left py-2"
              >
                FAQ
              </button>
              <Button
                variant="hero"
                size="lg"
                className="mt-2"
                onClick={() => scrollToSection("comprar")}
              >
                Quero Começar
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
