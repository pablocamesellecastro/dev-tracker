"use client";

import { Avatar, Button, Dropdown, Header, Label } from "@heroui/react";
import { ArrowRightToSquare } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase/client";

interface UserMenuProps {
  email: string;
}

export default function UserMenu({ email }: UserMenuProps) {
  const t = useTranslations("LogoutButton");
  const router = useRouter();

  const initials = email.slice(0, 2).toUpperCase();

  const handleAction = async (key: React.Key) => {
    if (key === "logout") {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <Dropdown>
      <Button
        isIconOnly
        variant="ghost"
        aria-label={email}
        className="size-9 min-w-0 rounded-full p-0"
      >
        <Avatar size="sm">
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      </Button>

      <Dropdown.Popover>
        <Dropdown.Menu onAction={handleAction}>
          <Dropdown.Section>
            <Header className="max-w-56 truncate">{email}</Header>
            <Dropdown.Item id="logout" textValue={t("button")} variant="danger">
              <ArrowRightToSquare className="size-4" />
              <Label>{t("button")}</Label>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
