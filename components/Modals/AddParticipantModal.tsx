"use client";

import { useRouter } from "next/navigation";
import { ModalFooter, TextArea, useOverlayState } from "@heroui/react";
import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import type { FormEvent } from "react";
import { Modal } from "@heroui/react";
import { useState } from "react";
import { Selection } from "@heroui/react";
import { Input } from "@heroui/react";
import { Select } from "@heroui/react";
import { Label } from "@heroui/react";
import { ListBox } from "@heroui/react";
import { supabase } from "@/lib/supabase/client";
import SelectParticipants from "../SelectParticipants";
import { getCurrentUser } from "@/helpers/currentUser";
import { addParticipants } from "@/lib/actions";
import { useEffect } from "react";

interface AddParticipantModalProps {
  projectId: string;
}

export default function AddParticipantModal({
  projectId,
}: AddParticipantModalProps) {
  const state = useOverlayState();
  const [taskName, setTaskName] = useState("");
  const [taskPriority, setTaskPriority] = useState<string>("");
  const [selected, setSelected] = useState<Selection>(new Set([]));
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    async function cargarCurrentUserId() {
      const { currentUserId } = await getCurrentUser();
      setCurrentUserId(currentUserId);
    }
    cargarCurrentUserId();
  }, []);

  const handleAddParticipants = async () => {
    const ids = selected === "all" ? [] : (Array.from(selected) as string[]);
    addParticipants(projectId, ids);
  };

  return (
    <>
      <Button
        type="submit"
        size="sm"
        onPress={state.open}
        className="gradient-border relative z-0 rounded-full bg-linear-to-t from-neutral-100 to-white px-10 py-3 font-[450] text-neutral-800 shadow-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] [--gradient-border-width:1.5px] [--gradient-border:linear-gradient(315deg,#e5e5e5_0%,#fafafa_50%,#c4c4c4_100%)] hover:from-white hover:to-neutral-50 hover:brightness-105 active:scale-95 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-800/80 dark:text-neutral-100 dark:[--gradient-border:linear-gradient(315deg,#404040_0%,#262626_50%,#525252_100%)] dark:hover:from-neutral-800 dark:hover:via-neutral-800 dark:hover:to-neutral-900/90"
        variant="ghost"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 6px, rgba(0, 0, 0, 0.02) 0px 3px 12px, rgba(0, 0, 0, 0.01) 0px 8px 24px, rgba(0, 0, 0, 0.02) 0px 18px 40px, rgba(0, 0, 0, 0.02) 0px 40px 80px",
        }}
      >
        <Plus></Plus>Add Participant
      </Button>

      <Modal.Backdrop
        className="backdrop-blur-sm"
        isOpen={state.isOpen}
        onOpenChange={state.setOpen}
      >
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>Añadir participantes</Modal.Header>
            <Modal.Body>
              <Modal.Heading className="">
                <SelectParticipants
                  selected={selected}
                  setSelected={setSelected}
                ></SelectParticipants>
              </Modal.Heading>
            </Modal.Body>
            <ModalFooter>
              <Button slot="close" variant="secondary">
                Cancelar
              </Button>
              <Button
                type="submit"
                form="add-task-form"
                variant="primary"
                onPress={handleAddParticipants}
              >
                Añadir participantes
              </Button>
            </ModalFooter>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
