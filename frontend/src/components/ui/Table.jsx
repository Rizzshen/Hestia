import { cn } from "../../lib/utils";

export function Table({ children, className }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm",
        className,
      )}
    >
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead className="border-b border-border">{children}</thead>;
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

export function TableHead({ children, align = "left", className }) {
  return (
    <th
      className={cn(
        "text-[11px] font-semibold text-text-muted uppercase tracking-[0.07em] px-5 py-3 bg-background",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, align = "left", className }) {
  return (
    <td
      className={cn(
        "px-5 py-3.5 text-sm text-text",
        align === "right"
          ? "text-right tabular-nums text-text-secondary"
          : "text-left",
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
