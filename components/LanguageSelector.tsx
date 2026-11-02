"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/actions";
import { Label, ListBox, Select } from "@heroui/react";

export default function LanguageSelector() {
  const router = useRouter();

  const change = async (locale: "es" | "en") => {
    await setLocale(locale);
    router.refresh();
  };

  return (
    <Select className="w-auto" placeholder="Language">
      <Select.Trigger className="bg-accent-hoverx">
        <Select.Value />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item
            id="florida"
            textValue="Florida"
            onPress={() => change("en")}
          >
            English
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item
            id="delaware"
            textValue="Delaware"
            onPress={() => change("es")}
          >
            Español
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
