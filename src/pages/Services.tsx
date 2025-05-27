
import Layout from "@/components/layout/Layout";
import TrustBadges from "@/components/ui/TrustBadges";
import ComparisonTable from "@/components/ui/ComparisonTable";
import { FAQ } from "@/components/sections/FAQ";
import ChatbaseAsk from "@/components/sections/ChatbaseAsk";
import ServicesHero from "@/components/sections/Services/ServicesHero";
import ServicesCards from "@/components/sections/Services/ServicesCards";
import ServicesProcess from "@/components/sections/Services/ServicesProcess";
import ServicesCallToAction from "@/components/sections/Services/ServicesCallToAction";

const Services = () => {
  return (
    <Layout>
      <ServicesHero />

      {/* Trust Badges Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-custom">
          <TrustBadges />
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="section-padding bg-slate-light">
        <div className="container-custom">
          <ComparisonTable />
        </div>
      </section>

      <ServicesCards />
      <ServicesProcess />
      <ServicesCallToAction />

      {/* FAQ Section */}
      <div className="bg-slate-light">
        <FAQ />
      </div>

      {/* ChatbaseAsk Section */}
      <ChatbaseAsk />

      <ServicesCallToAction />
    </Layout>
  );
};

export default Services;
