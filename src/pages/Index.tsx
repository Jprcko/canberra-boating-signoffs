
import Layout from "@/components/layout/Layout";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { Testimonials } from "@/components/sections/Testimonials";
import TrustBadges from "@/components/ui/TrustBadges";
import ComparisonTable from "@/components/ui/ComparisonTable";
import ChatbaseAsk from "@/components/sections/ChatbaseAsk";
import IndexHero from "@/components/sections/Index/IndexHero";
import IndexCompellingMessage from "@/components/sections/Index/IndexCompellingMessage";
import IndexServices from "@/components/sections/Index/IndexServices";
import IndexUrgentAvailability from "@/components/sections/Index/IndexUrgentAvailability";
import IndexWhyChooseUs from "@/components/sections/Index/IndexWhyChooseUs";
import IndexCallToAction from "@/components/sections/Index/IndexCallToAction";

const Index = () => {
  return (
    <div className="overflow-x-hidden min-h-screen">
      <Layout>
        <div className="w-full max-w-full overflow-x-hidden">
          <IndexHero />
          <IndexCompellingMessage />

          {/* Trust Badges Section */}
          <section className="py-8 bg-white border-b border-gray-100 w-full max-w-full overflow-x-hidden">
            <div className="container-custom w-full max-w-full">
              <TrustBadges />
            </div>
          </section>
          
          <div className="w-full max-w-full overflow-x-hidden">
            <HowItWorks />
          </div>
          
          <div className="w-full max-w-full overflow-x-hidden">
            <IndexServices />
          </div>

          {/* Comparison Table Section */}
          <section className="section-padding bg-slate-light bg-white w-full max-w-full overflow-x-hidden">
            <div className="container-custom w-full max-w-full">
              <ComparisonTable />
            </div>
          </section>

          <div className="w-full max-w-full overflow-x-hidden">
            <Testimonials />
          </div>
          
          <div className="w-full max-w-full overflow-x-hidden">
            <FAQ />
          </div>
          
          <div className="w-full max-w-full overflow-x-hidden">
            <ChatbaseAsk />
          </div>
          
          <div className="w-full max-w-full overflow-x-hidden">
            <IndexUrgentAvailability />
          </div>
          
          <div className="w-full max-w-full overflow-x-hidden">
            <IndexWhyChooseUs />
          </div>
          
          <div className="w-full max-w-full overflow-x-hidden">
            <IndexCallToAction />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Index;
