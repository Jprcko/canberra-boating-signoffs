
import { supabase } from "@/integrations/supabase/client";

export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const getUserRole = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data?.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
};

export const assignAdminRole = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({ 
        user_id: userId, 
        role: 'admin' 
      })
      .select();

    if (error) {
      console.error('Error assigning admin role:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error assigning admin role:', error);
    throw error;
  }
};
