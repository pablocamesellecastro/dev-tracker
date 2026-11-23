"use client";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const t = useTranslations("LoginPage");

  const { email, setEmail, password, setPassword, handleLogin } = useAuth();

  return (
    <div className="">
      <form
        className="flex flex-col items-center gap-5 p-5"
        onSubmit={handleLogin}
      >
        <div>
          <input
            type="text"
            title={t("email")}
            className="bg-white text-black"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            title={t("password")}
            className="bg-white text-black"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">{t("submit")}</Button>
      </form>
    </div>
  );
}
