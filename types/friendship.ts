import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { User } from "./user";

export interface Friendship {
  readonly id: string;
  sender: User;
  receiver: User;
  status: string;
  created_at: Timestamp;
}
