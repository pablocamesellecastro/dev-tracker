"use client";
import { Card } from "@heroui/react";
import { Button } from "@heroui/react";

interface InvitationCardProps {
  userSenderEmail: string;
  description: string;
}

export default function InvitationCard({
  userSenderEmail,
  description,
}: InvitationCardProps) {
  return (
    <span className="cursor-pointer">
      <Card>
        <Card.Content>
          <p className="font-bold">{userSenderEmail} wants to be your friend</p>
          <p className="text-default-500 text-sm">{description}</p>
          <Button type="submit">Accept</Button>
          <Button type="submit">Decline</Button>
        </Card.Content>
      </Card>
    </span>
  );
}
