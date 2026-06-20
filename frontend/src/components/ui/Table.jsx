import { cn } from "../../lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

export function Table({ children, footer, className }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm",
        className,
      )}
    >
      <table className="w-full border-collapse">{children}</table>
      {footer}
    </div>
  );
}
export function TableHead({
  children,
  align = "left",
  className,
  sortKey,
  currentSort,
  direction,
  onSort,
}) {
  const isSortable = !!sortKey && !!onSort;
  const isActive = sortKey === currentSort;

  return (
    <th
      className={cn(
        "text-[11px] font-semibold text-text-muted uppercase tracking-[0.07em] px-5 py-2.5 bg-background",
        align === "right" ? "text-right" : "text-left",
        align === "center" ? "text-center" : "",
        isSortable && "cursor-pointer select-none hover:text-text",
        className,
      )}
      onClick={isSortable ? () => onSort(sortKey) : undefined}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1",
          align === "right" && "flex-row-reverse",
        )}
      >
        {children}
        {isSortable &&
          (isActive && direction === "asc" ? (
            <ChevronUp size={12} className="text-primary" />
          ) : isActive && direction === "desc" ? (
            <ChevronDown size={12} className="text-primary" />
          ) : (
            <ChevronDown size={12} className="opacity-30" />
          ))}
      </span>
    </th>
  );
}

export function TableHeader({ children }) {
  return <thead className="border-b-2 border-border">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function TableRow({ children, className }) {
  return (
    <tr
      className={cn(
        "hover:bg-background/70 transition-colors duration-100",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, align = "left", className }) {
  return (
    <td
      className={cn(
        "px-5 py-2.5 text-sm text-text",
        align === "right"
          ? "text-right tabular-nums text-text-secondary"
          : "text-left",
        align === "center" ? "text-center" : "",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function TableUnitBadge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] border border-border text-xs text-text-muted bg-background">
      {children}
    </span>
  );
}

export function TableStatusBadge({ qty, threshold }) {
  if (!threshold || threshold === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-medium bg-info-bg text-info">
        <span className="w-1.5 h-1.5 rounded-full bg-info inline-block shrink-0" />
        No threshold
      </span>
    );
  }

  const ratio = qty / threshold;

  if (ratio <= 0.5) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-medium bg-danger-bg text-danger">
        <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block shrink-0" />
        Critical
      </span>
    );
  }

  if (ratio <= 1.2) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-medium bg-warning-bg text-warning">
        <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block shrink-0" />
        Low stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-medium bg-success-bg text-success">
      <span className="w-1.5 h-1.5 rounded-full bg-success inline-block shrink-0" />
      In stock
    </span>
  );
}
