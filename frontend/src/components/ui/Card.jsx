import { cn } from "../../lib/utils";

export default function Card({ children, className }) {
  return (
    <div
      className={cn(
        // TODO: base card styles here
        "bg-surface rounded-lg border border-border shadow-sm p-6",

        className
      )}
    >
      {children}
    </div>
  );
}