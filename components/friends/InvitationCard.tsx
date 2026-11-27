"use client";

import { Card, Button } from "@heroui/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { refresh } from "next/cache";

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
  const t = useTranslations("InvitationCard");

  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", invitationId);

    if (!error) {
      setIsVisible(false);
    }

    setIsLoading(false);
    router.refresh();
  };

  const handleDecline = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("friendships")
      .update({ status: "rejected" })
      .eq("id", invitationId);

    if (!error) {
      setIsVisible(false);
    }

    setIsLoading(false);
    router.refresh();
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
            {t("accept")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            isPending={isLoading}
            onPress={handleDecline}
          >
            {t("decline")}
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}
