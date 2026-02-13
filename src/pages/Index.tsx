import { Helmet } from "react-helmet-async";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import ContentSection from "@/components/landing/ContentSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import AboutSection from "@/components/landing/AboutSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Rotina do Sono | Reeducação do Sono Infantil - Noites Tranquilas</title>
        <meta
          name="description"
          content="Método gentil e eficaz para seu bebê dormir a noite toda. Sem deixar chorar, resultados em até 14 dias. Transforme suas noites com o Rotina do Sono."
        />
        <meta
          name="keywords"
          content="sono infantil, bebê dormindo, rotina do sono, reeducação do sono, sono do bebê, noites tranquilas"
        />
        <meta property="og:title" content="Rotina do Sono | Reeducação do Sono Infantil" />
        <meta
          property="og:description"
          content="Método gentil para seu bebê dormir a noite toda. Resultados em até 14 dias."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://rotinadosono.com.br" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <ProblemSection />
          <BenefitsSection />
          <AboutSection />
          <ContentSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
