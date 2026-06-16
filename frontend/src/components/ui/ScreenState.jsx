/**
 * ScreenState — consistent error / empty / no-results UI.
 *
 * Usage:
 *   <ScreenState type="error" onRetry={refetch} />
 *   <ScreenState type="empty" title="No orders yet" description="Create your first order to get started." action={{ label: "New Order", onClick: () => navigate("/orders/new") }} />
 *   <ScreenState type="no-results" title="No matches" description="Try a different search term." />
 */

import Card from "./Card";

const CONFIGS = {
  error: {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7 text-danger"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9l6 6M15 9l-6 6" />
      </svg>
    ),
    iconBg: "bg-danger-bg",
    defaultTitle: "Something went wrong",
    defaultDescription: "Check your connection and try again.",
  },
  empty: {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7 text-text-muted"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
    iconBg: "bg-surface-muted",
    defaultTitle: "Nothing here yet",
    defaultDescription: "Data will appear here once it's available.",
  },
  "no-results": {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7 text-text-muted"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5L21 21" />
        <path d="M8 11h6M11 8v6" strokeLinecap="round" />
      </svg>
    ),
    iconBg: "bg-surface-muted",
    defaultTitle: "No results found",
    defaultDescription: "Try adjusting your search or filters.",
  },
};

export default function ScreenState({
  type = "error",
  title,
  description,
  /** { label: string, onClick: fn } — renders a primary CTA */
  action,
  /** shorthand for error retry — wraps into action automatically */
  onRetry,
  /** wrap in a Card (default true) */
  card = true,
  /** py padding class for the inner content */
  paddingY = "py-14",
}) {
  const config = CONFIGS[type] ?? CONFIGS.error;
  const resolvedTitle = title ?? config.defaultTitle;
  const resolvedDescription = description ?? config.defaultDescription;
  const resolvedAction =
    action ?? (onRetry ? { label: "Retry", onClick: onRetry } : null);

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center ${paddingY}`}
      role={type === "error" ? "alert" : undefined}
    >
      {/* Icon */}
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-full ${config.iconBg}`}
      >
        {config.icon}
      </div>

      {/* Text */}
      <div className="space-y-1 max-w-xs">
        <p className="text-sm font-semibold text-text">{resolvedTitle}</p>
        {resolvedDescription && (
          <p className="text-xs text-text-muted leading-relaxed">
            {resolvedDescription}
          </p>
        )}
      </div>

      {/* Action */}
      {resolvedAction && (
        <button
          onClick={resolvedAction.onClick}
          className="mt-1 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-surface-secondary text-text hover:bg-surface-muted transition-colors"
        >
          {type === "error" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <path d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.83-3.83M20 15A9 9 0 015.17 18.83" />
            </svg>
          )}
          {resolvedAction.label}
        </button>
      )}
    </div>
  );

  return card ? <Card>{content}</Card> : content;
}
