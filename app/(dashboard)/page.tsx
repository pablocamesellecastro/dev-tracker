import { Avatar, Badge, Button, Card, Chip, Popover } from "@heroui/react";
import {
  ArrowRight,
  Bell,
  FolderOpen,
  Folders,
  LayoutColumns,
  PersonPlus,
  Persons,
  Plus,
  Rocket,
} from "@gravity-ui/icons";
import Link from "next/link";
import ProjectCard from "@/components/projectCard/projectCard";
import InvitationCard from "@/components/invitation/invitationCard";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/project";
import LogoutButton from "@/components/LogoutButton";
import { MemberRow } from "@/types/project";
import CreateProjectModal from "@/components/Modals/CreateProjectModal";
import InviteModal from "@/components/Modals/InviteModal";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  ///________________________________________________________________________

  const { data: ownedProjects, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, description, owner_id")
    .eq("owner_id", user?.id);

  const { data: memberRows, error: memberError } = await supabase
    .from("project_members")
    .select("projects(id, name, description, owner_id)")
    .eq("user_id", user?.id)
    .returns<MemberRow[]>();

  const memberProjects = memberRows?.map((row) => row.Projects) ?? [];

  const allProjectsMap = new Map();
  [...(ownedProjects ?? []), ...memberProjects].forEach((p) => {
    allProjectsMap.set(p.id, p);
  });

  const projects = Array.from(allProjectsMap.values());

  ///________________________________________________________________________

  if (projectsError) {
    console.log("Error al traer proyectos:", projectsError.message);
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email");

  if (profilesError) {
    console.log("Error al traer perfiles:", profilesError.message);
  }

  const { data: invitations, error: invitationsError } = await supabase
    .from("friendships")
    .select("id, sender_id, status")
    .eq("receiver_id", user?.id)
    .eq("status", "pending");

  if (invitationsError) {
    console.log("Error al traer invitaciones:", invitationsError.message);
  }

  return (
    <main className="min-h-screen bg-content1/40">
      {!user ? (
        <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          <div className="bg-accent/10 text-accent rounded-full p-5 mb-6">
            <LayoutColumns className="size-8" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Organiza tus proyectos sin perder el hilo
          </h1>
          <p className="text-default-500 text-lg mb-8 max-w-md">
            Tableros, tareas y equipo en un solo sitio. Invita a tus compañeros
            y avanza junto a ellos.
          </p>

          <Link href="/login">
            <Button variant="primary" size="lg">
              Iniciar sesión
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <div className="flex flex-wrap justify-center gap-2 mt-10">
            <Chip variant="soft" color="accent">
              Tableros Kanban
            </Chip>
            <Chip variant="soft" color="accent">
              Invita a tu equipo
            </Chip>
            <Chip variant="soft" color="accent">
              Todo en un solo lugar
            </Chip>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FolderOpen className="size-5 text-default-500" />
                Tus proyectos
              </h2>
              <CreateProjectModal />
            </div>

            {projects && projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {projects.map((project: Project) => {
                  const projectOwner = profiles?.find(
                    (p) => p.id === project.owner_id,
                  );

                  return (
                    <Link href={`/projects/${project.id}`} key={project.id}>
                      <ProjectCard
                        name={project.name}
                        description={project.description}
                        ownerEmail={
                          projectOwner?.email || "Usuario desconocido"
                        }
                        projectId={projectOwner?.id}
                      />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Card
                variant="transparent"
                className="border border-dashed border-default-300"
              >
                <Card.Content className="flex flex-col items-center text-center py-14 gap-3">
                  <Rocket className="size-8 text-default-400" />
                  <p className="text-default-500">
                    Aún no tienes proyectos. ¡Crea el primero para empezar!
                  </p>
                </Card.Content>
              </Card>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
