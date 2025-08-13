
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import ProgressRoadmap from "@/components/dashboard/ProgressRoadmap";
import QuickStatsRow from "@/components/dashboard/QuickStatsRow";
import CalloutCards from "@/components/dashboard/CalloutCards";
import SEO from "@/components/seo/SEO";

const ClientPortal = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <SEO title="Client Portal | ACT Boats & Licensing" description="Access your progress, quizzes and bookings." canonicalPath="/client-portal" noindex />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600">
              Continue your journey to getting your boat licence
            </p>
          </div>

          <div className="space-y-8">
            <ProgressRoadmap />
            <QuickStatsRow />
            <CalloutCards />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientPortal;
