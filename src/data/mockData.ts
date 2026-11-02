import type { Board } from "../types/kanban.types";

export const initialMockData: Board[] = [
  {
    id: "board-1",
    name: "Platform Launch",
    columns: [
      {
        id: "col-todo",
        name: "Todo",
        tasks: [
          {
            id: "task-1",
            title: "Build UI for onboarding flow",
            description:
              "Sign up page, welcome screen, and profile setup steps.",
            status: "col-todo",
            subtasks: [
              { id: "sub-1", title: "Design mockups", isCompleted: true },
              {
                id: "sub-2",
                title: "Integrate Tailwind styles",
                isCompleted: false,
              },
              { id: "sub-3", title: "Add form validation", isCompleted: false },
            ],
          },
          {
            id: "task-2",
            title: "Fix dark mode contrast issues",
            description:
              "Some secondary texts are hard to read against dark backgrounds.",
            status: "col-todo",
            subtasks: [
              {
                id: "sub-4",
                title: "Review contrast ratio",
                isCompleted: true,
              },
              {
                id: "sub-5",
                title: "Update color palette variables",
                isCompleted: true,
              },
            ],
          },
        ],
      },
      {
        id: "col-doing",
        name: "Doing",
        tasks: [
          {
            id: "task-3",
            title: "Integrate TanStack Query",
            description: "Set up cache, mutations, and query client provider.",
            status: "col-doing",
            subtasks: [
              {
                id: "sub-6",
                title: "Configure cache times",
                isCompleted: true,
              },
              {
                id: "sub-7",
                title: "Test LocalStorage synchronization",
                isCompleted: false,
              },
            ],
          },
        ],
      },
      {
        id: "col-done",
        name: "Done",
        tasks: [
          {
            id: "task-4",
            title: "Setup Vite project with TS",
            description:
              "Initialize project environment and strict mode flags.",
            status: "col-done",
            subtasks: [
              { id: "sub-8", title: "Install dependencies", isCompleted: true },
              { id: "sub-9", title: "Verify build steps", isCompleted: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "board-2",
    name: "Marketing Plan",
    columns: [
      {
        id: "col-m1",
        name: "Research",
        tasks: [
          {
            id: "task-5",
            title: "Competitor analysis report",
            description: "Gather pricing structures and feature matrices.",
            status: "col-m1",
            subtasks: [],
          },
        ],
      },
    ],
  },
];
