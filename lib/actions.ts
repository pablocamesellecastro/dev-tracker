"use server";

import { createClient } from "@/lib/supabase/server";

export const createProject = async (
  projectName: string,
  description: string,
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("Projects")
    .insert({
      name: projectName,
      description: description,
      ownerId: user?.id,
    })
    .select();

  if (error) {
    console.error("Error creating project:", error.message);
    return null;
  }

  console.log("proyecto creado correctamente");
  return data;
};
