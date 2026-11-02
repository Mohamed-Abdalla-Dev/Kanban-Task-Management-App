import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { useKanbanMutations, useGetBoards } from "../../../hooks/useKanban";
import { DropdownMenu } from "../components/DropdownMenu";
import { TaskFormModal } from "./TaskFormModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ChevronDown } from "lucide-react";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  taskId: string;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  boardId,
  taskId,
}) => {
  const { data: boards } = useGetBoards();
  const { deleteTask, toggleSubtask, updateTask } = useKanbanMutations();

  const [isOpenSettings, setIsOpenSetting] = useState(false);
  const [isOpenEditTask, setIsOpenEditTask] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);

  // Resolve by ID so the modal always reflects the latest cached task data.
  const currentBoard = boards?.find((b) => b.id === boardId);

  let liveTask = null;
  if (currentBoard) {
    for (const col of currentBoard.columns) {
      const found = col.tasks?.find((t) => t.id === taskId);
      if (found) {
        liveTask = found;
        break;
      }
    }
  }

  if (!currentBoard || !liveTask) return null;

  const handleOpenEditTask = () => {
    setIsOpenEditTask(true);
    setIsOpenSetting(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteTaskOpen(true);
    setIsOpenSetting(false);
  };

  const handleConfirmDeleteTask = () => {
    deleteTask.mutate(
      { boardId: currentBoard.id, taskId: liveTask.id },
      {
        onSuccess: () => {
          setIsDeleteTaskOpen(false);
          onClose();
        },
      },
    );
  };

  const completedSubtasks =
    liveTask.subtasks?.filter((subtask) => subtask.isCompleted).length || 0;
  const totalSubtasks = liveTask.subtasks?.length || 0;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="">
        <div className="text-text-main-light dark:text-text-main-dark relative">
          <div className="flex items-start justify-between gap-4 mb-6 relative">
            <h2 className="text-lg font-bold leading-snug">{liveTask.title}</h2>
            <div className="relative shrink-0">
              <button
                onClick={() => setIsOpenSetting(!isOpenSettings)}
                className="text-text-muted-light dark:text-text-muted-dark hover:text-text-main-light dark:hover:text-text-main-dark px-2 py-1 font-bold text-xl cursor-pointer transition-colors"
              >
                ⋮
              </button>
              <DropdownMenu
                isOpen={isOpenSettings}
                onClose={() => setIsOpenSetting(false)}
                editLabel="Edit Task"
                deleteLabel="Delete Task"
                onDelete={handleOpenDeleteModal}
                onEdit={handleOpenEditTask}
              />
            </div>
          </div>

          <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-6">
            {liveTask.description || "No description available for this task."}
          </p>

          <div className="mb-6">
            <h3 className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-4">
              Subtasks ({completedSubtasks} of {totalSubtasks})
            </h3>
            <div className="space-y-2 max-h-50 overflow-y-auto pr-1">
              {liveTask.subtasks?.map((subtask) => (
                <label
                  key={subtask.id}
                  className="w-full flex items-center gap-4 bg-body-light dark:bg-body-dark hover:bg-primary/25 dark:hover:bg-primary/25 rounded p-3 transition-colors cursor-pointer border border-transparent"
                >
                  <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    onChange={() => {
                      toggleSubtask.mutate({
                        boardId: currentBoard.id,
                        taskId: liveTask.id,
                        subtaskId: subtask.id,
                      });
                    }}
                    className="w-4 h-4 accent-primary rounded cursor-pointer shrink-0"
                  />
                  <span
                    className={`text-xs font-bold transition-all ${
                      subtask.isCompleted
                        ? "text-text-muted-light dark:text-text-muted-dark line-through opacity-50"
                        : "text-text-main-light dark:text-text-main-dark"
                    }`}
                  >
                    {subtask.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
              Current Status
            </label>
            <div className="relative">
              <select
                value={liveTask.status}
                onChange={(e) => {
                  updateTask.mutate({
                    boardId: currentBoard.id,
                    taskId: liveTask.id,
                    updatedData: {
                      title: liveTask.title,
                      description: liveTask.description,
                      status: e.target.value,
                      subtasks: liveTask.subtasks,
                    },
                  });
                }}
                className="w-full text-sm font-medium px-4 py-3 rounded border border-input-border-light dark:border-input-border-dark bg-card-light dark:bg-card-dark outline-none hover:border-primary focus:border-primary appearance-none cursor-pointer transition-colors duration-200"
              >
                {currentBoard.columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-primary text-xs font-bold">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <TaskFormModal
        isOpen={isOpenEditTask}
        onClose={() => setIsOpenEditTask(false)}
        board={currentBoard}
        taskToEdit={liveTask}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteTaskOpen}
        onClose={() => setIsDeleteTaskOpen(false)}
        onConfirm={handleConfirmDeleteTask}
        title="Delete this task?"
        description={`Are you sure you want to delete the '${liveTask.title}' task and its subtasks? This action cannot be reversed.`}
        isPending={deleteTask.isPending}
      />
    </>
  );
};
