import type { Board } from "../../../types/kanban.types";

/** Apply a task move to cached board data without mutating existing objects. */
export const moveTaskOptimistic = (
  boards: Board[] | undefined,
  boardId: string,
  taskId: string,
  newStatus: string,
  targetIndex: number,
): Board[] | undefined => {
  return boards?.map((board) => {
    if (board.id !== boardId) return board;

    let movedTask: Board["columns"][number]["tasks"][number] | undefined;

    const columnsWithoutTask = board.columns.map((column) => {
      const task = column.tasks.find((item) => item.id === taskId);
      if (task) movedTask = { ...task, status: newStatus };

      return {
        ...column,
        tasks: column.tasks.filter((item) => item.id !== taskId),
      };
    });

    const targetColumn = columnsWithoutTask.find(
      (column) => column.id === newStatus,
    );
    if (!movedTask || !targetColumn) return board;

    const taskToMove = movedTask;
    const insertionIndex = Math.max(
      0,
      Math.min(targetIndex, targetColumn.tasks.length),
    );

    return {
      ...board,
      columns: columnsWithoutTask.map((column) =>
        column.id === newStatus
          ? {
              ...column,
              tasks: [
                ...column.tasks.slice(0, insertionIndex),
                taskToMove,
                ...column.tasks.slice(insertionIndex),
              ],
            }
          : column,
      ),
    };
  });
};
