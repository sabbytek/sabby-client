"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, FormActions, INPUT_CLASS } from "@/components/ui/form-field";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCreateOrder } from "@/lib/queries/orders.queries";
import { useInventory, useProduct, useProducts } from "@/lib/queries/products.queries";
import { useCustomers } from "@/lib/queries/customers.queries";
import { errorMessage } from "@/lib/api/types";
import { formatKobo, nairaToKobo } from "@/lib/format";
import type { OrderChannel } from "@/lib/api/orders.types";
import type { ProductVariant } from "@/lib/api/products.types";
import { CHANNEL_LABELS } from "@/components/dashboard/orders/order-badges";

type Line = {
  variantId: string;
  label: string;
  quantity: string;
  unitPrice: string; // Naira, as typed
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (orderId: string) => void;
};

export function CreateOrderModal({ open, onOpenChange, onCreated }: Props) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Order"
      description="Record a sale manually. It's saved as a draft until confirmed."
      width="max-w-2xl"
    >
      {/* Remount on open so every order starts from a clean form. */}
      {open && <CreateOrderForm onClose={() => onOpenChange(false)} onCreated={onCreated} />}
    </Modal>
  );
}

function CreateOrderForm({ onClose, onCreated }: { onClose: () => void; onCreated?: (id: string) => void }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [pickedProductId, setPickedProductId] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customer, setCustomer] = useState<{ id: string; name: string } | null>(null);
  const [channel, setChannel] = useState<OrderChannel>("manual");
  const [locationId, setLocationId] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const debouncedProductSearch = useDebouncedValue(productSearch.trim());
  const debouncedCustomerSearch = useDebouncedValue(customerSearch.trim());

  const products = useProducts({ search: debouncedProductSearch || undefined, isActive: true, limit: 8 });
  const picked = useProduct(pickedProductId);
  const customers = useCustomers(
    { search: debouncedCustomerSearch, limit: 5 },
    { enabled: !customer && debouncedCustomerSearch.length > 0 },
  );
  const inventory = useInventory();
  const createOrder = useCreateOrder();

  const locations = useMemo(() => {
    const seen = new Map<string, string>();
    for (const row of inventory.data ?? []) {
      if (!seen.has(row.locationId)) seen.set(row.locationId, row.locationName ?? "Location");
    }
    return [...seen].map(([id, name]) => ({ id, name }));
  }, [inventory.data]);
  const effectiveLocationId = locationId || locations[0]?.id || "";

  const addVariant = (variant: ProductVariant, productName: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === variant.id);
      if (existing) {
        return prev.map((l) =>
          l.variantId === variant.id ? { ...l, quantity: String(Number(l.quantity || 0) + 1) } : l,
        );
      }
      const label = variant.name === productName ? productName : `${productName} — ${variant.name}`;
      return [
        ...prev,
        { variantId: variant.id, label, quantity: "1", unitPrice: (variant.priceKobo / 100).toFixed(2) },
      ];
    });
    setPickedProductId(null);
  };

  const updateLine = (variantId: string, patch: Partial<Line>) =>
    setLines((prev) => prev.map((l) => (l.variantId === variantId ? { ...l, ...patch } : l)));

  const parsedLines = lines.map((l) => ({
    ...l,
    qty: Number(l.quantity),
    priceKobo: nairaToKobo(l.unitPrice),
  }));
  const totalKobo = parsedLines.reduce(
    (sum, l) => sum + (Number.isInteger(l.qty) && l.priceKobo >= 0 ? l.qty * l.priceKobo : 0),
    0,
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (parsedLines.length === 0) {
      setFormError("Add at least one product.");
      return;
    }
    const invalid = parsedLines.find(
      (l) => !Number.isInteger(l.qty) || l.qty < 1 || !Number.isInteger(l.priceKobo) || l.priceKobo < 0,
    );
    if (invalid) {
      setFormError(`Check the quantity and price for "${invalid.label}".`);
      return;
    }

    createOrder.mutate(
      {
        channel,
        items: parsedLines.map((l) => ({ variantId: l.variantId, quantity: l.qty, unitPriceKobo: l.priceKobo })),
        ...(customer && { customerId: customer.id }),
        ...(effectiveLocationId && { locationId: effectiveLocationId }),
        ...(note.trim() && { note: note.trim() }),
      },
      {
        onSuccess: (order) => {
          toast.success(`Order ${order.orderNumber} created`);
          onClose();
          onCreated?.(order.id);
        },
        onError: (err) => setFormError(errorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {/* Product picker */}
      <div>
        <p className="text-xs font-medium text-on-surface mb-1.5">Products</p>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => {
              setProductSearch(e.target.value);
              setPickedProductId(null);
            }}
            placeholder="Search products"
            className={`${INPUT_CLASS} pl-8`}
          />
        </div>

        <div className="mt-2 rounded-lg border border-outline-variant/50 max-h-48 overflow-y-auto">
          {pickedProductId ? (
            <div className="p-2">
              <button
                type="button"
                onClick={() => setPickedProductId(null)}
                className="text-xs text-primary hover:underline mb-1 px-1"
              >
                ← Back to products
              </button>
              {picked.isLoading ? (
                <p className="text-xs text-on-surface-variant p-2">Loading variants…</p>
              ) : picked.error ? (
                <p className="text-xs text-error p-2">{errorMessage(picked.error)}</p>
              ) : (picked.data?.variants ?? []).filter((v) => v.isActive).length === 0 ? (
                <p className="text-xs text-on-surface-variant p-2">
                  This product has no active variants, so it can&apos;t be sold yet.
                </p>
              ) : (
                picked.data!.variants
                  .filter((v) => v.isActive)
                  .map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => addVariant(v, picked.data!.name)}
                      className="w-full flex justify-between items-center text-left text-sm px-2 py-2 rounded-md hover:bg-surface-container-low"
                    >
                      <span>
                        {v.name} <span className="text-xs text-on-surface-variant">· {v.sku}</span>
                      </span>
                      <span className="font-mono text-xs">{formatKobo(v.priceKobo)}</span>
                    </button>
                  ))
              )}
            </div>
          ) : products.isLoading ? (
            <p className="text-xs text-on-surface-variant p-3">Loading products…</p>
          ) : products.error ? (
            <p className="text-xs text-error p-3">{errorMessage(products.error)}</p>
          ) : (products.data?.items ?? []).length === 0 ? (
            <p className="text-xs text-on-surface-variant p-3">
              {debouncedProductSearch ? "No products match that search." : "You haven't added any products yet."}
            </p>
          ) : (
            <div className="p-1">
              {products.data!.items.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPickedProductId(p.id)}
                  className="w-full text-left text-sm px-2 py-2 rounded-md hover:bg-surface-container-low"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Line items */}
      {lines.length > 0 && (
        <div className="rounded-lg border border-outline-variant/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-on-surface-variant bg-surface-container-low/50 text-left">
                <th className="py-2 px-3 font-medium">Item</th>
                <th className="py-2 px-3 font-medium w-20">Qty</th>
                <th className="py-2 px-3 font-medium w-32">Unit price (₦)</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.variantId} className="border-t border-outline-variant/30">
                  <td className="py-2 px-3">{l.label}</td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={l.quantity}
                      onChange={(e) => updateLine(l.variantId, { quantity: e.target.value })}
                      aria-label={`Quantity for ${l.label}`}
                      className={`${INPUT_CLASS} py-1`}
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={l.unitPrice}
                      onChange={(e) => updateLine(l.variantId, { unitPrice: e.target.value })}
                      aria-label={`Unit price for ${l.label}`}
                      className={`${INPUT_CLASS} py-1 font-mono`}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <button
                      type="button"
                      onClick={() => setLines((prev) => prev.filter((x) => x.variantId !== l.variantId))}
                      aria-label={`Remove ${l.label}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between px-3 py-2 border-t border-outline-variant/40 text-sm bg-surface-container-low/30">
            <span className="text-on-surface-variant">Estimated total (before tax)</span>
            <span className="font-mono font-semibold">{formatKobo(totalKobo)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer */}
        <Field label="Customer (optional)" htmlFor="order-customer">
          {customer ? (
            <div className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-surface-container-low">
              <span>{customer.name}</span>
              <button
                type="button"
                onClick={() => setCustomer(null)}
                aria-label="Remove customer"
                className="text-on-surface-variant hover:text-on-surface"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                id="order-customer"
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search name, phone or email"
                autoComplete="off"
                className={INPUT_CLASS}
              />
              {debouncedCustomerSearch && (customers.data?.items.length ?? 0) > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest shadow-lg p-1">
                  {customers.data!.items.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCustomer({ id: c.id, name: [c.firstName, c.lastName].filter(Boolean).join(" ") });
                        setCustomerSearch("");
                      }}
                      className="w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-surface-container-low"
                    >
                      {[c.firstName, c.lastName].filter(Boolean).join(" ")}
                      <span className="text-xs text-on-surface-variant ml-1.5">{c.phone ?? c.email ?? ""}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Field>

        <Field label="Channel" htmlFor="order-channel">
          <select
            id="order-channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value as OrderChannel)}
            className={INPUT_CLASS}
          >
            {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Fulfil from"
          htmlFor="order-location"
          hint={locations.length === 0 && !inventory.isLoading ? "No stock locations yet. You'll need one before confirming." : undefined}
        >
          <select
            id="order-location"
            value={effectiveLocationId}
            onChange={(e) => setLocationId(e.target.value)}
            disabled={locations.length === 0}
            className={INPUT_CLASS}
          >
            {locations.length === 0 && <option value="">—</option>}
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Note (optional)" htmlFor="order-note">
          <input
            id="order-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      {formError && <p className="text-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{formError}</p>}

      <FormActions onCancel={onClose} submitLabel="Create Order" isSubmitting={createOrder.isPending} />
    </form>
  );
}
