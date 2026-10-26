"use client";

import { Avatar, Description, Label, ListBox, Surface } from "@heroui/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Friendships } from "@/hooks/useFriendships";
import { getCurrentUser } from "@/helpers/currentUser";
import { User } from "@/types/user";
import { Check } from "@gravity-ui/icons";
import type { Selection } from "@heroui/react";

interface SelectParticipantsProps {
  selected: Selection;
  setSelected: (selection: Selection) => void;
}

export default function SelectParticipants({
  selected,
  setSelected,
}: SelectParticipantsProps) {
  ///_____________________________________________________
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Friendships();

      setData(result.friendships);
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
          {data.map((friend) => (
            <ListBox.Item
              key={friend.id}
              textValue={friend.name}
              id={friend.id}
            >
              <Avatar size="sm">
                <Avatar.Image
                  alt="Bob"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                />
                <Avatar.Fallback>{friend.initial}</Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col">
                <Label>{friend.email}</Label>
                <Description>{friend.email}</Description>
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
