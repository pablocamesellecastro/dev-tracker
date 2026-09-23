import ProjectCard from "@/components/projectCard/projectCard";
import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button, PressEvent } from "@heroui/react";
import { deleteProject } from "@/lib/actions";
import { projectCreator } from "@/lib/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const supabase = await createClient();

  console.log("hola esto es full servidor");

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.log(error.message);
  }

  const handleDelete = async () => {
    "use server";
    await deleteProject(projectId);
  };

  const projectCreatorId = await projectCreator(projectId);

  return (
    <div>
      <p>hola</p>
      <p>nombre del proyecto: {project.name}</p>
      <p>creador del proyecto: {projectCreatorId}</p>
      <form action={handleDelete}>
        <Button variant="danger" type="submit">
          delete project
        </Button>
      </form>

      <ProjectCard
        name={project.name}
        description={project.description}
        ownerEmail={project.ownerEmail}
        projectId={project.ownerId}
      ></ProjectCard>
    </div>
  );
}
