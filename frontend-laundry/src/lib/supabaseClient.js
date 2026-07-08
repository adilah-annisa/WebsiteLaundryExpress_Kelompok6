import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://uqiophkifkaseoiilich.supabase.co/rest/v1/pesanan";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);