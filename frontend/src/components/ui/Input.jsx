import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ icon: Icon, error, className, ...props }, ref) => {
  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted pointer-events-none" />
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-md border p-2.5 text-sm bg-surface-secondary/40 text-text shadow-sm focus:outline-none focus:ring-2 transition-all placeholder:text-text-muted",
            Icon && "pl-10",
            error
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border focus:border-primary focus:ring-primary/20",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;