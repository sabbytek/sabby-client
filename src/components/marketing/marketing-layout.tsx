import Link from "next/link";
import { Database } from "lucide-react";
import type { ReactNode } from "react";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md full-width top-0 sticky z-50 h-[72px] border-b border-outline-variant/30 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between px-gutter max-w-container-max mx-auto w-full h-full">
          <div className="flex items-center gap-unit-lg">
            <Link
              className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2"
              href="/"
            >
              <Database size={22} />
              Sabyy
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-unit-md">
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-primary-container/10" href="/#features">Product</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-primary-container/10" href="/#features">Features</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-primary-container/10" href="/about">About</Link>
          </div>
          <div className="flex items-center gap-unit-md">
            <Link
              className="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="/login"
            >
              Log in
            </Link>
            <Link
              className="bg-primary-container text-white font-label-md text-label-md px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              href="/login"
            >
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      <main className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-white">
        {children}
      </main>

      <footer className="bg-surface dark:bg-inverse-surface border-t border-outline-variant/30">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-unit-lg py-unit-xl px-gutter max-w-container-max mx-auto">
          <div className="col-span-2 lg:col-span-2">
            <Link
              className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface mb-4 flex items-center gap-2"
              href="/"
            >
              <Database size={20} />
              Sabyy
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 max-w-xs">
              One platform to manage orders, inventory, customers, and payments.
              Everything you need to scale.
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              © {new Date().getFullYear()} Sabyy Technologies. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/#features">Storefront</Link></li>
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/#features">Payments</Link></li>
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/#features">Inventory</Link></li>
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/#features">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link></li>
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/careers">Careers</Link></li>
              <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="mailto:sabbytek@gmail.com">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/privacy#terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
