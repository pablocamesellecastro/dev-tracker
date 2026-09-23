import { supabase } from "@/lib/supabase/client";
import { getCurrentUser } from "@/helpers/currentUser";
import { Friendship } from "@/types/friendship";
import { User } from "@/types/user";
import { useState } from "react";

export async function Friendships() {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser.user?.id;

  if (!currentUserId) return { friendships: [] };

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
      id,
      status,
      sender:profiles!sender_id(id, email),
      receiver:profiles!receiver_id(id, email)
    `,
    )
    .eq("status", "accepted")
    .or(`sender_id.eq.${currentUserId}, receiver_id.eq.${currentUserId}`);

  if (error) {
    console.error("Ha habido un error:", error.message);
    return { friendships: [] };
  }

  ///________________________________________________________________________________

  const rows = data as unknown as Friendship[];

  const friendshipsList: User[] = rows.map((row) => {
    const isSender = row.sender.id === currentUserId;
    const friendData = isSender ? row.receiver : row.sender;
    const friendInitial = friendData.email.charAt(0).toUpperCase();

    return {
      id: friendData.id,
      email: friendData.email,
      initial: friendInitial,
      name: friendData.email,
    };
  });

  return { friendships: friendshipsList };
}
