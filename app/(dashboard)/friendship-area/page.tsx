"use client";
import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { supabase } from "@/lib/supabase/client";

export default function Friendships() {
  const [user, setUser] = useState("");
  const [isLoadinng, setIsLoading] = useState(false);

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    console.log("buscando...");

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user)
      .single();

    if (data) {
      console.log("usuario encontrado");
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
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <Button type="submit">invite</Button>
      </form>
      
    </div>
  );
}
