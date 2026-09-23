"use client";

import { Card, Button } from "@heroui/react";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface InvitationCardProps {
  invitationId: string;
  userSenderEmail: string;
  description: string;
}

export default function InvitationCard({
  invitationId,
  userSenderEmail,
  description,
}: InvitationCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("Friendships")
      .update({ status: "accepted" })
      .eq("id", invitationId);

    if (error) {
      console.log("Error al aceptar invitación:", error.message);
    } else {
      console.log("Invitación aceptada con éxito");
      setIsVisible(false);
    }

    setIsLoading(false);
  };

  const handleDecline = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("Friendships")
      .update({ status: "rejected" })
      .eq("id", invitationId);

    if (error) {
      console.log("Error al rechazar invitación:", error.message);
    } else {
      console.log("Invitación rechazada");
      setIsVisible(false);
    }

    setIsLoading(false);
  };

  if (!isVisible) return null;

  return (
    <Card className="w-full max-w-sm">
      <Card.Content className="gap-3">
        <div>
          <p className="font-semibold">{userSenderEmail}</p>
          <p className="text-default-500 text-sm">{description}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            isPending={isLoading}
            onPress={handleAccept}
          >
            Aceptar
          </Button>
          <Button
            variant="danger"
            size="sm"
            isPending={isLoading}
            onPress={handleDecline}
          >
            Rechazar
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}
