import { supabase } from "../lib/supabaseClient";

export const pesananAPI = {
  async fetchPesanan() {
    const { data, error } = await supabase
      .from("pesanan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createPesanan(payload) {
    const { data, error } = await supabase
      .from("pesanan")
      .insert(payload)
      .select();

    if (error) throw error;
    return data;
  },

  async deletePesanan(id) {
    const { error } = await supabase
      .from("pesanan")
      .delete()
      .eq("pesan_id", id);

    if (error) throw error;
  },
};