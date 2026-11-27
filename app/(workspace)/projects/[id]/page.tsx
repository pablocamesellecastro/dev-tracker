import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Avatar, Button, Card, Chip } from "@heroui/react";
import {
  deleteProject,
  projectCreator,
  projectMembers,
  getTasks,
  deleteTask,
  getStates,
  changeTaskPriority,
} from "@/lib/actions";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import AddParticipantModal from "@/components/projects/AddParticipantModal";
import AddStateModal from "@/components/projects/AddStateModal";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import TaskCard from "@/components/tasks/TaskCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const t = await getTranslations("ProjectPage");

  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    notFound();
  }

  const handleDelete = async () => {
    "use server";
    await deleteProject(projectId);
  };

  const tasks = await getTasks(projectId);
  const states = await getStates(projectId);

  const projectCreatorEmail = await projectCreator(projectId);
  const projectMembersEmails = await projectMembers(projectId);

  const handleDeleteTask = async (taskId: string) => {
    "use server";
    await deleteTask(taskId, projectId);
  };

  const handleChangePriority = async (taskId: string, priority: string) => {
    "use server";
    await changeTaskPriority(taskId, priority, projectId);
  };

  const membersResult = await projectMembers(projectId);

  const participants = [
    { email: projectCreatorEmail, isAdmin: true },
    ...(membersResult?.emails ?? [])
      .filter((email: string) => email !== projectCreatorEmail)
      .map((email: string) => ({ email, isAdmin: false })),
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-center font-bold">{project.name.toUpperCase()}</h1>

      <Card className="flex items-center bg-transparent">
        <Card.Content className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
          <AddTaskModal projectId={projectId} />
          <AddStateModal projectId={projectId} />
          <AddParticipantModal projectId={projectId} />
        </Card.Content>
      </Card>

      <KanbanBoard projectId={projectId}>
        <div className="flex flex-col gap-6">
          <div>
            <KanbanColumn id="nostate" name="" layout="row" className="w-full">
              {tasks
                ?.filter((task) => !task.status_id)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    description={task.description}
                    onDelete={handleDeleteTask.bind(null, task.id)}
                    priority={task.priority}
                    onChangePriority={handleChangePriority.bind(null, task.id)}
                  />
                ))}
            </KanbanColumn>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
            {states?.map((state) => (
              <KanbanColumn
                key={state.id}
                id={state.id}
                name={state.name}
                category={state.category}
                className="min-w-0 flex-1"
              >
                {tasks
                  ?.filter((task) => task.status_id === state.id)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      name={task.name}
                      description={task.description}
                      onDelete={handleDeleteTask.bind(null, task.id)}
                      priority={task.priority}
                      onChangePriority={handleChangePriority.bind(
                        null,
                        task.id,
                      )}
                    />
                  ))}
              </KanbanColumn>
            ))}
          </div>
        </div>
      </KanbanBoard>

      <Card>
        <Card.Header className="flex flex-row items-start justify-between gap-4">
          <div>
            <Card.Description>{t("participants")}</Card.Description>
          </div>
        </Card.Header>
        <Card.Content>
          <ul className="flex flex-wrap gap-4">
            {participants.map(({ email, isAdmin }) => (
              <li key={email} className="flex items-center gap-2">
                <Avatar size="sm">
                  <Avatar.Fallback>
                    {email.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>

                {isAdmin && (
                  <Chip size="sm" color="accent" variant="soft">
                    {t("admin")}
                  </Chip>
                )}
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>

      <form action={handleDelete}>
        <Button variant="ghost" type="submit">
          {t("deleteProject")}
        </Button>
      </form>
    </div>
  );
}
