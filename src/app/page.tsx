import ZaviNavbar from "./_components/ZaviNavbar";
import ZaviHero from "./_components/ZaviHero";
import StorySection from "./_components/StorySection";
import ResearchSection from "./_components/ResearchSection";
import AgentsSection from "./_components/AgentsSection";
import HowItWorks from "./_components/HowItWorks";
import ChatPlatformSection from "./_components/ChatPlatformSection";
import IntegrationsSection from "./_components/IntegrationsSection";
import UseCasesSection from "./_components/UseCasesSection";
import Faq from "./_components/Faq";
import CtaBanner from "./_components/CtaBanner";
import ZaviFooter from "./_components/ZaviFooter";

export default function Home() {
  return (
    <>
      <ZaviNavbar />
      <main className="flex-1">
        <ZaviHero />
        <StorySection />
        <ResearchSection />
        <AgentsSection />
        <HowItWorks />
        <ChatPlatformSection />
        <IntegrationsSection />
        <UseCasesSection />
        <Faq />
        <CtaBanner />
      </main>
      <ZaviFooter />
    </>
  );
}
