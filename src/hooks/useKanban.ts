import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kanbanService } from "../services/kanbanService";
import type { Board } from "../types/kanban.types";
import { moveTaskOptimistic } from "../features/kanban/utils/optimisticUpdates";

const BOARDS_QUERY_KEY = ["boards"];

export const useGetBoards = () => {
  return useQuery({
    queryKey: BOARDS_QUERY_KEY,
    queryFn: kanbanService.getAllBoards,
  });
};

export const useKanbanMutations = () => {
  const queryClient = useQueryClient();

  const updateCache = (newBoards: Board[]) => {
    queryClient.setQueryData(BOARDS_QUERY_KEY, newBoards);
  };

  const createBoard = useMutation({
    mutationFn: ({ name, columns }: { name: string; columns: string[] }) =>
      kanbanService.createBoard(name, columns),
    onSuccess: (data) => updateCache(data),
  });

  const updateBoard = useMutation({
    mutationFn: ({ boardId, data }: { boardId: string; data: any }) =>
      kanbanService.updateBoard(boardId, data),
    onSuccess: (data) => updateCache(data),
  });

  const deleteBoard = useMutation({
    mutationFn: (boardId: string) => kanbanService.deleteBoard(boardId),
    onSuccess: (data) => updateCache(data),
  });

  const createTask = useMutation({
    mutationFn: ({
      boardId,
      columnId,
      taskData,
    }: {
      boardId: string;
      columnId: string;
      taskData: any;
    }) => kanbanService.createTask(boardId, columnId, taskData),
    onSuccess: (data) => updateCache(data),
  });

  const updateTask = useMutation({
    mutationFn: ({
      boardId,
      taskId,
      updatedData,
    }: {
      boardId: string;
      taskId: string;
      updatedData: any;
    }) => kanbanService.updateTask(boardId, taskId, updatedData),
    onSuccess: (data) => updateCache(data),
  });

  const moveTask = useMutation({
    mutationFn: ({
      boardId,
      taskId,
      status,
      targetIndex,
    }: {
      boardId: string;
      taskId: string;
      status: string;
      targetIndex: number;
    }) => {
      const boards = queryClient.getQueryData<Board[]>(BOARDS_QUERY_KEY);
      const task = boards
        ?.find((board) => board.id === boardId)
        ?.columns.flatMap((column) => column.tasks)
        .find((item) => item.id === taskId);

      if (!task) {
        throw new Error("The task could not be found.");
      }

      return kanbanService.updateTask(boardId, taskId, {
        title: task.title,
        description: task.description,
        status,
        subtasks: task.subtasks,
        targetIndex,
      });
    },
    onMutate: async ({ boardId, taskId, status, targetIndex }) => {
      await queryClient.cancelQueries({ queryKey: BOARDS_QUERY_KEY });
      const previousBoards =
        queryClient.getQueryData<Board[]>(BOARDS_QUERY_KEY);

      queryClient.setQueryData<Board[]>(BOARDS_QUERY_KEY, (boards) =>
        moveTaskOptimistic(boards, boardId, taskId, status, targetIndex),
      );

      return { previousBoards };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBoards) {
        // Restore the cache snapshot if persisting the move fails.
        queryClient.setQueryData(BOARDS_QUERY_KEY, context.previousBoards);
      }
    },
    onSuccess: (data) => {
      if (data) updateCache(data);
    },
  });

  const deleteTask = useMutation({
    mutationFn: ({ boardId, taskId }: { boardId: string; taskId: string }) =>
      kanbanService.deleteTask(boardId, taskId),
    onSuccess: (data) => updateCache(data),
  });

  const toggleSubtask = useMutation({
    mutationFn: ({
      boardId,
      taskId,
      subtaskId,
    }: {
      boardId: string;
      taskId: string;
      subtaskId: string;
    }) => kanbanService.toggleSubtask(boardId, taskId, subtaskId),
    onSuccess: (data) => updateCache(data),
  });

  return {
    createBoard,
    updateBoard,
    deleteBoard,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    toggleSubtask,
  };
};
