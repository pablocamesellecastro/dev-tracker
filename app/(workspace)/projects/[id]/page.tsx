import ProjectCard from "@/components/projectCard/projectCard";
import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button, PressEvent } from "@heroui/react";
import { deleteProject } from "@/lib/actions";
import { projectCreator } from "@/lib/actions";
import SelectParticipants from "@/components/SelectParticipants";
import { Selection } from "@heroui/react";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";
import { Plus } from "@gravity-ui/icons";
import { projectMembers } from "@/lib/actions";
import AddTaskModal from "@/components/Modals/AddTaskModal";
import AddParticipantModal from "@/components/Modals/AddParticipantModal";
import AddStateModal from "@/components/Modals/AddStateModal";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { getTasks } from "@/lib/actions";
import { deleteTask } from "@/lib/actions";
import TaskCard from "@/components/tasks/TaskCard";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import { getStates } from "@/lib/actions";
import { Avatar, Card, Chip } from "@heroui/react";
import { changeTaskPriority } from "@/lib/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  console.log("parte del servidor");

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

  const tasks = await getTasks(projectId);
  const states = await getStates(projectId);

  console.log("tareas", tasks?.length);

  const projectCreatorEmail = await projectCreator(projectId);
  const projectMembersEmails = await projectMembers(projectId);

  const handleDeleteTask = async (taskId: string) => {
    "use server";
    await deleteTask(taskId, projectId);
  };

  const participants = [
    { email: projectCreatorEmail, isAdmin: true },
    ...(projectMembersEmails ?? [])
      .filter((email: string) => email !== projectCreatorEmail)
      .map((email: string) => ({ email, isAdmin: false })),
  ];

  const handleChangePriority = async (taskId: string, priority: string) => {
    "use server";
    await changeTaskPriority(taskId, priority, projectId);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-center font-bold">{project.name.toUpperCase()}</h1>
      <Card variant="secondary">
        <Card.Content className="flex flex-row flex-wrap items-center gap-2">
          <AddTaskModal projectId={projectId} />
          <AddStateModal projectId={projectId} />
          <AddParticipantModal projectId={projectId} />
        </Card.Content>
      </Card>

      <KanbanBoard projectId={projectId}>
        <div className="flex flex-col gap-6">
          <div className="">
            <KanbanColumn id="nostate" name="" layout="row" className="w-full">
              {tasks
                ?.filter((task) => !task.status_id)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    onDelete={handleDeleteTask.bind(null, task.id)}
                    priority={task.priority}
                    onChangePriority={handleChangePriority.bind(null, task.id)}
                  />
                ))}
            </KanbanColumn>
          </div>

          <div className="flex flex-row items-start gap-6">
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
            <Card.Description>Participants</Card.Description>
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
                    admin
                  </Chip>
                )}
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>
      <form action={handleDelete}>
        <Button variant="ghost" type="submit" className="">
          Delete project
        </Button>
      </form>
    </div>
  );
}
