import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import Link from "next/link";
import ProjectCard from "@/components/kanban/projectCard";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/project";
import LogoutButton from "@/components/LogoutButton.tsx";

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

  console.log("Proyectos de la BD:", projects);

  console.log(projects);

  return (
    <main className="min-h-screen p-8 bg-content1/40">
      <header className="text-center mb-10">
        <div>
          {user ? (
            <LogoutButton />
          ) : (
            <div>
              <Link href="/login">
                <Button>iniciar sesion</Button>
              </Link>
            </div>
          )}
        </div>

        <div>{user ? <h1>Hola, {user?.email}</h1> : <h1>Bienvenido</h1>}</div>
        <p className="text-default-500 mt-2">Gestion de proyectos y tareas</p>
      </header>

      {user ? (
        <div>
          <section className="flex justify-center gap-4 mb-10">
            <Link href="/create-project">
              <Button variant="primary">
                <Plus />
                New project
              </Button>
            </Link>
          </section>

          <section className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>

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
      ) : (
        <></>
      )}
    </main>
  );
}
