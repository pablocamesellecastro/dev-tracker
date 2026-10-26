"use client";
import {
  Button,
  Card,
  Dropdown,
  Header,
  Label,
  Separator,
} from "@heroui/react";
import { EllipsisVertical, Eye, TrashBin } from "@gravity-ui/icons";
import { useDraggable } from "@dnd-kit/react";

interface Props {
  id: string;
  name: string;
  priority?: string | null;
  onDelete: () => Promise<void>;
  onChangePriority: (priority: string) => Promise<void>;
}

const priorityStyles: Record<string, string> = {
  high: "bg-red-500/20 backdrop-blur-xs border-red-500",
  medium: "bg-orange-400/20 backdrop-blur-xs border-orange-400",
  low: "bg-green-500/20 backdrop-blur-xs border-green-500",
};

const priorityOptions = [
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export default function TaskCard({
  id,
  name,
  priority,
  onDelete,
  onChangePriority,
}: Props) {
  const { ref } = useDraggable({ id });

  const handleAction = (key: React.Key) => {
    if (key === "delete") onDelete();
    else onChangePriority(String(key));
  };

  return (
    <div
      ref={ref}
      className="w-44 max-w-full cursor-grab active:cursor-grabbing"
    >
      <Card
        variant="secondary"
        className={`p-2 ${priorityStyles[priority ?? ""] ?? ""} shadow-md`}
      >
        <Card.Content className="flex flex-row items-center justify-between gap-1">
          <p className="min-w-0 flex-1 truncate pl-1 text-sm">{name}</p>

          <Dropdown>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="size-6 min-w-0 bg-transparent"
              aria-label={`Opciones de la tarea ${name}`}
            >
              <EllipsisVertical className="size-4" />
            </Button>

            <Dropdown.Popover>
              <Dropdown.Menu onAction={handleAction}>
                <Dropdown.Section>
                  <Header>Task</Header>
                  <Dropdown.Item>
                    <Eye></Eye>See task
                  </Dropdown.Item>
                </Dropdown.Section>
                <Dropdown.Section>
                  <Header>Priority</Header>
                  {priorityOptions.map((option) => (
                    <Dropdown.Item
                      key={option.id}
                      id={option.id}
                      textValue={option.label}
                    >
                      <Label>{option.label}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Section>
                <Separator />
                <Dropdown.Item
                  id="delete"
                  textValue="Eliminar"
                  variant="danger"
                >
                  <TrashBin className="size-4 text-red-500" />
                  <Label>Delete task</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </Card.Content>
      </Card>
    </div>
  );
}
