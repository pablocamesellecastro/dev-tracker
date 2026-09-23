"use server";

import { createClient } from "@/lib/supabase/server";
import { Selection } from "@heroui/react";
import { supabase } from "./supabase/client";
import { redirect } from "next/navigation";
import { id } from "zod/locales";

export const createProject = async (
  projectName: string,
  description: string,
  participants: Selection,
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No hay usuario autenticado");
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: projectName,
      description: description,
      owner_id: user.id,
    })
    .select("id");

  if (error || !data || data.length === 0) {
    console.error("Error creating project:", error?.message);
    return null;
  }

  const newProjectId = data[0].id;

  let participantIds: string[] = [];

  if (participants === "all") {
    participantIds = [];
  } else {
    participantIds = Array.from(participants) as string[];
  }

  if (participantIds.length === 0) {
    console.log("Proyecto creado correctamente (sin participantes)");
    return data;
  }

  const uniqueParticipants = new Set([...participantIds, user.id]);

  const rows = Array.from(uniqueParticipants).map((userId) => ({
    userId: userId,
    projectId: newProjectId,
  }));

  const { error: rowsError } = await supabase
    .from("project_members")
    .insert(rows);

  if (rowsError) {
    console.error("Error adding members:", rowsError.message);
  }

  console.log("Proyecto creado correctamente con sus participantes");

  return data;
};

///____________________________________________________________________________________________________________

export const deleteProject = async (projectId: string) => {
  console.log("Intentando eliminar proyecto:", projectId);

  const supabaseServer = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();

  if (authError || !user) {
    console.error("No autorizado o sesión expirada");
    return { success: false, error: "No autorizado" };
  }

  const { data: deleteProjectData, error: deleteProjectError } =
    await supabaseServer.from("projects").delete().eq("id", projectId);

  if (deleteProjectError) {
    console.log(deleteProjectError.message);
    console.log("ha habido un problema al eliminar el proyecto");
  }

  redirect("/");
  return { success: true };
};

///____________________________________________________________________________________________________________

export const projectCreator = async (projectId: string) => {
  const { data: projectCreatorId, error: projectCreatorIdError } =
    await supabase
      .from("projects")
      .select("owner_id")
      .eq("id", projectId)
      .single();

  if (projectCreatorIdError) {
    console.log("ha habido un problema");
    console.log(projectCreatorIdError);
  } else {
    console.log("id del creador extraido con exito");
  }

  const { data: projectCreatorEmail, error: projectCreatorEmailError } =
    await supabase
      .from("profiles")
      .select("email")
      .eq("id", projectCreatorId?.owner_id)
      .single();

  if (projectCreatorEmailError) {
    console.log(projectCreatorEmailError);
  } else {
    console.log("email del creador extraido con exito");
    return projectCreatorEmail.email;
  }
};
