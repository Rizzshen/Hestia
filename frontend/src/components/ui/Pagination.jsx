import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, goToPage, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-background">
      <p className="text-xs text-text-muted">
        Showing {startItem}–{endItem} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs text-text-secondary font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}