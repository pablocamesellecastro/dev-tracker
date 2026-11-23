"use client";

import { Button, Modal } from "@heroui/react";
import { useTranslations } from "next-intl";

interface TaskModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  name: string;
  description?: string | null;
  priority?: string | null;
}

export default function TaskModal({
  isOpen,
  onOpenChange,
  name,
  description,
  priority,
}: TaskModalProps) {
  const t = useTranslations("TaskModal");
  const tCommon = useTranslations("Common");

  return (
    <Modal.Backdrop
      className="backdrop-blur-sm"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{name}</Modal.Heading>
          </Modal.Header>

          <Modal.Body className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-default-400">{t("priority")}</p>
              <p className="text-sm">
                {priority ? tCommon(`priority.${priority}`) : t("noPriority")}
              </p>
            </div>

            <div>
              <p className="text-xs text-default-400">{t("description")}</p>
              <p className="text-sm">{description || t("noDescription")}</p>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button slot="close" variant="secondary">
              {t("close")}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
