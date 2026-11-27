import { Badge, Button, Popover } from "@heroui/react";
import { Bell, LayoutColumns } from "@gravity-ui/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import InvitationCard from "@/components/friends/InvitationCard";
import InviteModal from "@/components/friends/InviteModal";
import FriendsModal from "@/components/friends/FriendsModal";
import LanguageSelector from "@/components/LanguageSelector";
import UserMenu from "@/components/auth/UserMenu";

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
      <header className="sticky top-0 z-50 border-b border-default-200/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent text-white">
              <LayoutColumns className="size-4" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              {t("appName")}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {user ? (
              <>
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
                        className="text-default-500 hover:text-foreground"
                      >
                        <Bell className="size-[18px]" />
                      </Button>
                    </Popover.Trigger>

                    <Popover.Content className="w-[min(340px,calc(100vw-2rem))]">
                      <Popover.Dialog>
                        <div className="border-b border-default-200 pb-3">
                          <Popover.Heading>
                            {t("friendRequestsTitle")}
                          </Popover.Heading>
                          <p className="mt-1 text-xs text-default-500">
                            {t("manageConnections")}
                          </p>
                        </div>

                        <div className="mt-3 flex max-h-80 flex-col gap-3 overflow-y-auto">
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
                            <div className="flex flex-col items-center gap-2 py-8 text-center">
                              <div className="flex size-10 items-center justify-center rounded-full bg-default-100">
                                <Bell className="size-4 text-default-400" />
                              </div>
                              <p className="text-sm font-medium">
                                {t("allCaughtUp")}
                              </p>
                              <p className="text-xs text-default-500">
                                {t("noPendingRequests")}
                              </p>
                            </div>
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

                <div className="mx-2 h-5 w-px bg-default-200" />

                <LanguageSelector />
                <UserMenu email={user.email ?? ""} />
              </>
            ) : (
              <>
                <LanguageSelector />
                <Link
                  href="/login"
                  className="ml-1 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Button variant="primary" size="sm" className="font-medium">
                    {t("login")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {children}
    </>
  );
}
