"use server";

import { createClient } from "@/lib/supabase/server";
import { Selection } from "@heroui/react";
import { supabase } from "./supabase/client";
import { redirect } from "next/navigation";
import { id } from "zod/locales";
import { ProjectMemberRow } from "@/types/projectMember";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

///____________________________________________________________________________________________________________
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
    user_id: userId,
    project_id: newProjectId,
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

///____________________________________________________________________________________________________________
export const projectMembers = async (projectId: string) => {
  const supabase = await createClient();
  const { data: membersData, error: membersError } = await supabase
    .from("project_members")
    .select("user_id, profiles(email)")
    .eq("project_id", projectId)
    .returns<ProjectMemberRow[]>();

  const emails = membersData?.map((member) => member.profiles?.email);

  if (membersError) {
    console.log(membersError.message);
  } else {
    console.log("datos de los participantes extraidos. con exito");
    return emails;
  }
};

///____________________________________________________________________________________________________________
export const addParticipants = async (projectId: string, userIds: string[]) => {
  const supabase = await createClient();
  const rows = userIds.map((userId) => ({
    user_id: userId,
    project_id: projectId,
  }));

  const { data: addParticipantsData, error: addParticipantsError } =
    await supabase.from("project_members").insert(rows);

  if (addParticipantsError) {
    console.log("error en los particpantes");
    console.log(addParticipantsError.message);
  } else {
    console.log("participante/s nuevo/s añadido/s con exito");
  }

  if (addParticipantsError) {
    if (addParticipantsError.code === "23505") {
      throw new Error("Alguno de esos usuarios ya es miembro del proyecto");
    }
    throw addParticipantsError;
  }
};

///____________________________________________________________________________________________________________
export const getTasks = async (projectId: string) => {
  const supabase = await createClient();

  const { data: tasksData, error: tasksError } = await supabase
    .from("tasks")
    .select("*, states(name, category)")
    .eq("project_id", projectId);

  if (tasksError) console.error(tasksError.message);

  return tasksData;
};

///____________________________________________________________________________________________________________
export const deleteTask = async (taskId: string, projectId: string) => {
  const supabase = await createClient();
  const { data: deleteTaskData, error: deleteTaskError } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (deleteTaskError) return console.error(deleteTaskError.message);

  revalidatePath(`/projects/${projectId}`);
};

///____________________________________________________________________________________________________________
export async function updateTaskStatus(
  taskId: string,
  statusId: string | null,
  projectId: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({ status_id: statusId })
    .eq("id", taskId)
    .select();

  if (error) throw new Error(error.message);

  revalidatePath(`/projects/${projectId}`);
}

///____________________________________________________________________________________________________________
export const getStates = async (projectId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("states")
    .select("*")
    .eq("project_id", projectId);

  if (error) console.error(error.message);
  return data;
};

///____________________________________________________________________________________________________________
export const addState = async (projectId: string, stateName: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("states")
    .insert({ project_id: projectId, name: stateName });

  if (error) {
    console.error(error.message);
  }
};

///____________________________________________________________________________________________________________
const VALID_PRIORITIES = ["low", "medium", "high"];

export const changeTaskPriority = async (
  taskId: string,
  priority: string,
  projectId: string,
) => {
  if (!VALID_PRIORITIES.includes(priority)) return; // ← validación

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ priority })
    .eq("id", taskId);

  if (error) {
    console.error("changeTaskPriority falló:", error.message);
    return;
  }
  revalidatePath(`/projects/${projectId}`);
};

///____________________________________________________________________________________________________________
export const setLocale = async (locale: "es" | "en") => {
  const store = await cookies();
  store.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
};
