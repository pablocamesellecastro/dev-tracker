"use client";
import { Card } from "@heroui/react";

interface ProjectCardProps {
  name: string;
  description: string;
  ownerEmail: string;
}

export default function ProjectCard({
  name,
  description,
  ownerEmail,
}: ProjectCardProps) {
  return (
    <span className="cursor-pointer">
      <Card>
        <Card.Content>
          <p className="font-bold">{name}</p>
          <p className="text-default-500 text-sm">{description}</p>
          <p className="text-default-500 text-sm">Created by {ownerEmail}</p>
        </Card.Content>
      </Card>
    </span>
  );
}
