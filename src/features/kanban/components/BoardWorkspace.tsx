import { useState } from "react";
import {
  DndContext,
  closestCorners,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ColumnView } from "./ColumnView";
import { TaskCard } from "./TaskCard";
import type { Board, Task } from "../../../types/kanban.types";
import { useKanbanMutations } from "../../../hooks/useKanban";

interface BoardWorkspaceProps {
  board: Board;
  onTaskClick: (boardId: string, taskId: string) => void;
  onAddNewColumn: () => void;
}

export const BoardWorkspace: React.FC<BoardWorkspaceProps> = ({
  board,
  onTaskClick,
  onAddNewColumn,
}) => {
  const { moveTask } = useKanbanMutations();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dragError, setDragError] = useState<string | null>(null);

  const getColumnDotColor = (index: number) => {
    const colors = [
      "bg-column-blue",
      "bg-column-purple",
      "bg-column-green",
      "bg-column-orange",
    ];
    return colors[index % colors.length];
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args).filter(
      (collision) => collision.id !== args.active.id,
    );

    if (pointerCollisions.length > 0) {
      // Prefer task hits so drops reorder tasks instead of targeting the column beneath them.
      const taskIds = new Set(
        board.columns.flatMap((column) => column.tasks.map((task) => task.id)),
      );
      const taskCollision = pointerCollisions.find((collision) =>
        taskIds.has(String(collision.id)),
      );
      return taskCollision ? [taskCollision] : pointerCollisions;
    }

    return args.pointerCoordinates ? [] : closestCorners(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDragError(null);
    const task = board.columns
      .flatMap((column) => column.tasks)
      .find((item) => item.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);
    const sourceColumn = board.columns.find((column) =>
      column.tasks.some((task) => task.id === taskId),
    );
    const targetColumn = board.columns.find(
      (column) =>
        column.id === overId || column.tasks.some((task) => task.id === overId),
    );

    if (!sourceColumn || !targetColumn || overId === taskId) return;

    const sourceIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === taskId,
    );
    const targetTasks = targetColumn.tasks.filter((task) => task.id !== taskId);
    const overTaskIndex = targetTasks.findIndex((task) => task.id === overId);
    const targetIndex =
      overTaskIndex === -1 ? targetTasks.length : overTaskIndex;

    if (sourceColumn.id === targetColumn.id && sourceIndex === targetIndex) {
      return;
    }

    moveTask.mutate(
      { boardId: board.id, taskId, status: targetColumn.id, targetIndex },
      {
        onError: () =>
          setDragError(
            "Unable to save the task move. The task was returned to its previous position.",
          ),
      },
    );
  };

  if (!board.columns || board.columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] text-center p-6 select-none">
        <p className="text-text-muted-light dark:text-text-muted-dark font-bold text-lg mb-6">
          This board is empty. Create a new column to get started.
        </p>
        <button
          onClick={onAddNewColumn}
          className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-full text-sm transition-all cursor-pointer shadow-sm"
        >
          + Add New Column
        </button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="h-full overflow-x-auto overflow-y-auto px-6 py-6 flex gap-6 items-start custom-scrollbar">
        {board.columns.map((column, index) => (
          <ColumnView
            key={column.id}
            column={column}
            dotColor={getColumnDotColor(index)}
            onTaskClick={(taskId) => onTaskClick(board.id, taskId)}
          />
        ))}

        <button
          onClick={onAddNewColumn}
          className="w-70 shrink-0 h-[calc(100vh-210px)] mt-9 bg-linear-to-b from-line-light/50 to-line-light/10 dark:from-card-dark/50 dark:to-card-dark/5 rounded-xl flex items-center justify-center text-base font-bold text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20 select-none"
        >
          + New Column
        </button>
      </div>

      {dragError && (
        <p className="px-6 pb-3 text-sm font-medium text-red" role="alert">
          {dragError}
        </p>
      )}

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="w-70 rotate-2 scale-105 shadow-2xl">
            <TaskCard task={activeTask} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
