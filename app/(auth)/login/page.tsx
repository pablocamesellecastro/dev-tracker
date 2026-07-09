"use client";
import { Button } from "@heroui/react";
import { useAuth } from "@/hooks/Auth";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    setLoading,
    errorMsg,
    setErrorMsg,
    handleLogin,
  } = useAuth();

  return (
    <div className="">
      <form
        className="flex flex-col items-center gap-5 p-5"
        onSubmit={handleLogin}
      >
        <div>
          <input
            type="text"
            title="email"
            className="bg-white text-black"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            title="password"
            className="bg-white text-black"
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">ENTER</Button>
      </form>
    </div>
  );
}
