import { Task } from "./task";

export interface Project {
  readonly id: string;
  name: string;
  description: string;
  tasks?: Task[];
  ownerId?: string;
}
