import { Badge, Button, Popover } from "@heroui/react";
import { Bell, LayoutColumns } from "@gravity-ui/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import InvitationCard from "@/components/friends/InvitationCard";
import InviteModal from "@/components/friends/InviteModal";
import LogoutButton from "@/components/auth/LogoutButton";
import FriendsModal from "@/components/friends/FriendsModal";
import LanguageSelector from "@/components/LanguageSelector";

import { getTranslations } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("DashboardLayout");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email");

  const { data: invitations } = await supabase
    .from("friendships")
    .select("id, sender_id, status")
    .eq("receiver_id", user?.id)
    .eq("status", "pending");

  const hasInvitations = !!invitations && invitations.length > 0;

  return (
    <>
      <header className="border-b border-default-200 bg-background/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-accent/10 text-accent rounded-lg p-1.5">
              <LayoutColumns className="size-4" />
            </div>
            <span className="font-semibold">{t("workspace")}</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <FriendsModal />
              <InviteModal />
              <Badge.Anchor>
                <Popover>
                  <Popover.Trigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      isIconOnly
                      aria-label={t("notificationsAria")}
                    >
                      <Bell className="size-4" />
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content className="w-80">
                    <Popover.Dialog>
                      <Popover.Heading>
                        {t("friendRequestsTitle")}
                      </Popover.Heading>
                      <div className="flex flex-col gap-3 mt-3 max-h-80 overflow-y-auto">
                        {hasInvitations ? (
                          invitations!.map((invitation) => {
                            const sender = profiles?.find(
                              (p) => p.id === invitation.sender_id,
                            );
                            return (
                              <InvitationCard
                                key={invitation.id}
                                invitationId={invitation.id}
                                userSenderEmail={
                                  sender?.email || t("unknownUser")
                                }
                                description={t("invitationDescription")}
                              />
                            );
                          })
                        ) : (
                          <p className="text-sm text-default-500 text-center py-6">
                            {t("noPendingRequests")}
                          </p>
                        )}
                      </div>
                    </Popover.Dialog>
                  </Popover.Content>
                </Popover>
                {hasInvitations && (
                  <Badge color="danger" size="sm">
                    {invitations!.length}
                  </Badge>
                )}
              </Badge.Anchor>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">
                {t("login")}
              </Button>
            </Link>
          )}
          <LanguageSelector />
        </div>
      </header>

      {children}
    </>
  );
}
