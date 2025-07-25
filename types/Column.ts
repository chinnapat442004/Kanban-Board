import type { Task } from './Task';

export type Column = {
  id: number;
  name: string;
  tasks: Task[];
};
