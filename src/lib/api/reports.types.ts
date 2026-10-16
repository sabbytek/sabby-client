// Mirrors oniraja-server src/modules/reporting/service.ts. All reports are
// plan-gated: trial tenants get 402 FEATURE_GATED.

export type PLReport = {
  from: string;
  to: string;
  revenueKobo: number;
  cogsKobo: number;
  grossProfitKobo: number;
  operatingExpensesKobo: number;
  paymentFeesKobo: number;
  refundsKobo: number;
  netProfitKobo: number;
};

export type DateRangeQuery = {
  /** ISO 8601 datetime. Required by /reports/pl. */
  from: string;
  to: string;
};

export type BestSellerRow = {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  sku: string;
  totalQuantity: number;
  totalRevenueKobo: number;
};

export type BestSellersQuery = {
  from?: string;
  to?: string;
  limit?: number;
};

export type InventoryValuationRow = {
  variantId: string;
  sku: string;
  productName: string;
  variantName: string;
  locationId: string;
  locationName: string | null;
  quantityOnHand: number;
  unitCostKobo: number;
  totalValueKobo: number;
};

export type InventoryValuation = {
  rows: InventoryValuationRow[];
  totalValueKobo: number;
};
