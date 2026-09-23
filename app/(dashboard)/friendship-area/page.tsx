"use client";
import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { supabase } from "@/lib/supabase/client";

export default function Friendships() {
  const [searchEmail, setSearchEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadinng, setIsLoading] = useState(false);

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    console.log("buscando...");

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", searchEmail)
      .single();

    if (currentUser?.email === searchEmail) {
      setErrorMessage("No puedes invitarte a ti mismo");
      console.log("No puedes invitarte a ti mismo");
      setIsLoading(false);
      return;
    }

    if (data) {
      console.log("usuario encontrado");

      const { data: insertData, error: insertError } = await supabase
        .from("friendships")
        .insert({
          senderId: currentUser?.id,
          receiverId: data.id,
          status: "pending",
        });

      if (insertError) {
        console.log("Error al crear invitación:", insertError.message);
        setErrorMessage("Algo ha salido mal invitando al usuario");
      } else {
        console.log("usuario invitado");
      }

      setIsLoading(false);
    } else {
      console.log(error);
    }
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
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <Button type="submit">invite</Button>
      </form>
    </div>
  );
}
