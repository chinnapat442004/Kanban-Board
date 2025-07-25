import type { Column } from '~/types/Column';

export const mockColumns: Column[] = [
  {
    id: 1,
    name: 'To Do',
    tasks: [{ id: 1, title: 'Design Homepage', tags: ['UI', 'UX'] }],
  },
  {
    id: 2,
    name: 'In Progress',
    tasks: [
      { id: 2, title: 'Setup Database', tags: ['DB'] },
      { id: 3, title: 'Create API Endpoints', tags: ['Backend'] },
    ],
  },
];
