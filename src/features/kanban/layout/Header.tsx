import { useState } from "react";
import { CustomButton } from "../../../components/CustomButton";
import { Plus } from "lucide-react";
import { DropdownMenu } from "../components/DropdownMenu";
import { BoardFormModal } from "../modals/BoardFormModal";
import type { Board } from "../../../types/kanban.types";
import { TaskFormModal } from "../modals/TaskFormModal";
import { DeleteConfirmationModal } from "../modals/DeleteConfirmationModal";
import { useKanbanMutations } from "../../../hooks/useKanban";

interface HeaderProps {
  boardName: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeBoard: Board;
}

export const Header: React.FC<HeaderProps> = ({
  boardName,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeBoard,
}) => {
  const { deleteBoard } = useKanbanMutations();

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isOpenSettings, setIsOpenSetting] = useState(false);
  const [isOpenEditBord, setIsOpenEditBord] = useState(false);

  const handleOpenEditBord = () => {
    setIsOpenEditBord(true);
  };

  const [isDeleteBaord, setIsDeleteBaord] = useState(false);

  const handleDeleteBoard = () => {
    setIsDeleteBaord(true);
  };

  const handleConfirmDeleteBoard = () => {
    deleteBoard.mutate(activeBoard.id, {
      onSuccess: () => {
        setIsDeleteBaord(false);
      },
    });
  };

  return (
    <header className="h-20 bg-layout-light dark:bg-layout-dark border-b border-line-light dark:border-line-dark flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <img
          className="block md:hidden"
          src="/logo-mobile.svg"
          alt="Kanban Logo Mobile"
        />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 text-lg md:text-2xl font-bold text-text-main-light dark:text-text-main-dark truncate cursor-pointer md:cursor-default md:pointer-events-none"
        >
          {boardName || "No Board Selected"}
          {!isMobileMenuOpen ? (
            <img
              src="/icon-chevron-up.svg"
              alt="Chevron Up"
              className=" md:hidden transition-transform duration-300"
            />
          ) : (
            <img
              src="/icon-chevron-up.svg"
              alt="Chevron Down"
              className=" rotate-180 transition-transform duration-300"
            />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <CustomButton
            variant="primary"
            onClick={() => setIsAddTaskModalOpen(true)}
            hasIcon={true}
          >
            Add New Task
          </CustomButton>
        </div>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="md:hidden bg-primary  hover:bg-primary-hover max-md:py-1 max-md:px-4 text-white font-bold py-6 px-6 rounded-full text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="font-bold" />
        </button>
        <button
          onClick={() => setIsOpenSetting(true)}
          className="text-text-muted-light dark:text-text-muted-dark hover:text-text-main-light dark:hover:text-text-main-dark p-2 text-xl cursor-pointer"
        >
          <img src="/icon-vertical-ellipsis.svg" alt="Settings Icon" />
        </button>
      </div>

      <TaskFormModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        board={activeBoard}
      />

      <DropdownMenu
        isOpen={isOpenSettings}
        onClose={() => setIsOpenSetting(false)}
        editLabel="Edit Board"
        deleteLabel="Delete Board"
        onDelete={handleDeleteBoard}
        onEdit={handleOpenEditBord}
      />
      <BoardFormModal
        isOpen={isOpenEditBord}
        onClose={() => setIsOpenEditBord(false)}
        boardToEdit={activeBoard}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteBaord}
        onClose={() => setIsDeleteBaord(false)}
        onConfirm={handleConfirmDeleteBoard}
        title={`Delete this ${boardName}?`}
        description={`Are you sure you want to delete the '${boardName}' board? This action will remove all columns and tasks and cannot be reversed.`}
        isPending={deleteBoard.isPending}
      />
    </header>
  );
};
