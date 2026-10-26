"use client";
import { DragDropProvider } from "@dnd-kit/react";
import { ReactNode } from "react";
import { updateTaskStatus } from "@/lib/actions";

interface Props {
  children: ReactNode;
  projectId: string;
}

export default function KanbanBoard({ children, projectId }: Props) {
  return (
    <DragDropProvider
      onDragEnd={async (event) => {
        const { source, target } = event.operation;

        if (event.canceled || !source || !target) return;

        const newState = target.id === "nostate" ? null : String(target.id);
        await updateTaskStatus(String(source.id), newState, projectId);
      }}
    >
      {children}
    </DragDropProvider>
  );
}
