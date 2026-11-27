import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return console.error("usuario no existe");
    } else {
      router.push("/");
      return console.error("usuario logueado:", data.user.email);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    setLoading,
    errorMsg,
    setErrorMsg,
    handleLogin,
  };
};
