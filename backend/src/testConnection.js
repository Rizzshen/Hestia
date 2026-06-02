// testConnection.js
import "dotenv/config";
import { supabase } from "./config/supabase.js";

const { data, error } = await supabase.auth.getSession();

if (error) {
  console.error("❌ Failed:", error.message);
} else {
  console.log("✅ Supabase connected!");
}
