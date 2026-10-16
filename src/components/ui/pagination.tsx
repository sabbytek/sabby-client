import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions?: number[];
  isFetching?: boolean;
};

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = [25, 50, 100],
  isFetching,
}: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="p-4 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-on-surface-variant">
      <div className="flex items-center gap-2">
        Show
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="text-sm border-0 rounded-lg bg-surface-container-low text-on-surface py-1 pl-2 pr-6 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {limitOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        Entries
      </div>
      <div className="flex items-center gap-3">
        <span className={isFetching ? "opacity-60" : undefined}>
          {from}–{to} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
