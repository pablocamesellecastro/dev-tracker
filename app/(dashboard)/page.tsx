import { Button, Card, Chip } from "@heroui/react";
import {
  ArrowRight,
  FolderOpen,
  LayoutColumns,
  Rocket,
} from "@gravity-ui/icons";
import Link from "next/link";
import ProjectCard from "@/components/projects/ProjectCard";
import { createClient } from "@/lib/supabase/server";
import { Project, MemberRow } from "@/types/project";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { getTranslations } from "next-intl/server";

function BoardPreview() {
  const columns = [
    { border: "border-zinc-400", cards: [3, 2, 3] },
    { border: "border-orange-400", cards: [2, 3] },
    { border: "border-green-500", cards: [3] },
  ];

  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-default-200 bg-surface p-4 shadow-sm"
    >
      <div className="grid grid-cols-3 gap-3">
        {columns.map((col, i) => (
          <div
            key={i}
            className={`flex min-h-44 flex-col gap-2 rounded-xl border-2 ${col.border} p-2`}
          >
            <div className="mx-auto h-1.5 w-10 rounded-full bg-default-300" />
            {col.cards.map((lines, j) => (
              <div
                key={j}
                className="flex flex-col gap-1.5 rounded-lg border border-default-200 bg-background p-2"
              >
                <div className="h-1.5 w-3/4 rounded-full bg-default-300" />
                {lines === 3 && (
                  <div className="h-1.5 w-1/2 rounded-full bg-default-200" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const t = await getTranslations("HomePage");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ownedProjects, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, description, owner_id")
    .eq("owner_id", user?.id);

  const { data: memberRows } = await supabase
    .from("project_members")
    .select("projects(id, name, description, owner_id)")
    .eq("user_id", user?.id)
    .returns<MemberRow[]>();

  const memberProjects = memberRows?.map((row) => row.projects) ?? [];

  const allProjectsMap = new Map();
  [...(ownedProjects ?? []), ...memberProjects].forEach((p) => {
    allProjectsMap.set(p.id, p);
  });

  const projects = Array.from(allProjectsMap.values());

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email");

  return (
    <main className="min-h-screen bg-background">
      {!user ? (
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t("heroTitle")}
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-default-500">
              {t("heroSubtitle")}
            </p>

            <Link
              href="/login"
              className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Button variant="primary" size="lg">
                {t("login")}
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <div className="flex flex-wrap gap-2 pt-2">
              <Chip variant="soft">{t("chipKanban")}</Chip>
              <Chip variant="soft">{t("chipInvite")}</Chip>
              <Chip variant="soft">{t("chipAllInOne")}</Chip>
            </div>
          </div>

          <BoardPreview />
        </section>
      ) : (
        <div className="mx-auto max-w-5xl px-6 py-12">
          <section>
            <div className="mb-8 flex items-center justify-between gap-4 border-default-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-default-100 text-default-600">
                  <FolderOpen className="size-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {t("yourProjects")}
                </h2>
              </div>

              <CreateProjectModal />
            </div>

            {projects.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project: Project) => {
                  const projectOwner = profiles?.find(
                    (p) => p.id === project.owner_id,
                  );

                  return (
                    <Link
                      href={`/projects/${project.id}`}
                      key={project.id}
                      className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <ProjectCard
                        name={project.name}
                        description={project.description}
                        ownerEmail={projectOwner?.email || t("unknownUser")}
                        projectId={project.id}
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
                <Card.Content className="flex flex-col items-center gap-4 py-16 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-default-100 text-default-500">
                    <Rocket className="size-6" />
                  </div>
                  <p className="max-w-xs text-default-500">
                    {t("emptyProjects")}
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
