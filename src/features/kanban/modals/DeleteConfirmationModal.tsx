import { Modal } from "../../../components/Modal";
import { CustomButton } from "../../../components/CustomButton";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isPending?: boolean;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, title, description, isPending }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-left">
        <h2 className="text-lg font-bold text-red mb-6">{title}</h2>
        <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <CustomButton
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isPending}
            className="w-full"
          >
            Delete
          </CustomButton>
          <CustomButton
            type="button"
            variant="secondary"
            onClick={onClose}
            isLoading={isPending}
            className="w-full"
          >
            Cancel
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};
