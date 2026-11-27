"use client";

import { Button, Dropdown, Label } from "@heroui/react";
import { Globe } from "@gravity-ui/icons";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/actions";

const languages = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
] as const;

export default function LanguageSelector() {
  const router = useRouter();
  const locale = useLocale();

  const handleAction = async (key: React.Key) => {
    await setLocale(key as "es" | "en");
    router.refresh();
  };

  return (
    <Dropdown>
      <Button
        size="sm"
        variant="ghost"
        aria-label="Language"
        className="gap-1.5 text-default-500 hover:text-foreground"
      >
        <Globe className="size-4" />
        <span className="text-xs font-medium uppercase">{locale}</span>
      </Button>

      <Dropdown.Popover>
        <Dropdown.Menu onAction={handleAction}>
          {languages.map((lang) => (
            <Dropdown.Item key={lang.id} id={lang.id} textValue={lang.label}>
              <Label>{lang.label}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
