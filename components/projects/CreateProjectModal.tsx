"use client";

import { createProject } from "@/lib/actions";
import {
  Button,
  Input,
  TextArea,
  TextField,
  Label,
  Modal,
  useOverlayState,
} from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import SelectParticipants from "./SelectParticipants";
import { Selection } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function CreateProjectModal() {
  const t = useTranslations("CreateProjectModal");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const state = useOverlayState();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Selection>(new Set([]));

  console.log(selected);

  const handleCreateProject = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log("Usuario no logueado");
        return;
      }

      ///________________________________________________________________________
      ///consulta crear proyecto

      const result = await createProject(projectName, description, selected);

      ///________________________________________________________________________

      if (result) {
        setProjectName("");
        setDescription("");
        state.close();
        router.refresh();
      } else {
        alert(t("errors.saveFailed"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={state.open}
        className="gradient-border relative z-0 rounded-full bg-linear-to-t from-neutral-100 to-white px-10 py-3 font-[450] text-neutral-800 shadow-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] [--gradient-border-width:1.5px] [--gradient-border:linear-gradient(315deg,#e5e5e5_0%,#fafafa_50%,#c4c4c4_100%)] hover:from-white hover:to-neutral-50 hover:brightness-105 active:scale-95 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-800/80 dark:text-neutral-100 dark:[--gradient-border:linear-gradient(315deg,#404040_0%,#262626_50%,#525252_100%)] dark:hover:from-neutral-800 dark:hover:via-neutral-800 dark:hover:to-neutral-900/90"
        variant="ghost"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 6px, rgba(0, 0, 0, 0.02) 0px 3px 12px, rgba(0, 0, 0, 0.01) 0px 8px 24px, rgba(0, 0, 0, 0.02) 0px 18px 40px, rgba(0, 0, 0, 0.02) 0px 40px 80px",
        }}
      >
        <Plus className="size-4" />
        {t("button")}
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t("title")}</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-4">
              <TextField
                value={projectName}
                onChange={setProjectName}
                isRequired
              >
                <Label>{t("nameLabel")}</Label>
                <Input className="" />
              </TextField>

              <TextField value={description} onChange={setDescription}>
                <Label>{t("descriptionLabel")}</Label>
                <TextArea />
              </TextField>

              <div>
                <Label>{t("participantsLabel")}</Label>
                <SelectParticipants
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button slot="close" variant="secondary">
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                form="create-project-form"
                variant="primary"
                isPending={isLoading}
                isDisabled={!projectName.trim()}
                onPress={handleCreateProject}
              >
                {t("submit")}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
