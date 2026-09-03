import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import LogoCloud from "./_components/LogoCloud";
import Features from "./_components/Features";
import TemplateGallery from "./_components/TemplateGallery";
import Testimonials from "./_components/Testimonials";
import Pricing from "./_components/Pricing";
import Faq from "./_components/Faq";
import CtaBanner from "./_components/CtaBanner";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoCloud />
        <Features />
        <TemplateGallery />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
