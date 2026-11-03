import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  // Prevent background scrolling while the modal is open.
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative max-h-[calc(100vh-160px)] overflow-y-auto bg-card-light dark:bg-card-dark w-full max-w-md rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-text-main-light dark:text-text-main-dark">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};
