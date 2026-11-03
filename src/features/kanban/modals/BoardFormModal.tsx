import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/Modal";
import { CustomButton } from "../../../components/CustomButton";
import { boardSchema, type BoardFormValues } from "../schemas";
import { useKanbanMutations } from "../../../hooks/useKanban";
import type { Board } from "../../../types/kanban.types";
import { InputField } from "../../../components/InputField";
import { X } from "lucide-react";

interface BoardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardToEdit?: Board | null;
}

export const BoardFormModal: React.FC<BoardFormModalProps> = ({
  isOpen,
  onClose,
  boardToEdit,
}) => {
  const { createBoard, updateBoard } = useKanbanMutations();
  const isEditMode = !!boardToEdit;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: "",
      columns: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  useEffect(() => {
    if (isOpen) {
      if (boardToEdit) {
        reset({
          name: boardToEdit.name,
          columns: boardToEdit.columns.map((c) => ({ name: c.name, id: c.id })),
        });
      } else {
        reset({
          name: "",
          columns: [{ name: "Todo" }, { name: "Doing" }],
        });
      }
    }
  }, [isOpen, boardToEdit, reset]);

  const onSubmit = (data: BoardFormValues) => {
    const columnData = data.columns || [];

    if (isEditMode && boardToEdit) {
      // Match columns by position so their existing tasks remain attached during edits.
      const columnsWithPreservedTasks = columnData.map(
        (c: any, index: number) => {
          const originalColumn = boardToEdit.columns[index];

          return {
            id: c.id || originalColumn?.id,
            name: c.name,
            tasks: originalColumn ? originalColumn.tasks : [],
          };
        },
      );

      updateBoard.mutate(
        {
          boardId: boardToEdit.id,
          data: {
            name: data.name,
            columns: columnsWithPreservedTasks,
          },
        },
        {
          onSuccess: () => onClose(),
        },
      );
    } else {
      createBoard.mutate(
        {
          name: data.name,
          columns: columnData.map((c) => c.name),
        },
        {
          onSuccess: () => onClose(),
        },
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Board" : "Add New Board"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 text-text-main-light dark:text-text-main-dark"
      >
        <InputField
          label="Board Name"
          register={register("name")}
          error={errors.name?.message}
          placeholder="e.g. Web Design"
        />

        <fieldset className="flex min-w-0 flex-col gap-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
            Board Columns
          </legend>
          <div className="space-y-3 max-h-45 overflow-y-auto pr-1">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4">
                <InputField
                  register={register(`columns.${index}.name`)}
                  error={errors.columns?.[index]?.name?.message}
                  placeholder="e.g. Todo"
                  aria-label={`Board column ${index + 1}`}
                  className="min-w-0 flex-1"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 text-xl font-bold text-text-muted-light hover:text-red dark:text-text-muted-dark cursor-pointer transition-colors"
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
          <CustomButton
            type="button"
            variant="secondary"
            onClick={() => append({ name: "" })}
            className="w-full"
          >
            + Add New Column
          </CustomButton>
        </fieldset>

        <CustomButton
          type="submit"
          isLoading={isEditMode ? updateBoard.isPending : createBoard.isPending}
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-sm py-3 rounded-full transition-all shadow-sm"
        >
          {isEditMode ? "Save Changes" : "Create New Board"}
        </CustomButton>
      </form>
    </Modal>
  );
};
