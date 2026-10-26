"use client";

import { useDroppable } from "@dnd-kit/react";
import { Children, ReactNode } from "react";
import { Chip } from "@heroui/react";

interface Props {
  id: string;
  name: string;
  category?: string;
  layout?: "column" | "row";
  className?: string;
  children?: ReactNode;
}

const borderByCategory: Record<string, string> = {
  todo: "border-zinc-400",
  in_progress: "border-orange-400",
  done: "border-green-500",
};

const chipColorByCategory: Record<string, "default" | "warning" | "success"> = {
  todo: "default",
  in_progress: "warning",
  done: "success",
};

export default function KanbanColumn({
  id,
  name,
  category = "todo",
  layout = "column",
  className,
  children,
}: Props) {
  const { ref } = useDroppable({ id });
  const count = Children.count(children);

  return (
    <div className={className}>
      {name && (
        <div className="mb-2 flex items-center justify-center gap-2">
          <h2 className="font-medium">{name}</h2>
          <Chip
            size="sm"
            variant="soft"
            color={chipColorByCategory[category] ?? "default"}
          >
            {count}
          </Chip>
        </div>
      )}

      <div
        ref={ref}
        className={`flex min-h-40 gap-3 rounded-2xl  p-4 border-2 ${
          layout === "row" ? "flex-row flex-wrap items-start" : "flex-col"
        } ${borderByCategory[category] ?? "border-zinc-400"}`}
      >
        {children}
      </div>
    </div>
  );
}
