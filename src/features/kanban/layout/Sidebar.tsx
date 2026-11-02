import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { BoardFormModal } from "../modals/BoardFormModal";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  boards: Array<{ id: string; name: string }>;
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  boards,
  activeBoardId,
  setActiveBoardId,
}) => {
  const { theme, toggleTheme } = useTheme();

  const [isOpenCreateBord, setIsOpenCreateBord] = useState(false);

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-layout-light dark:bg-layout-dark border-r overflow-x-auto  border-line-light dark:border-line-dark flex flex-col justify-between transition-transform duration-300 w-75 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-8">
          <div className="px-6 mb-14">
            {theme === "dark" ? (
              <img
                className="hidden sm:block"
                src="/logo-light.svg"
                alt="Kanban Logo"
              />
            ) : (
              <img
                className="hidden sm:block"
                src="/logo-dark.svg"
                alt="Kanban Logo"
              />
            )}
          </div>

          <p className="px-6 text-xs font-bold tracking-[2.4px] text-text-muted-light dark:text-text-muted-dark mb-5 uppercase">
            All Boards ({boards.length})
          </p>

          <nav className="pr-6 space-y-1">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => setActiveBoardId(board.id)}
                className={`w-full flex items-center gap-4 py-3 px-6 text-base font-bold rounded-r-full transition-all cursor-pointer ${
                  board.id === activeBoardId
                    ? "bg-primary text-white"
                    : "text-text-muted-light dark:text-text-muted-dark hover:bg-primary/10 hover:text-primary dark:hover:bg-white dark:hover:text-primary"
                }`}
              >
                <img src="/icon-board.svg" alt="Board Icon" />
                {board.name}
              </button>
            ))}
            <button
              onClick={() => setIsOpenCreateBord(true)}
              className="w-full flex items-center gap-4 py-3 px-6 text-base font-bold text-primary hover:bg-primary/10 rounded-r-full transition-all cursor-pointer"
            >
              + Create New Board
            </button>
          </nav>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-body-light dark:bg-body-dark rounded-lg p-4 flex justify-center items-center gap-6">
            <img src="/icon-light-theme.svg" alt="Light Theme Icon" />
            <button
              onClick={toggleTheme}
              className="w-10 h-5 bg-primary cursor-pointer rounded-full relative p-0.5 transition-colors duration-300"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <img src="/icon-dark-theme.svg" alt="Dark Theme Icon" />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-4 py-3 text-base font-bold text-text-muted-light dark:text-text-muted-dark hover:bg-primary/10 hover:text-primary dark:hover:bg-white dark:hover:text-primary rounded-full transition-all cursor-pointer"
          >
            <img src="/icon-hide-sidebar.svg" alt="Hide Sidebar Icon" />
            Hide Sidebar
          </button>
        </div>
      </aside>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 left-0 z-50 bg-primary hover:bg-primary-hover w-14 h-12 rounded-r-full flex items-center justify-center transition-all shadow-md cursor-pointer"
        >
          <img src="/icon-show-sidebar.svg" alt="Show Sidebar Icon" />
        </button>
      )}

      <BoardFormModal
        isOpen={isOpenCreateBord}
        onClose={() => setIsOpenCreateBord(false)}
      />
    </>
  );
};
