import { supabase } from "../lib/supabase";

export const AuthService = {
 async getCurrentUserRole() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profile")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    console.log("ROLE FETCH ERROR:", error);
    return null;
  }

  return data.role?.trim().toLowerCase();
}
};