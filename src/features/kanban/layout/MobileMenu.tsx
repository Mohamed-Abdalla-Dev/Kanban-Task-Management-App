import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { BoardFormModal } from "../modals/BoardFormModal";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  boards: Array<{ id: string; name: string }>;
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  boards,
  activeBoardId,
  setActiveBoardId,
}) => {
  const { theme, toggleTheme } = useTheme();

  const [isOpenCreateBord, setIsOpenCreateBord] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-overlay transition-opacity"
      />

      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[320px] bg-card-light dark:bg-card-dark rounded-xl shadow-xl py-4 transition-all duration-300 transform scale-100">
        <p className="px-6 text-xs font-bold tracking-[2.4px] text-text-muted-light dark:text-text-muted-dark mb-4 uppercase">
          All Boards ({boards.length})
        </p>

        <nav className="pr-4 space-y-1 max-h-62.5 overflow-y-auto">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => {
                setActiveBoardId(board.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 py-3 px-6 text-sm font-bold rounded-r-full transition-all cursor-pointer ${
                board.id === activeBoardId
                  ? "bg-primary text-white"
                  : "text-text-muted-light dark:text-text-muted-dark hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary"
              }`}
            >
              <img src="/icon-board.svg" alt="icon board" />
              {board.name}
            </button>
          ))}
          <button
            onClick={() => setIsOpenCreateBord(true)}
            className="w-full flex items-center gap-3 py-3 px-6 text-sm font-bold text-primary hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary rounded-r-full transition-all cursor-pointer"
          >
            + Create New Board
          </button>
        </nav>

        <div className="mx-6 mt-4 bg-body-light dark:bg-body-dark rounded-lg p-3 flex justify-center items-center gap-4 text-sm transition-colors duration-300">
          <img src="/icon-light-theme.svg" alt="light theme icon" />
          <button
            onClick={toggleTheme}
            className="w-9 h-5 bg-primary rounded-full relative p-0.5 cursor-pointer transition-colors duration-300"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                theme === "dark" ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <img src="/icon-dark-theme.svg" alt="dark theme icon" />
        </div>
      </div>
      <BoardFormModal
        isOpen={isOpenCreateBord}
        onClose={() => setIsOpenCreateBord(false)}
      />
    </div>
  );
};
