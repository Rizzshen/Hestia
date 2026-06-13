import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-primary text-primary-foreground border border-primary-hover hover:bg-primary-hover",
  secondary:
    "bg-background-surface text-text border border-border hover:brightness-80 font-normal",
  danger:
    "bg-danger-bg text-danger border border-danger-border hover:bg-red-100 font-medium",
  ghost:
    "bg-transparent text-primary border-b border-primary rounded-none px-0 pb-[1px] font-normal",
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "px-4 py-1.75 rounded-[4px] text-[13px] font-medium tracking-[0.01em] transition-colors duration-100",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
