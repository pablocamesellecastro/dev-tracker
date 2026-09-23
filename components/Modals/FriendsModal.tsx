"use client";

import { Button, Modal, Spinner, useOverlayState } from "@heroui/react";
import { Person, TrashBin } from "@gravity-ui/icons";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

type Friend = {
  id: string;
  email: string;
  friendshipId: string;
};

export default function FriendsModal() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);

  const state = useOverlayState();

  const handleSearchFriends = async () => {
    setErrorMessage("");
    setIsLoading(true);

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const { data: friendships, error: friendshipsError } = await supabase
      .from("friendships")
      .select("id, sender_id, receiver_id, status")
      .eq("status", "accepted")
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);

    if (friendshipsError || !friendships) {
      console.log("Error al traer amistades:", friendshipsError?.message);

      setErrorMessage("No se han podido cargar tus amigos");
      setIsLoading(false);
      return;
    }

    const friendsWithIds = friendships.map((row) => {
      if (row.sender_id === currentUser.id) {
        return {
          friendId: row.receiver_id,
          friendshipId: row.id,
        };
      } else {
        return {
          friendId: row.sender_id,
          friendshipId: row.id,
        };
      }
    });

    if (friendsWithIds.length === 0) {
      setFriends([]);
      setIsLoading(false);
      return;
    }

    const friendIds = friendsWithIds.map((friend) => friend.friendId);

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", friendIds);

    if (profilesError) {
      console.log("Error al traer perfiles:", profilesError.message);

      setErrorMessage("No se han podido cargar tus amigos");
      setIsLoading(false);
      return;
    }

    const friendsWithFriendshipId = profilesData.map((profile) => {
      const friendship = friendsWithIds.find(
        (friend) => friend.friendId === profile.id,
      );

      return {
        id: profile.id,
        email: profile.email,
        friendshipId: friendship!.friendshipId,
      };
    });

    setFriends(friendsWithFriendshipId);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!state.isOpen) return;

    const timeoutId = setTimeout(() => {
      void handleSearchFriends();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [state.isOpen]);

  const handleDeleteFriendship = async (friendshipId: string) => {
    setErrorMessage("");
    setIsLoading(true);

    const { error: deleteFriendshipError } = await supabase
      .from("Friendships")
      .delete()
      .eq("id", friendshipId);

    if (deleteFriendshipError) {
      console.log("Error eliminando amistad:", deleteFriendshipError.message);

      setErrorMessage("No se ha podido eliminar la amistad");
      setIsLoading(false);
      return;
    }

    // Volvemos a cargar los amigos para actualizar la interfaz
    await handleSearchFriends();

    setIsLoading(false);
  };

  return (
    <Modal>
      <Button
        size="sm"
        variant="ghost"
        onPress={state.open}
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 6px, rgba(0, 0, 0, 0.02) 0px 3px 12px, rgba(0, 0, 0, 0.01) 0px 8px 24px, rgba(0, 0, 0, 0.02) 0px 18px 40px, rgba(0, 0, 0, 0.02) 0px 40px 80px",
        }}
      >
        <Person className="size-4" />
        Amigos
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>Tus amigos</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="flex flex-col gap-4">
                {isLoading && (
                  <div className="flex justify-center py-6">
                    <Spinner size="sm" />
                  </div>
                )}

                {!isLoading && errorMessage && (
                  <p className="text-sm text-danger">{errorMessage}</p>
                )}

                {!isLoading && !errorMessage && friends.length === 0 && (
                  <p className="text-sm text-default-500">
                    Aún no tienes amigos añadidos
                  </p>
                )}

                {!isLoading && friends.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {friends.map((friend) => (
                      <li
                        key={friend.id}
                        className="flex flex-row items-center justify-between"
                      >
                        {friend.email}

                        <Button
                          isIconOnly
                          aria-label="Eliminar amigo"
                          variant="danger"
                          size="sm"
                          onPress={() =>
                            handleDeleteFriendship(friend.friendshipId)
                          }
                        >
                          <TrashBin />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer></Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
