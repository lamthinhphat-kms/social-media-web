import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://fyekiokjhakcsmckvyqu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZWtpb2tqaGFrY3NtY2t2eXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1OTIyOTcsImV4cCI6MjAxMDE2ODI5N30.smW-2eu6LgFxm0c5hAXQgSd0kDKUOw_fkhE4RliKHig",
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
export default supabase;
