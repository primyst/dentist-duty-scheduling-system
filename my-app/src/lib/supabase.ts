import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://emyuwescpiarktipzxzp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVteXV3ZXNjcGlhcmt0aXB6eHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDA0OTQsImV4cCI6MjA2MzA3NjQ5NH0.4V3rlH8uMgCXghH6XcQiAtZ_FWJP2Az-vCUZgBVWzl4";

export const supabase = createClient(supabaseUrl, supabaseKey)