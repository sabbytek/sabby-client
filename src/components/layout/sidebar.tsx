"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Wallet,
  Megaphone,
  Puzzle,
  Grid3x3,
  SlidersHorizontal,
  CreditCard,
  Store,
  TrendingUp,
  HelpCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { label: "Sabyy Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "Sales & Marketing", href: "/dashboard/marketing", icon: Megaphone },
  { label: "Extensions", href: "/dashboard/extensions", icon: Puzzle },
  { label: "More", href: "/dashboard/more", icon: Grid3x3 },
];

const MANAGEMENT_NAV: NavItem[] = [
  { label: "Operations", href: "/dashboard/operations", icon: SlidersHorizontal },
  { label: "Finance", href: "/dashboard/finance", icon: CreditCard },
  { label: "Store Setup", href: "/dashboard/store-setup", icon: Store },
  { label: "Grow With Bumpa", href: "/dashboard/grow", icon: TrendingUp },
];

const FOOTER_NAV: NavItem[] = [
  { label: "Help Center", href: "/dashboard/help", icon: HelpCircle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? "bg-surface-container-low text-primary font-medium"
          : "text-on-surface-variant hover:bg-surface-container-low/60 hover:text-on-surface"
      }`}
    >
      <Icon size={18} strokeWidth={isActive ? 2.25 : 2} />
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden md:flex shrink-0 w-60 h-full flex-col bg-surface-container-lowest border-r border-outline-variant/60">
      {/* Logo */}
      <div className="flex items-center w-full px-4 h-16 border-b border-outline-variant/60">
        <Link href="/dashboard" className="text-[17px] font-semibold tracking-tight text-on-surface">
          Sabyy
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 w-full overflow-y-auto px-2 py-4">
        <ul className="space-y-0.5">
          {MAIN_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} isActive={isItemActive(item.href)} />
            </li>
          ))}
        </ul>

        <div className="mt-6 mb-2 px-3">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant/60 font-medium">
            Management
          </span>
        </div>
        <ul className="space-y-0.5">
          {MANAGEMENT_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} isActive={isItemActive(item.href)} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="w-full px-2 py-3 border-t border-outline-variant/60 space-y-0.5">
        {FOOTER_NAV.map((item) => (
          <NavLink key={item.href} item={item} isActive={isItemActive(item.href)} />
        ))}
      </div>
    </aside>
  );
}
