/**
 * Skeleton — pulse placeholder for loading states.
 *
 * Usage:
 *   <Skeleton />                        // full-width block, default height
 *   <Skeleton className="h-4 w-32" />   // inline label
 *   <Skeleton circle className="w-10 h-10" />  // avatar
 */
export default function Skeleton({ className = "", circle = false }) {
  return (
    <div
      className={[
        "animate-pulse bg-surface-muted",
        circle ? "rounded-full" : "rounded-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    />
  );
}
