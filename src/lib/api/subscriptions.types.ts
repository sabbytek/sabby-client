// Mirrors the tenant `subscriptions` table returned by GET /v1/subscriptions.

export type PlanTier = "trial" | "entry" | "growth" | "enterprise";

export type SubscriptionStatus = "trial" | "active" | "grace" | "lapsed" | "cancelled";

export type Subscription = {
  id: string;
  planTier: PlanTier;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};
