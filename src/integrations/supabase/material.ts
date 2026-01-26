import { supabase } from "./client";


export async function createMaterial(data: {
  name: string;
  description?: string;
  category_id: string;
  weight_kg: number;
  quantity: number;
  unit: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  const { error } = await supabase.from("materials").insert({
    ...data,
    user_id: user.id,
    status: "pendente",
  });

  if (error) throw error;
}

export async function fetchMaterials() {
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
