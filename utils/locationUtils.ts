import { supabase } from "@/lib/supabase";

export async function getLocationById(id: string): Promise<string> {
  const { data, error } = await supabase
    .from("Ambientes")
    .select("nome")
    .eq("id", id);

  if (error) {
    throw Error(error.message);
  }

  return data[0].nome;
}

export async function getLocationId(location: string) {
  const { data, error } = await supabase
    .from("Ambientes")
    .select("id")
    .eq("nome", location);

  if (error) {
    throw Error(error.message);
  }

  return data[0];
}
