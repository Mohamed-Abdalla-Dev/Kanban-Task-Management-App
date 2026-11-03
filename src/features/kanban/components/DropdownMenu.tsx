import { useEffect, useRef } from "react";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the menu when a pointer press occurs outside of it.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute w-40 top-18 right-3 bg-card-light dark:bg-card-dark rounded-lg shadow-xl py-2 border border-line-light/50 dark:border-line-dark/50 z-30 animate-fade-in
        "
    >
      <button
        type="button"
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full text-left px-4 py-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:bg-primary/10 font-medium transition-colors cursor-pointer"
      >
        {editLabel}
      </button>

      <button
        type="button"
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full text-left px-4 py-2 text-sm text-red hover:bg-red/10 font-bold transition-colors cursor-pointer"
      >
        {deleteLabel}
      </button>
    </div>
  );
};
