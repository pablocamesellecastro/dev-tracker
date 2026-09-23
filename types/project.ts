import { Task } from "./task";

export interface Project {
  readonly id: string;
  name: string;
  description: string;
  tasks?: Task[];
  owner_id?: string;
}

export type MemberRow = {
  Projects: Project;
};
