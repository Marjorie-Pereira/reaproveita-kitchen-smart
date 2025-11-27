import { supabase } from "@/lib/supabase";

export async function isDuplicateRecord(
  tableName: string,
  field: string,
  value: any
) {
  const userResponse = await supabase.auth.getUser();
  const { user } = userResponse.data;

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(field, value)
    .eq("id_usuario", user?.id);
  if (error) {
    console.error(error);
    return false;
  }
  return data.length > 0;
}
