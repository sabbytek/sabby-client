// Mirrors oniraja-server src/modules/ledger/controller.ts.

/** Balance of the cash account (code 1000). */
export type WalletBalance = {
  balanceKobo: number;
  /** Pre-formatted decimal string, e.g. "1250.00". Prefer balanceKobo. */
  balanceNaira: string;
};
