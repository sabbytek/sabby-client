// Mirrors oniraja-server src/modules/orders (validators.ts, service.ts) and
// the `orders` / `order_items` tables in src/shared/db/schema/tenant.ts.

export type OrderStatus =
  | "draft"
  | "confirmed"
  | "processing"
  | "fulfilled"
  | "dispatched"
  | "cancelled"
  | "refunded";

/** Statuses the list endpoint accepts as a filter (no "dispatched"). */
export type OrderStatusFilter = Exclude<OrderStatus, "dispatched">;

export type OrderChannel = "website" | "pos" | "whatsapp" | "manual";

export type PaymentStatus =
  | "pending"
  | "initiated"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type DispatchStatus =
  | "pending"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "failed"
  | "returned";

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string | null;
  locationId: string | null;
  assignedTo: string | null;
  status: OrderStatus;
  channel: OrderChannel;
  subtotalKobo: number;
  discountKobo: number;
  taxKobo: number;
  totalKobo: number;
  note: string | null;
  paymentStatus: PaymentStatus;
  fulfilledAt: string | null;
  cancelledAt: string | null;
  shippingMethodId: string | null;
  pickupLocationId: string | null;
  destinationState: string | null;
  merchantShippingCostKobo: number;
  deliveryAddress: string | null;
  deliveryFeeKobo: number;
  logisticsProvider: string | null;
  logisticsReference: string | null;
  trackingNumber: string | null;
  estimatedDeliveryAt: string | null;
  dispatchedAt: string | null;
  dispatchStatus: DispatchStatus | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  unitPriceKobo: number;
  discountKobo: number;
  taxKobo: number;
  lineTotalKobo: number;
  createdAt: string;
};

export type OrderWithItems = Order & { items: OrderItem[] };

export type ListOrdersQuery = {
  page?: number;
  limit?: number;
  status?: OrderStatusFilter;
  channel?: OrderChannel;
  /** ISO timestamp, inclusive lower bound on createdAt. */
  from?: string;
  /** ISO timestamp, inclusive upper bound on createdAt. */
  to?: string;
};

export type CreateOrderItem = {
  variantId: string;
  quantity: number;
  unitPriceKobo: number;
  discountKobo?: number;
  taxKobo?: number;
};

export type CreateOrderRequest = {
  customerId?: string;
  locationId?: string;
  assignedTo?: string;
  channel?: OrderChannel;
  items: CreateOrderItem[];
  discountKobo?: number;
  taxKobo?: number;
  note?: string;
};

export type OrderTransition = "confirm" | "process" | "fulfil" | "cancel";
