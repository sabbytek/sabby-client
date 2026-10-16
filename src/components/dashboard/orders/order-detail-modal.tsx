"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { MANAGER_ROLES, WRITE_ROLES, useHasRole } from "@/components/auth/guard";
import { CHANNEL_LABELS, OrderStatusBadge, PaymentStatusBadge } from "@/components/dashboard/orders/order-badges";
import { useOrder, useTransitionOrder } from "@/lib/queries/orders.queries";
import { useInventory } from "@/lib/queries/products.queries";
import { errorMessage } from "@/lib/api/types";
import { formatDateTime, formatKobo } from "@/lib/format";
import type { OrderStatus, OrderTransition } from "@/lib/api/orders.types";

type Action = { action: OrderTransition; label: string; managerOnly: boolean };

// Mirrors VALID_TRANSITIONS in oniraja-server src/modules/orders/state-machine.ts.
const ACTIONS: Partial<Record<OrderStatus, Action[]>> = {
  draft: [
    { action: "confirm", label: "Confirm Order", managerOnly: true },
    { action: "cancel", label: "Cancel", managerOnly: true },
  ],
  confirmed: [
    { action: "process", label: "Start Processing", managerOnly: false },
    { action: "cancel", label: "Cancel", managerOnly: true },
  ],
  processing: [
    { action: "fulfil", label: "Mark Fulfilled", managerOnly: false },
    { action: "cancel", label: "Cancel", managerOnly: true },
  ],
  dispatched: [
    { action: "fulfil", label: "Mark Fulfilled", managerOnly: false },
    { action: "cancel", label: "Cancel", managerOnly: true },
  ],
};

const SUCCESS_MESSAGES: Record<OrderTransition, string> = {
  confirm: "Order confirmed",
  process: "Order moved to processing",
  fulfil: "Order marked as fulfilled",
  cancel: "Order cancelled",
};

type Props = { orderId: string | null; onClose: () => void };

export function OrderDetailModal({ orderId, onClose }: Props) {
  const { data: order, isLoading, error, refetch } = useOrder(orderId);
  const { data: inventory } = useInventory();
  const transition = useTransitionOrder();
  const isManager = useHasRole(MANAGER_ROLES);
  const canWrite = useHasRole(WRITE_ROLES);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const variantNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of inventory ?? []) {
      if (row.variantName) map.set(row.variantId, `${row.variantName}${row.variantSku ? ` · ${row.variantSku}` : ""}`);
    }
    return map;
  }, [inventory]);

  // Line totals already include per-line VAT (see calculateOrderTotals on the server).
  const lineTaxKobo = order?.items.reduce((sum, item) => sum + item.taxKobo, 0) ?? 0;
  const pendingAction = transition.isPending ? transition.variables?.action : undefined;

  const actions = (order ? ACTIONS[order.status] ?? [] : []).filter((a) =>
    a.managerOnly ? isManager : canWrite,
  );

  const run = (action: OrderTransition) => {
    if (!order) return;
    if (action === "cancel" && !confirmingCancel) {
      setConfirmingCancel(true);
      return;
    }
    transition.mutate(
      { id: order.id, action },
      {
        onSuccess: () => {
          toast.success(SUCCESS_MESSAGES[action]);
          setConfirmingCancel(false);
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <Modal
      open={!!orderId}
      onOpenChange={(open) => {
        if (!open) {
          setConfirmingCancel(false);
          onClose();
        }
      }}
      title={order ? `Order ${order.orderNumber}` : "Order"}
      description={order ? `Created ${formatDateTime(order.createdAt)}` : undefined}
      width="max-w-xl"
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ) : error || !order ? (
        <ErrorState message={errorMessage(error, "Order not found")} onRetry={() => void refetch()} />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
            <span className="text-xs text-on-surface-variant">
              via {CHANNEL_LABELS[order.channel] ?? order.channel}
            </span>
          </div>

          <div className="rounded-lg border border-outline-variant/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-on-surface-variant bg-surface-container-low/50 text-left">
                  <th className="py-2 px-3 font-medium">Item</th>
                  <th className="py-2 px-3 font-medium text-right">Qty</th>
                  <th className="py-2 px-3 font-medium text-right">Unit</th>
                  <th className="py-2 px-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-outline-variant/30">
                    <td className="py-2 px-3 text-on-surface">
                      {variantNames.get(item.variantId) ?? <span className="font-mono text-xs">{item.variantId}</span>}
                    </td>
                    <td className="py-2 px-3 text-right">{item.quantity}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatKobo(item.unitPriceKobo)}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatKobo(item.lineTotalKobo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="text-sm grid grid-cols-2 gap-y-1.5 ml-auto w-full sm:w-64">
            <dt className="text-on-surface-variant">Subtotal</dt>
            <dd className="text-right font-mono">{formatKobo(order.subtotalKobo)}</dd>
            {lineTaxKobo > 0 && (
              <>
                <dt className="text-xs text-on-surface-variant pl-2">incl. VAT</dt>
                <dd className="text-xs text-right font-mono text-on-surface-variant">{formatKobo(lineTaxKobo)}</dd>
              </>
            )}
            {order.discountKobo > 0 && (
              <>
                <dt className="text-on-surface-variant">Discount</dt>
                <dd className="text-right font-mono">−{formatKobo(order.discountKobo)}</dd>
              </>
            )}
            {order.taxKobo > 0 && (
              <>
                <dt className="text-on-surface-variant">Tax</dt>
                <dd className="text-right font-mono">{formatKobo(order.taxKobo)}</dd>
              </>
            )}
            {order.deliveryFeeKobo > 0 && (
              <>
                <dt className="text-on-surface-variant">Delivery</dt>
                <dd className="text-right font-mono">{formatKobo(order.deliveryFeeKobo)}</dd>
              </>
            )}
            <dt className="font-semibold text-on-surface pt-1.5 border-t border-outline-variant/40">Total</dt>
            <dd className="text-right font-mono font-semibold pt-1.5 border-t border-outline-variant/40">
              {formatKobo(order.totalKobo)}
            </dd>
          </dl>

          {order.note && (
            <p className="text-sm text-on-surface-variant bg-surface-container-low/60 rounded-lg p-3">{order.note}</p>
          )}

          {actions.length > 0 && (
            <div className="flex flex-wrap justify-end items-center gap-2 pt-3 border-t border-outline-variant/40">
              {confirmingCancel && (
                <span className="text-xs text-error mr-auto">
                  Cancel this order?{order.status !== "draft" && " Stock will be restored."}
                </span>
              )}
              {actions.map((a) => (
                <button
                  key={a.action}
                  type="button"
                  disabled={transition.isPending}
                  onClick={() => run(a.action)}
                  className={
                    a.action === "cancel"
                      ? "text-sm font-medium px-4 py-2 rounded-lg text-error hover:bg-error-container/40 transition-colors disabled:opacity-50"
                      : "bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  }
                >
                  {pendingAction === a.action
                    ? "Working…"
                    : a.action === "cancel" && confirmingCancel
                      ? "Yes, cancel order"
                      : a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
