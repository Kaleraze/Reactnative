import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
// O.N URL O/> Key / N /N N Supabase / >
const supabaseUrl = "https://qhskfrudkpficghyroik.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoc2tmcnVka3BmaWNnaHlyb2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzg0ODgsImV4cCI6MjA3MzkxNDQ4OH0.6K0vEnr6VmBn1we_rdXJQe4-vhA6Z2-emPV6vYJLW8I";
// ./O> Client N . O>/ O/OO O AsyncStorage


export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});