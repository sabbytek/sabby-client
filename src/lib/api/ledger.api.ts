import { request } from "@/lib/api/_transport";
import type { WalletBalance } from "@/lib/api/ledger.types";

export function getWalletBalance(): Promise<WalletBalance> {
  return request<WalletBalance>({
    path: "/v1/ledger/wallet",
    method: "GET",
    mock: { balanceKobo: 0, balanceNaira: "0.00" },
  });
}
