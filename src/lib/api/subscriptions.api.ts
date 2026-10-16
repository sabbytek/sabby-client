import { request } from "@/lib/api/_transport";
import type { Subscription } from "@/lib/api/subscriptions.types";

export function getSubscription(): Promise<Subscription> {
  return request<Subscription>({
    path: "/v1/subscriptions",
    method: "GET",
  });
}
