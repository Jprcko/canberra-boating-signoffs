
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";

const ClientPortal = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-6">Client Portal</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Your Bookings</h3>
              <p className="text-gray-600">View and manage your bookings here.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Profile Settings</h3>
              <p className="text-gray-600">Update your personal information and preferences.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientPortal;
