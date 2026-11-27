"use client";
import { Button, Card, Input, Label, Spinner, TextField } from "@heroui/react";
import { LayoutColumns } from "@gravity-ui/icons";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const t = useTranslations("LoginPage");

  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    loading,
    errorMsg,
  } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <Card className="w-full border border-default-200">
          <Card.Content className="p-6 sm:p-8">
            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {t("submit")}
              </h1>

              <div className="flex flex-col gap-4">
                <TextField
                  name="email"
                  type="email"
                  isRequired
                  isInvalid={!!errorMsg}
                  value={email}
                  onChange={setEmail}
                >
                  <Label>{t("email")}</Label>
                  <Input autoComplete="email" placeholder="tu@correo.com" />
                </TextField>

                <TextField
                  name="password"
                  type="password"
                  isRequired
                  isInvalid={!!errorMsg}
                  value={password}
                  onChange={setPassword}
                >
                  <Label>{t("password")}</Label>
                  <Input autoComplete="current-password" />
                </TextField>
              </div>

              {errorMsg && (
                <p role="alert" className="text-sm text-danger">
                  {errorMsg}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isPending={loading}
              >
                {loading && <Spinner size="sm" />}
                {t("submit")}
              </Button>
            </form>
          </Card.Content>
        </Card>
      </div>
    </main>
  );
}
