"use client";

import { useState } from "react";
import { Selection } from "@heroui/react";
import SelectParticipants from "@/components/SelectParticipants";

export default function CreateTaskForm() {
  const [selected, setSelected] = useState<Selection>(new Set([]));

  return (
    <form>
      <input type="text" className="bg-amber-100" placeholder="tarea" />

      <input type="text" className="bg-amber-100" placeholder="estado" />

      <SelectParticipants selected={selected} setSelected={setSelected} />
    </form>
  );
}
