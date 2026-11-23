"use client";

import { Avatar, Card, Chip } from "@heroui/react";
import { ArrowRight, Folder } from "@gravity-ui/icons";
import { projectCreator } from "@/lib/actions";

interface ProjectCardProps {
  projectId: string;
  name: string;
  description: string;
  ownerEmail: string;
}

export default function ProjectCard({
  name,
  description,
  projectId,
  ownerEmail,
}: ProjectCardProps) {
  const ownerEmailInitial = ownerEmail?.charAt(0)?.toUpperCase() || "?";

  return (
    <Card
      className="
        group
        cursor-pointer
        border
        border-default-200
        bg-background
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-default-300
        hover:shadow-lg
      "
    >
      <Card.Content className="flex flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className="
              flex size-11 shrink-0 items-center justify-center
              rounded-xl
              bg-accent/10
              text-accent
            "
          >
            <Folder className="size-5" />
          </div>

          <ArrowRight
            className="
              size-4
              text-default-300
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:text-default-600
            "
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3
            className="
              text-lg
              font-semibold
              tracking-tight
              text-foreground
              transition-colors
              group-hover:text-accent
            "
          >
            {name}
          </h3>

          <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-default-500">
            {description || "Este proyecto todavía no tiene descripción."}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-default-100 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar size="sm" color="accent">
              <Avatar.Fallback>{ownerEmailInitial}</Avatar.Fallback>
            </Avatar>

            <div className="min-w-0">
              <p className="text-[11px] text-default-400">Creado por</p>

              <p className="truncate text-xs font-medium text-default-600">
                {ownerEmail}
              </p>
            </div>
          </div>

          <Chip size="sm" variant="soft">
            Proyecto
          </Chip>
        </div>
      </Card.Content>
    </Card>
  );
}
