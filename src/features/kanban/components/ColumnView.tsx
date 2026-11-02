import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./TaskCard";
import type { Column, Task } from "../../../types/kanban.types";

interface ColumnViewProps {
  column: Column;
  dotColor: string;
  onTaskClick: (taskId: string) => void;
}

const SortableTaskItem: React.FC<{
  task: Task;
  onTaskClick: (taskId: string) => void;
}> = ({ task, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1)",
    // Hide the sortable item while its duplicate is displayed in the drag overlay.
    opacity: isDragging ? 0 : 1,
    cursor: "grab",
    outline: "none",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging) onTaskClick(task.id);
      }}
    >
      <TaskCard task={task} onClick={() => {}} />
    </div>
  );
};

export const ColumnView: React.FC<ColumnViewProps> = ({
  column,
  dotColor,
  onTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="w-70 shrink-0 flex flex-col pb-4">
      <div className="flex items-center gap-3 mb-6 shrink-0 select-none">
        <span className={`w-3 h-3 rounded-full ${dotColor}`} />
        <h2 className="text-xs font-bold tracking-[2.4px] text-text-muted-light dark:text-text-muted-dark uppercase truncate">
          {column.name} ({column.tasks?.length || 0})
        </h2>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 pr-1 pb-6 space-y-5 rounded-xl transition-colors duration-200 min-h-25
          ${isOver ? "bg-primary/10 border border-dashed border-primary/50" : "bg-transparent"}`}
      >
        <SortableContext
          items={column.tasks?.map((task) => task.id) || []}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks && column.tasks.length > 0
            ? column.tasks.map((task) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onTaskClick={onTaskClick}
                />
              ))
            : !isOver && (
                <div className="h-32 rounded-xl border-2 border-dashed border-line-light/40 dark:border-line-dark/40 flex items-center justify-center text-xs font-medium text-text-muted-light dark:text-text-muted-dark select-none">
                  Empty Column
                </div>
              )}
        </SortableContext>
      </div>
    </div>
  );
};
