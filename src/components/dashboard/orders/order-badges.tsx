import type { OrderStatus, PaymentStatus } from "@/lib/api/orders.types";

const BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap";

const STATUS_STYLES: Record<OrderStatus, string> = {
  draft: "bg-surface-container-high text-on-surface-variant",
  confirmed: "bg-info-bg text-info",
  processing: "bg-warning-bg text-warning",
  dispatched: "bg-primary-fixed text-on-primary-fixed-variant",
  fulfilled: "bg-success-bg text-success",
  cancelled: "bg-danger-bg text-danger",
  refunded: "bg-surface-container-high text-on-surface-variant",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-surface-container-high text-on-surface-variant",
  initiated: "bg-info-bg text-info",
  paid: "bg-success-bg text-success",
  failed: "bg-danger-bg text-danger",
  refunded: "bg-surface-container-high text-on-surface-variant",
  partially_refunded: "bg-warning-bg text-warning",
};

function label(value: string): string {
  const text = value.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`${BADGE} ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>{label(status)}</span>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`${BADGE} ${PAYMENT_STYLES[status] ?? PAYMENT_STYLES.pending}`}>{label(status)}</span>;
}

export const CHANNEL_LABELS: Record<string, string> = {
  website: "Website",
  pos: "POS",
  whatsapp: "WhatsApp",
  manual: "Manual",
};
