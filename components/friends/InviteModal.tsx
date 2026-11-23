"use client";

import {
  Button,
  Input,
  Label,
  Modal,
  Spinner,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { PersonPlus } from "@gravity-ui/icons";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function InviteModal() {
  const t = useTranslations("InviteModal");
  const tCommon = useTranslations("Common");
  const [searchEmail, setSearchEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const state = useOverlayState();

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

    if (error || !data) {
      setErrorMessage(t("errors.userNotFound"));
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("friendships").insert({
      senderId: currentUser?.id,
      receiverId: data.id,
      status: "pending",
    });

    setIsLoading(false);

    if (insertError) {
      console.log("Error al crear invitación:", insertError.message);
      setErrorMessage(t("errors.inviteFailed"));
      return;
    }

    setSearchEmail("");
    state.close();
  };

  return (
    <div className="">
      <Modal>
        <Button
          variant="ghost"
          size="sm"
          onPress={state.open}
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.02) 0px 1px 6px, rgba(0, 0, 0, 0.02) 0px 3px 12px, rgba(0, 0, 0, 0.01) 0px 8px 24px, rgba(0, 0, 0, 0.02) 0px 18px 40px, rgba(0, 0, 0, 0.02) 0px 40px 80px",
          }}
        >
          <PersonPlus className="size-4" />
          {t("button")}
        </Button>

        <Modal.Backdrop
          isOpen={state.isOpen}
          onOpenChange={state.setOpen}
          className="backdrop-blur-sm"
        >
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>{t("title")}</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <form
                  id="invite-form"
                  className="flex flex-col gap-4"
                  onSubmit={handleSearchUser}
                >
                  <TextField
                    name="email"
                    type="email"
                    isRequired
                    isInvalid={!!errorMessage}
                  >
                    <Label>{t("emailLabel")}</Label>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                    />
                  </TextField>

                  {errorMessage && (
                    <p className="text-sm text-danger">{errorMessage}</p>
                  )}
                </form>
              </Modal.Body>

              <Modal.Footer>
                <Button slot="close" variant="secondary">
                  {tCommon("cancel")}
                </Button>
                <Button type="submit" form="invite-form" isPending={isLoading}>
                  {isLoading && <Spinner size="sm" />}
                  {t("submit")}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
