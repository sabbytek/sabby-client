import { format, parseISO } from "date-fns";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

/** Backend money is integer kobo. Convert only here, at render time. */
export function formatKobo(kobo: number | null | undefined): string {
  return nairaFormatter.format((kobo ?? 0) / 100);
}

/** Parses a Naira amount typed by a user ("1,250.50") into integer kobo. */
export function nairaToKobo(input: string | number): number {
  const naira = typeof input === "number" ? input : Number(input.replace(/[,\s₦]/g, ""));
  if (!Number.isFinite(naira)) return NaN;
  return Math.round(naira * 100);
}

export function formatDate(iso: string | null | undefined, pattern = "d MMM yyyy"): string {
  if (!iso) return "—";
  return format(parseISO(iso), pattern);
}

export function formatDateTime(iso: string | null | undefined): string {
  return formatDate(iso, "d MMM yyyy, h:mm a");
}

export function formatCount(n: number | null | undefined): string {
  return new Intl.NumberFormat("en-NG").format(n ?? 0);
}
