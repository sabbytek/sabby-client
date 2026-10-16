import { request } from "@/lib/api/_transport";
import type { Subscription } from "@/lib/api/subscriptions.types";

export function getSubscription(): Promise<Subscription> {
  const trialEnd = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString();
  return request<Subscription>({
    path: "/v1/subscriptions",
    method: "GET",
    mock: {
      id: "sub_mock",
      planTier: "trial",
      status: "trial",
      currentPeriodStart: null,
      currentPeriodEnd: null,
      trialEndsAt: trialEnd,
      cancelledAt: null,
      createdAt: trialEnd,
      updatedAt: trialEnd,
    },
  });
}
