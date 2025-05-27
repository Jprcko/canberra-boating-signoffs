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
  return <Layout>
      <IndexHero />
      <IndexCompellingMessage />

      {/* Trust Badges Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-custom">
          <TrustBadges />
        </div>
      </section>
      
      <HowItWorks />
      <IndexServices />

      {/* Comparison Table Section */}
      <section className="section-padding bg-slate-light bg-white">
        <div className="container-custom">
          <ComparisonTable />
        </div>
      </section>

      <Testimonials />
      <FAQ />
      <ChatbaseAsk />
      <IndexUrgentAvailability />
      <IndexWhyChooseUs />
      <IndexCallToAction />
    </Layout>;
};
export default Index;