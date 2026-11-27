import { Badge, Button, Popover } from "@heroui/react";
import { Bell, LayoutColumns } from "@gravity-ui/icons";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import InvitationCard from "@/components/friends/InvitationCard";
import InviteModal from "@/components/friends/InviteModal";
import LogoutButton from "@/components/auth/LogoutButton";
import FriendsModal from "@/components/friends/FriendsModal";
import LanguageSelector from "@/components/LanguageSelector";
import { redirect } from "next/navigation";

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

  if (!user) redirect("/login");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email");

  const { data: invitations } = await supabase
    .from("friendships")
    .select("id, sender_id, status")
    .eq("receiverId", user?.id)
    .eq("status", "pending");

  const hasInvitations = !!invitations && invitations.length > 0;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-default-200/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <LayoutColumns className="size-[18px]" />
            </div>

            <div className="flex flex-col gap-0">
              <span className="text-[15px] font-semibold tracking-tight">
                {t("appName")}
              </span>
              <span className="text-[11px] font-medium tracking-wide text-default-400">
                {t("workspace")}
              </span>
            </div>
          </Link>

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
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
                      className="relative text-default-500 transition-colors hover:text-foreground"
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

              <div className="mx-1 h-6 w-px bg-default-200/80" />

              <LogoutButton />
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="font-medium">
                {t("login")}
              </Button>
            </Link>
          )}
          <LanguageSelector />
        </div>
      </header>

      <main>{children}</main>
    </>
  );
}
