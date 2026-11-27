"use client";

import { Avatar, Description, Label, ListBox, Surface } from "@heroui/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Friendships } from "@/hooks/useFriendships";
import { getCurrentUser } from "@/helpers/currentUser";
import { User } from "@/types/user";
import { Check } from "@gravity-ui/icons";
import type { Selection } from "@heroui/react";
import { getFriendships, projectMembers } from "@/lib/actions";
import { useParams } from "next/navigation";

interface SelectParticipantsProps {
  selected: Selection;
  setSelected: (selection: Selection) => void;
}

export default function SelectParticipants({
  selected,
  setSelected,
}: SelectParticipantsProps) {
  ///_____________________________________________________
  const [friends, setFriends] = useState<User[]>([]);
  const params = useParams();
  const project_id = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      const friendshipsResult = await getFriendships();
      const membersResult = await projectMembers(project_id);

      const memberIdsInProject = new Set(
        membersResult?.membersData.map((member) => member.user_id),
      );

      const friendsNotInProject = friendshipsResult.friendships.filter(
        (friend) => !memberIdsInProject.has(friend.id),
      );

      setFriends(friendsNotInProject);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <Surface className=" rounded-3xl shadow-surface">
        <ListBox
          aria-label="Users"
          selectedKeys={selected}
          selectionMode="multiple"
          onSelectionChange={setSelected}
        >
          {friends.map((friend) => (
            <ListBox.Item
              key={friend.id}
              textValue={friend.name}
              id={friend.id}
            >
              <Avatar size="sm">
                <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                <Avatar.Fallback>{friend.initial}</Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col">
                <Label>{friend.email}</Label>
              </div>
              <ListBox.ItemIndicator>
                {({ isSelected }) =>
                  isSelected ? (
                    <Check className="size-4 text-accent-soft-foreground" />
                  ) : null
                }
              </ListBox.ItemIndicator>
            </ListBox.Item>
          ))}
        </ListBox>
      </Surface>
    </div>
  );
}
