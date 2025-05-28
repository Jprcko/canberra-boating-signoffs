
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { checkIsAdmin } from "@/services/adminService";

export function useAdminAuth() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }

      try {
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);

  return { 
    user, 
    isAdmin, 
    loading: loading || adminLoading 
  };
}
