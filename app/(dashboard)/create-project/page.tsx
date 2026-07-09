"use client";
import { createProject } from "@/lib/actions";
import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoadinng, setIsLoading] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("creando proyecto");

    const { data: user } = await supabase.auth.getUser();
    console.log(user);

    try {
      if (!user) {
        console.log("usuario no loqueado");
        return;
      }

      const result = await createProject(projectName, description);

      if (result) {
        console.log("¡Proyecto creado con éxito!");
        setProjectName("");
        setDescription("");
      } else {
        alert("Error al guardar el proyecto en la base de datos.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-content1/40">
      <form
        className="flex flex-col items-center gap-5 p-5"
        onSubmit={handleCreateProject}
      >
        <input
          type="text"
          placeholder="project name"
          className=" text-black bg-white"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="description"
          className=" text-black bg-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <Button type="submit">Create Project</Button>
      </form>
    </main>
  );
}
