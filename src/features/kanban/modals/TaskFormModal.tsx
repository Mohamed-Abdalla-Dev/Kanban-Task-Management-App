import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/Modal";
import { CustomButton } from "../../../components/CustomButton";
import { taskSchema, type TaskFormValues } from "../schemas";
import { useKanbanMutations } from "../../../hooks/useKanban";
import type { Board, Task } from "../../../types/kanban.types";
import { InputField } from "../../../components/InputField";
import { ChevronDown, X } from "lucide-react";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board;
  taskToEdit?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  board,
  taskToEdit,
}) => {
  const { createTask, updateTask } = useKanbanMutations();
  const isEditMode = !!taskToEdit;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: board?.columns?.[0]?.id || "",
      subtasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  // Reset values each time the modal opens to avoid reusing stale form data.
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        reset({
          title: taskToEdit.title,
          description: taskToEdit.description || "",
          status: taskToEdit.status,
          subtasks: taskToEdit.subtasks.map((st) => ({ title: st.title })),
        });
      } else {
        reset({
          title: "",
          description: "",
          status: board?.columns?.[0]?.id || "",
          subtasks: [],
        });
      }
    }
  }, [isOpen, taskToEdit, board, reset]);

  const onSubmit = (data: TaskFormValues) => {
    const subtaskData = data.subtasks || [];

    if (isEditMode && taskToEdit) {
      updateTask.mutate(
        {
          boardId: board.id,
          taskId: taskToEdit.id,
          updatedData: {
            title: data.title,
            description: data.description || "",
            status: data.status,
            subtasks: subtaskData,
          },
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
    } else {
      createTask.mutate(
        {
          boardId: board.id,
          columnId: data.status,
          taskData: {
            title: data.title,
            description: data.description || "",
            subtasks: subtaskData,
          },
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Task" : "Add New Task"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 pr-2 custom-scrollbar text-text-main-light dark:text-text-main-dark"
      >
        <InputField
          label="Title"
          register={register("title")}
          error={errors.title?.message}
          placeholder="e.g. Take coffee break"
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-wider text-text-muted-light dark:text-text-muted-dark uppercase">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full text-sm font-medium px-4 py-3 rounded border border-input-border-light dark:border-input-border-dark bg-transparent outline-none hover:border-primary focus:border-primary resize-none transition-colors duration-200 placeholder:text-text-main-light/25 dark:placeholder:text-text-main-dark/25"
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-wider text-text-muted-light dark:text-text-muted-dark uppercase">
            Subtasks
          </label>

          <div className="space-y-3 max-h-45 overflow-y-auto pr-1">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4 animate-fade-in"
              >
                <InputField
                  register={register(`subtasks.${index}.title`)}
                  error={errors.subtasks?.[index]?.title?.message}
                  placeholder="e.g. Make coffee"
                  className="min-w-0 flex-1"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 text-xl font-bold text-text-muted-light hover:text-red dark:text-text-muted-dark transition-colors cursor-pointer"
                  title="Remove subtask"
                >
                  <X />
                </button>
              </div>
            ))}
          </div>

          <CustomButton
            type="button"
            variant="secondary"
            onClick={() => append({ title: "" })}
            className="w-full"
          >
            + Add New Subtask
          </CustomButton>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-wider text-text-muted-light dark:text-text-muted-dark uppercase">
            Status
          </label>
          <div className="relative">
            <select
              {...register("status")}
              className="w-full text-sm font-medium px-4 py-3 rounded border border-input-border-light dark:border-input-border-dark bg-card-light dark:bg-card-dark outline-none hover:border-primary focus:border-primary appearance-none cursor-pointer transition-colors duration-200"
            >
              {board.columns.map((col) => (
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

        <CustomButton
          type="submit"
          variant="primary"
          isLoading={isEditMode ? updateTask.isPending : createTask.isPending}
          className="w-full"
        >
          {isEditMode ? "Save Changes" : "Create Task"}
        </CustomButton>
      </form>
    </Modal>
  );
};
