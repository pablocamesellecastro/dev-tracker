import Kanban from "@/components/kanban/projectCard";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <p>project id: {params.id}</p>
      <Kanban></Kanban>
    </div>
  );
}
