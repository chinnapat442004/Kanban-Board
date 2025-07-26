import type { Board } from '~/types/Board';

export const mockBoards: Board[] = [
  {
    id: 1,
    name: 'Project 1',
    ownerId: 1,
    members: [1, 2],
    columns: [
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
    ],
  },
  {
    id: 2,
    name: 'Project 2',
    ownerId: 2,
    members: [1],
    columns: [
      {
        id: 1,
        name: 'In Progress',
        tasks: [{ id: 2, title: 'Setup Database', tags: ['DB'] }],
      },
    ],
  },
];
