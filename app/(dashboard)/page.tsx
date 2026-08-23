import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import Link from "next/link";
import ProjectCard from "@/components/kanban/projectCard";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/project";
import LogoutButton from "@/components/LogoutButton.tsx";
import InvitationCard from "@/components/invitation/invitationCard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects, error: projectsError } = await supabase
    .from("Projects")
    .select("id, name, description, ownerId");

  if (projectsError) {
    console.log("Error al traer proyectos:", projectsError.message);
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email");

  if (profilesError) {
    console.log("Error al traer perfiles:", profilesError.message);
  }

  const handleCheckInvitations = () => {};

  return (
    <main className="min-h-screen p-8 bg-content1/40">
      <header className="max-w-3xl mx-auto mb-10">
        {/* Fila superior: acciones a la izquierda y derecha, repartidas con justify-between */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <LogoutButton />
                <Link href="/friendship-area">
                  <Button>Añadir colaborador</Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button>Iniciar sesión</Button>
              </Link>
            )}
          </div>

          {user && (
            <div>
              <Button>Invitaciones</Button>
              <InvitationCard
                userSenderEmail={""}
                description={""}
              ></InvitationCard>
            </div>
          )}
        </div>

        {/* Bloque de bienvenida, ahora sí centrado de verdad */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            {user ? `Hola, ${user.email}` : "Bienvenido"}
          </h1>
          <p className="text-default-500 mt-2">Gestión de proyectos y tareas</p>
        </div>
      </header>

      {user && (
        <div>
          <section className="flex justify-center mb-10">
            <Link href="/create-project">
              <Button>Nuevo proyecto</Button>
            </Link>
          </section>

          <section className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Proyectos</h2>

            <div className="grid gap-4 text-black">
              {projects?.map((project: Project) => {
                const projectOwner = profiles?.find(
                  (p) => p.id === project.ownerId,
                );

                return (
                  <ProjectCard
                    key={project.id}
                    name={project.name}
                    description={project.description}
                    ownerEmail={projectOwner?.email || "Usuario desconocido"}
                  />
                );
              })}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
