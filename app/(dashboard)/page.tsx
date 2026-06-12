import Image from "next/image";
import Kanban from "@/components/kanban/kanbanComponent";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <header className=""></header>

        <h1 className="flex justify-center text-2xl p-20">DASHBOARD</h1>

        <div className="flex flex-row justify-between">
          <span>Projects</span>
          <span>Create new project</span>
        </div>

        <div className="flex justify-between">
          <Kanban></Kanban>
          <Kanban></Kanban>
          <Kanban></Kanban>
        </div>
      </main>
    </div>
  );
}
