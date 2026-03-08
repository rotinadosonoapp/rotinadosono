import { Link } from "react-router-dom";
import { Menu, X, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

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

          {/* Portal + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {(!isAuthenticated || isAdmin) && (
              <Link to={isAuthenticated && isAdmin ? "/admin" : "/login"}>
                <Button variant="outline" size="default" className="gap-2">
                  <User className="w-4 h-4" />
                  {isAdmin ? "Admin" : "Entrar no Portal"}
                </Button>
              </Link>
            )}
            <Button
              variant="hero"
              size="lg"
              className="px-6 py-6 text-base"
              onClick={() => scrollToSection("comprar")}
            >
              Quero Começar
            </Button>
            <a
              href="https://wa.me/5599981984287"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 px-5 py-6">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </Button>
            </a>
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
              {(!isAuthenticated || isAdmin) && (
                <Link to={isAuthenticated && isAdmin ? "/admin" : "/login"} onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full mt-2 gap-2">
                    <User className="w-4 h-4" />
                    {isAdmin ? "Admin" : "Entrar no Portal"}
                  </Button>
                </Link>
              )}
              <a
                href="https://wa.me/5599981984287"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" size="lg" className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </Button>
              </a>
              <Button
                variant="hero"
                size="lg"
                className="mt-2 w-full text-base py-6"
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
