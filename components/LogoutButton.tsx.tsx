"use client";

import { Button } from "@heroui/react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return <Button onClick={handleLogOut}>cerrar sesion</Button>;
}
