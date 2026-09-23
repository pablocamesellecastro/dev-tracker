import { supabase } from "@/lib/supabase/client";

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error obteniendo el usuario:", error.message);

    return { user: null, error };
  }

  return { user, error: null };
}
