import { AlertTriangle, Lock, type LucideIcon } from "lucide-react";

/** Placeholder rows that match a table's column count while a page loads. */
export function TableSkeletonRows({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} className="border-b border-outline-variant/30 last:border-0">
          {Array.from({ length: columns }, (_, c) => (
            <td key={c} className="py-3.5 px-5">
              <div className="h-3.5 rounded bg-surface-container-low animate-pulse w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-surface-container-low animate-pulse ${className}`} />;
}

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-4">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-on-surface mb-1">{title}</p>
      {body && <p className="text-xs text-on-surface-variant max-w-sm">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <AlertTriangle size={24} className="text-error mb-3" strokeWidth={1.75} />
      <p className="text-sm font-medium text-on-surface mb-1">Couldn&apos;t load this</p>
      <p className="text-xs text-on-surface-variant max-w-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/** Shown when the backend answers 402 FEATURE_GATED for the tenant's plan. */
export function UpgradeNotice({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-3">
        <Lock size={20} strokeWidth={1.75} />
      </div>
      <p className="text-sm font-semibold text-on-surface mb-1">{feature} isn&apos;t on your plan</p>
      <p className="text-xs text-on-surface-variant max-w-sm mb-4">
        Upgrade your plan to unlock {feature.toLowerCase()} for your business.
      </p>
      <button
        type="button"
        className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Upgrade Plan
      </button>
    </div>
  );
}
