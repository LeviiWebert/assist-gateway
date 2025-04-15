
import { supabase } from '@/integrations/supabase/client';

// Function to get all invoices
const getAll = async () => {
  const { data, error } = await supabase
    .from('facturations')
    .select('*');
  
  if (error) throw error;
  return data;
};

// Function to get an invoice by ID
const getById = async (id: string) => {
  const { data, error } = await supabase
    .from('facturations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Export the service functions
export const facturationService = {
  getAll,
  getById
};
