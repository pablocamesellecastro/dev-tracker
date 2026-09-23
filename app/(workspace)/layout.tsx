// app/(dashboard)/layout.tsx
import { Badge, Button, Popover } from "@heroui/react";
import { Bell, LayoutColumns } from "@gravity-ui/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import InvitationCard from "@/components/invitation/invitationCard";
import InviteModal from "@/components/Modals/InviteModal";
import LogoutButton from "@/components/LogoutButton.tsx";
import FriendsModal from "@/components/Modals/FriendsModal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email");

  const { data: invitations } = await supabase
    .from("Friendships")
    .select("id, senderId, status")
    .eq("receiverId", user?.id)
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
            <span className="font-semibold">Tablero</span>
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
                      aria-label="Notificaciones"
                    >
                      <Bell className="size-4" />
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content className="w-80">
                    <Popover.Dialog>
                      <Popover.Heading>Solicitudes de amistad</Popover.Heading>
                      <div className="flex flex-col gap-3 mt-3 max-h-80 overflow-y-auto">
                        {hasInvitations ? (
                          invitations!.map((invitation) => {
                            const sender = profiles?.find(
                              (p) => p.id === invitation.senderId,
                            );
                            return (
                              <InvitationCard
                                key={invitation.id}
                                invitationId={invitation.id}
                                userSenderEmail={
                                  sender?.email || "Usuario desconocido"
                                }
                                description="Te ha enviado una solicitud de amistad"
                              />
                            );
                          })
                        ) : (
                          <p className="text-sm text-default-500 text-center py-6">
                            No tienes solicitudes pendientes
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
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </header>

      {children}
    </>
  );
}
