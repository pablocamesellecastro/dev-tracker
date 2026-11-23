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
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

interface AddTaskModalProps {
  projectId: string;
}

export default function AddTaskModal({ projectId }: AddTaskModalProps) {
  const t = useTranslations("AddTaskModal");
  const tCommon = useTranslations("Common");
  const state = useOverlayState();
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<string>("");

  const router = useRouter();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const { data: addTaskData, error: addTaskError } = await supabase
      .from("tasks")
      .insert({
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        project_id: projectId,
      })
      .select("id");

    if (addTaskError) {
      console.log(addTaskError.message);
    } else {
      setIsLoading(false);
      state.close();
      router.refresh();
      return addTaskData.length;
    }

    setIsLoading(false);
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
        <Plus></Plus>
        {t("button")}
      </Button>

      <Modal.Backdrop
        className="backdrop-blur-sm"
        isOpen={state.isOpen}
        onOpenChange={state.setOpen}
      >
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>{t("title")}</Modal.Header>
            <Modal.Body>
              <Modal.Heading className="">
                <form id="add-task-form" onSubmit={handleAddTask}>
                  <div className="pt-3 pb-3">
                    <Input
                      className="w-full"
                      aria-label={t("nameAria")}
                      placeholder={t("namePlaceholder")}
                      required
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                  </div>

                  <div className="pt-3 pb-3">
                    <TextArea
                      className="w-full"
                      aria-label={t("descriptionAria")}
                      placeholder={t("descriptionPlaceholder")}
                      required
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </div>
                  <Select
                    className="w-full"
                    placeholder={t("priorityPlaceholder")}
                    defaultValue="high"
                    value={taskPriority}
                    onChange={(value) => {
                      if (typeof value === "string") {
                        setTaskPriority(value);
                      }
                    }}
                  >
                    <Label>{t("priorityLabel")}</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item
                          id="high"
                          textValue="high"
                          className="text-red-600"
                        >
                          {tCommon("priority.high")}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item
                          id="medium"
                          textValue="medium"
                          className="text-orange-400"
                        >
                          {tCommon("priority.medium")}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item
                          id="low"
                          textValue="low"
                          className="text-green-600"
                        >
                          {tCommon("priority.low")}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </form>
              </Modal.Heading>
            </Modal.Body>
            <ModalFooter>
              <Button slot="close" variant="secondary">
                {tCommon("cancel")}
              </Button>
              <Button type="submit" form="add-task-form" variant="primary">
                {t("submit")}
              </Button>
            </ModalFooter>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
