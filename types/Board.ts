import type { Column } from './Column';

export interface Board {
  id: number;
  name: string;
  ownerId: number;
  members: number[];
  columns: Column[];
}
