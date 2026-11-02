import type { Board, Task, Column, Subtask } from "../types/kanban.types";
import { initialMockData } from "../data/mockData";

const LOCAL_STORAGE_KEY = "kanban_boards_data";

const getStoredBoards = (): Board[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMockData));
    return initialMockData;
  }
  return JSON.parse(data);
};

const saveBoardsToStorage = (boards: Board[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boards));
};

const generateId = () => crypto.randomUUID();

export const kanbanService = {
  getAllBoards: async (): Promise<Board[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredBoards());
      }, 500);
    });
  },

  createBoard: async (
    boardName: string,
    columnNames: string[],
  ): Promise<Board[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const boards = getStoredBoards();
        const newBoard: Board = {
          id: generateId(),
          name: boardName,
          columns: columnNames.map((name) => ({
            id: generateId(),
            name,
            tasks: [],
          })),
        };
        const updatedBoards = [...boards, newBoard];
        saveBoardsToStorage(updatedBoards);
        resolve(updatedBoards);
      }, 500);
    });
  },

  updateBoard: async (
    boardId: string,
    updatedData: { name?: string; columns?: { id?: string; name: string }[] },
  ): Promise<Board[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const boards = getStoredBoards();
        const updatedBoards = boards.map((board) => {
          if (board.id !== boardId) return board;

          const updatedColumns: Column[] = (
            updatedData.columns || board.columns
          ).map((column) => {
            const existingColumn = board.columns.find(
              (item) => item.id === column.id,
            );
            return {
              id: column.id || generateId(),
              name: column.name,
              // Keep tasks with columns that retain their IDs during board edits.
              tasks: existingColumn ? existingColumn.tasks : [],
            };
          });

          return {
            ...board,
            name: updatedData.name || board.name,
            columns: updatedColumns,
          };
        });

        saveBoardsToStorage(updatedBoards);
        resolve(updatedBoards);
      }, 500);
    });
  },

  deleteBoard: async (boardId: string): Promise<Board[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const boards = getStoredBoards();
        const updatedBoards = boards.filter((board) => board.id !== boardId);
        saveBoardsToStorage(updatedBoards);
        resolve(updatedBoards);
      }, 500);
    });
  },

  createTask: async (
    boardId: string,
    columnId: string,
    taskData: {
      title: string;
      description: string;
      subtasks: { title: string }[];
    },
  ): Promise<Board[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const boards = getStoredBoards();
        const newTask: Task = {
          id: generateId(),
          title: taskData.title,
          description: taskData.description,
          status: columnId,
          subtasks: taskData.subtasks.map((subtask) => ({
            id: generateId(),
            title: subtask.title,
            isCompleted: false,
          })),
        };

        const updatedBoards = boards.map((board) => {
          if (board.id !== boardId) return board;
          return {
            ...board,
            columns: board.columns.map((column) => {
              if (column.id !== columnId) return column;
              return { ...column, tasks: [...column.tasks, newTask] };
            }),
          };
        });

        saveBoardsToStorage(updatedBoards);
        resolve(updatedBoards);
      }, 500);
    });
  },

  updateTask: async (
    boardId: string,
    taskId: string,
    updatedData: {
      title: string;
      description: string;
      status: string;
      subtasks: Subtask[];
      targetIndex?: number;
    },
  ): Promise<Board[]> => {
    return new Promise((resolve, reject) => {
      try {
        const boards = getStoredBoards();
        const targetBoard = boards.find((board) => board.id === boardId);
        if (!targetBoard) throw new Error("The board could not be found.");

        const oldTask = targetBoard.columns
          .flatMap((column) => column.tasks)
          .find((task) => task.id === taskId);
        if (!oldTask) throw new Error("The task could not be found.");
        if (
          !targetBoard.columns.some(
            (column) => column.id === updatedData.status,
          )
        ) {
          throw new Error("The target column could not be found.");
        }

        const updatedTask: Task = {
          ...oldTask,
          title: updatedData.title,
          description: updatedData.description,
          status: updatedData.status,
          subtasks: updatedData.subtasks.map((subtask: any, index) => {
            const existingSubtask = oldTask.subtasks[index];
            return {
              // Preserve subtask IDs and completion state for existing entries.
              id:
                subtask.id ||
                (existingSubtask ? existingSubtask.id : generateId()),
              title: subtask.title,
              isCompleted:
                subtask.isCompleted !== undefined
                  ? subtask.isCompleted
                  : existingSubtask
                    ? existingSubtask.isCompleted
                    : false,
            };
          }),
        };

        const updatedBoards = boards.map((board) => {
          if (board.id !== boardId) return board;

          return {
            ...board,
            columns: board.columns.map((column) => {
              const filteredTasks = column.tasks.filter(
                (task) => task.id !== taskId,
              );

              if (column.id === updatedData.status) {
                const targetIndex = Math.max(
                  0,
                  Math.min(
                    updatedData.targetIndex ?? filteredTasks.length,
                    filteredTasks.length,
                  ),
                );
                return {
                  ...column,
                  tasks: [
                    ...filteredTasks.slice(0, targetIndex),
                    updatedTask,
                    ...filteredTasks.slice(targetIndex),
                  ],
                };
              }

              return { ...column, tasks: filteredTasks };
            }),
          };
        });

        saveBoardsToStorage(updatedBoards);
        resolve(updatedBoards);
      } catch (error) {
        reject(error);
      }
    });
  },

  deleteTask: async (boardId: string, taskId: string): Promise<Board[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const boards = getStoredBoards();
        const updatedBoards = boards.map((board) => {
          if (board.id !== boardId) return board;
          return {
            ...board,
            columns: board.columns.map((column) => ({
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            })),
          };
        });
        saveBoardsToStorage(updatedBoards);
        resolve(updatedBoards);
      }, 500);
    });
  },

  toggleSubtask: async (
    boardId: string,
    taskId: string,
    subtaskId: string,
  ): Promise<Board[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const boards = getStoredBoards();

        const updatedBoards = boards.map((board) => {
          if (board.id !== boardId) return board;

          return {
            ...board,
            columns: board.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((task) => {
                if (task.id !== taskId) return task;

                return {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, isCompleted: !subtask.isCompleted }
                      : subtask,
                  ),
                };
              }),
            })),
          };
        });

        saveBoardsToStorage(updatedBoards);
        resolve(updatedBoards);
      }, 50);
    });
  },
};
