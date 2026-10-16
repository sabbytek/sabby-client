// Mirrors oniraja-server src/modules/inventory (service.ts listInventory / getLowStock).

export type InventoryLevel = {
  id: string;
  variantId: string;
  locationId: string;
  quantityOnHand: number;
  lowStockThreshold: number;
  updatedAt: string;
  variantSku: string | null;
  variantName: string | null;
  locationName: string | null;
};

export type ListInventoryQuery = {
  locationId?: string;
  variantId?: string;
};

export type ReceiveStockRequest = {
  variantId: string;
  locationId: string;
  quantity: number;
  note?: string;
};
