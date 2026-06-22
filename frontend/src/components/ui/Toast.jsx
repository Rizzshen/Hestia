import { useEffect } from "react";
import { CheckCircle, Trash2, Pencil, X } from "lucide-react";

const ICONS = {
  created: <CheckCircle size={15} className="text-success shrink-0" />,
  updated: <Pencil size={15} className="text-primary shrink-0" />,
  deleted: <Trash2 size={15} className="text-danger shrink-0" />,
};

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className="flex items-center gap-2.5 bg-surface border border-border rounded-xl px-4 py-3 shadow-lg text-sm text-text min-w-[220px] max-w-xs animate-slide-in">
      {ICONS[toast.type]}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-text-muted hover:text-text transition-colors ml-1"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}