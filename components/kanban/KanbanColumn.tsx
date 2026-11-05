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
    <div className={`w-full min-w-0 ${className ?? ""}`}>
      {name && (
        <div className="mb-2 flex items-center justify-center gap-2">
          <h2 className="text-sm font-medium sm:text-base">{name}</h2>
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
        className={`flex min-h-32 gap-3 rounded-2xl border-2 border-zinc-700 p-3 sm:min-h-40 sm:p-4 ${
          layout === "row"
            ? "flex-col sm:flex-row sm:flex-wrap sm:items-start"
            : "flex-col"
        } ${borderByCategory[category]}`}
      >
        {children}
      </div>
    </div>
  );
}
