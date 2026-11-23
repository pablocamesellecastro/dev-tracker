"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase/client";

export default function Friendships() {
  const t = useTranslations("InviteModal");

  const [searchEmail, setSearchEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (currentUser?.email === searchEmail) {
      setErrorMessage(t("errors.selfInvite"));
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", searchEmail)
      .single();

    if (data) {
      const { error: insertError } = await supabase.from("friendships").insert({
        sender_id: currentUser?.id,
        receiver_id: data.id,
        status: "pending",
      });

      if (insertError) {
        console.log("Error al crear invitación:", insertError.message);
        setErrorMessage(t("errors.inviteFailed"));
      }
    } else {
      console.log(error);
      setErrorMessage(t("errors.userNotFound"));
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col p-10">
      <form
        className="flex flex-col items-center gap-5 p-5"
        onSubmit={handleSearchUser}
      >
        <input
          type="text"
          className="bg-amber-50 text-black"
          placeholder={t("emailPlaceholder")}
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <Button type="submit" isDisabled={isLoading}>
          {t("submit")}
        </Button>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </form>
    </div>
  );
}
