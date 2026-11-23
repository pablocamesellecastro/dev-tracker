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
import { useTranslations } from "next-intl";
import TaskModal from "./TaskModal";
import { useOverlayState } from "@heroui/react";

interface Props {
  id: string;
  name: string;
  priority?: string | null;
  description?: string | null;
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

const priorityIds = ["high", "medium", "low"] as const;

export default function TaskCard({
  id,
  name,
  priority,
  description,
  onDelete,
  onChangePriority,
}: Props) {
  const t = useTranslations("TaskCard");
  const tCommon = useTranslations("Common");

  const { ref } = useDraggable({ id });
  const state = useOverlayState();

  const handleAction = (key: React.Key) => {
    if (key === "view") state.open();
    else if (key === "delete") onDelete();
    else onChangePriority(String(key));
  };

  return (
    <>
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
                aria-label={t("optionsAria", { name })}
              >
                <EllipsisVertical className="size-4" />
              </Button>

              <Dropdown.Popover>
                <Dropdown.Menu onAction={handleAction}>
                  <Dropdown.Section>
                    <Header>{t("taskSection")}</Header>
                    <Dropdown.Item id="view" textValue={t("view")}>
                      <Eye />
                      {t("view")}
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Dropdown.Section>
                    <Header>{t("prioritySection")}</Header>
                    {priorityIds.map((id) => (
                      <Dropdown.Item
                        key={id}
                        id={id}
                        textValue={tCommon(`priority.${id}`)}
                      >
                        <Label>{tCommon(`priority.${id}`)}</Label>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Section>
                  <Separator />
                  <Dropdown.Item
                    id="delete"
                    textValue={t("delete")}
                    variant="danger"
                  >
                    <TrashBin className="size-4 text-red-500" />
                    <Label>{t("delete")}</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </Card.Content>
        </Card>
      </div>

      <TaskModal
        isOpen={state.isOpen}
        onOpenChange={state.setOpen}
        name={name}
        description={description}
        priority={priority}
      />
    </>
  );
}
