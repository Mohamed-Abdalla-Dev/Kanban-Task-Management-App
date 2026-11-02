import { useState, useEffect } from "react";
import { useGetBoards } from "../hooks/useKanban";
import { Header } from "./kanban/layout/Header";
import { BoardWorkspace } from "../features/kanban/components/BoardWorkspace";
import { Sidebar } from "./kanban/layout/Sidebar";
import { MobileMenu } from "./kanban/layout/MobileMenu";
import { TaskDetailsModal } from "./kanban/modals/TaskDetailsModal";
import { BoardFormModal } from "./kanban/modals/BoardFormModal";

export const KanbanDashboard: React.FC = () => {
  const { data: boards = [], isLoading } = useGetBoards();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeBoardId, setActiveBoardId] = useState<string>("");

  useEffect(() => {
    if (boards.length > 0 && !boards.find((b) => b.id === activeBoardId)) {
      setActiveBoardId(boards[0].id);
    }
  }, [boards, activeBoardId]);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskClick = (boardId: string, taskId: string) => {
    setSelectedBoardId(boardId);
    setSelectedTaskId(taskId);
  };

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const handleAddNewColumn = () => {
    setIsBoardModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-body-light dark:bg-body-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!activeBoardId || !activeBoard)
    return (
      <div className="p-10 text-center text-text-main-light dark:text-text-main-dark">
        No Board Found!
      </div>
    );

  return (
    <div className="min-h-screen bg-body-light dark:bg-body-dark transition-colors duration-300 flex overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          boards={boards.map((b) => ({ id: b.id, name: b.name }))}
          activeBoardId={activeBoardId}
          setActiveBoardId={setActiveBoardId}
        />
      </div>

      <div className="md:hidden">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          boards={boards.map((b) => ({ id: b.id, name: b.name }))}
          activeBoardId={activeBoardId}
          setActiveBoardId={setActiveBoardId}
        />
      </div>

      <div
        className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${
          isSidebarOpen ? "md:pl-75" : "md:pl-0"
        }`}
      >
        <Header
          activeBoard={activeBoard}
          boardName={activeBoard.name}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="flex-1 overflow-hidden bg-body-light dark:bg-body-dark">
          <BoardWorkspace
            board={activeBoard}
            onTaskClick={handleTaskClick}
            onAddNewColumn={handleAddNewColumn}
          />
          <BoardFormModal
            isOpen={isBoardModalOpen}
            onClose={() => setIsBoardModalOpen(false)}
            boardToEdit={activeBoard}
          />
        </main>
      </div>

      {selectedBoardId && selectedTaskId && (
        <TaskDetailsModal
          isOpen={!!selectedTaskId}
          onClose={() => {
            setSelectedTaskId(null);
            setSelectedBoardId(null);
          }}
          boardId={selectedBoardId}
          taskId={selectedTaskId}
        />
      )}
    </div>
  );
};
