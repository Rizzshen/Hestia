import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {description && (
        <p className="text-sm text-text-secondary mb-6">{description}</p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-text-secondary rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
