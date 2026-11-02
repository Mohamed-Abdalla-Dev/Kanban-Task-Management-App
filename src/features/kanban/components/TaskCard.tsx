import type { Task } from "../../../types/kanban.types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  isDragging,
}) => {
  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      onClick={onClick}
      className={`w-full bg-card-light dark:bg-card-dark rounded-xl px-4 py-6 shadow-task-card cursor-grab active:cursor-grabbing group hover:scale-[1.01] border border-transparent hover:border-primary/20 transition-all duration-200 text-left select-none ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <h3 className="text-sm font-bold text-text-main-light dark:text-text-main-dark group-hover:text-primary dark:group-hover:text-primary-hover transition-colors duration-200 mb-2 line-clamp-2 leading-snug">
        {task.title}
      </h3>
      <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark tracking-wide">
        {completedSubtasks} of {totalSubtasks} subtasks
      </p>
    </div>
  );
};
