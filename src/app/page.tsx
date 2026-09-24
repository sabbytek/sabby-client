import {
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Database,
  Headphones,
  LineChart,
  Network,
  Package,
  PlayCircle,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { TestimonialCarousel } from "@/components/landing/testimonial-carousel";

export default function LandingPage() {
  return (
    <>
      {/* TopNavBar */}
      <nav className="bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md full-width top-0 sticky z-50 h-[72px] border-b border-outline-variant/30 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between px-gutter max-w-container-max mx-auto w-full h-full">
          <div className="flex items-center gap-unit-lg">
            <a
              className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2"
              href="#"
            >
              <Database size={22} />
              Sabyy
            </a>
          </div>
          <div className="hidden md:flex items-center gap-unit-md">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-primary-container/10"
              href="#"
            >
              Product
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-primary-container/10"
              href="#"
            >
              Solutions
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-primary-container/10"
              href="#"
            >
              Features
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-primary-container/10"
              href="#"
            >
              Pricing
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-primary-container/10"
              href="#"
            >
              Resources
            </a>
          </div>
          <div className="flex items-center gap-unit-md">
            <a
              className="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Log in
            </a>
            <a
              className="bg-primary-container text-white font-label-md text-label-md px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              href="#"
            >
              Start for free
            </a>
          </div>
        </div>
      </nav>

      <main className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-gutter overflow-hidden">
        <div className="ambient-glow top-0 left-1/2 -translate-x-1/2"></div>
        <div className="max-w-container-max mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 text-primary font-label-sm text-label-sm mb-6 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            Built for ambitious African businesses
          </div>
          <h1 className="font-headline-xl text-headline-xl md:text-[64px] md:leading-[72px] text-on-surface max-w-4xl mx-auto mb-6 tracking-tight">
            Your entire business.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              One powerful command center.
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            From storefront to inventory, payments to analytics. Sabyy brings
            everything you need to sell, manage, and grow into one connected
            platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              className="w-full sm:w-auto bg-primary-container text-white font-label-md text-label-md px-8 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              href="#"
            >
              Start for free
              <ArrowRight size={18} />
            </a>
            <a
              className="w-full sm:w-auto bg-white text-on-surface font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-surface-container transition-colors border border-outline-variant flex items-center justify-center gap-2"
              href="#"
            >
              <PlayCircle size={18} />
              Watch the demo
            </a>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 max-w-2xl mx-auto relative z-10">
          <div className="relative rounded-xl border border-outline-variant/50 bg-white/50 backdrop-blur-sm p-2 shadow-2xl shadow-on-surface/5">
            <div className="rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container-lowest">
              <img
                alt="Sabyy Dashboard Interface"
                className="w-full h-auto max-h-105 object-contain rounded-lg mx-auto"
                src="/images/image-hero-section/04-hero-dashboard.png"
              />
            </div>
            {/* Floating Cards */}
            <div className="absolute -right-6 top-1/4 bg-white p-4 rounded-lg shadow-xl border border-outline-variant/20 hidden md:flex items-center gap-4 animate-[bounce_4s_infinite]">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <Wallet size={20} />
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Recent Sale
                </p>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  ₦25,000
                </p>
              </div>
            </div>
            <div className="absolute -left-6 bottom-1/4 bg-white p-4 rounded-lg shadow-xl border border-outline-variant/20 hidden md:flex items-center gap-4 animate-[bounce_5s_infinite]">
              <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                <Package size={20} />
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Inventory Alert
                </p>
                <p className="font-label-md text-label-md text-on-surface">
                  Low stock: Sneakers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-outline-variant/30 bg-surface-container-lowest/50">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-8">
            Trusted by leading Nigerian merchants
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-headline-md text-headline-md font-bold text-on-surface-variant">
              Chioma Fashion
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface-variant">
              Lagos Tech
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface-variant">
              Abuja Grocers
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface-variant">
              Naija Kicks
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface-variant">
              Beauty Box
            </span>
          </div>
        </div>
      </section>

      {/* Integrated Ecosystem */}
      <section className="py-24 px-gutter relative overflow-hidden bg-surface">
        <div className="ambient-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-container-max mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
              Everything your business needs. <br /> Connected in one place.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Stop juggling 7 different tools to run your business. Sabyy
              centralizes your operations, so a sale in your storefront
              automatically updates inventory and reflects in your analytics.
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto h-[600px] flex items-center justify-center">
            {/* Connecting SVG Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="path-animated"
                d="M 450 300 L 200 150"
                fill="none"
                stroke="#d2bbff"
                strokeWidth="2"
              ></path>
              <path
                className="path-animated"
                d="M 450 300 L 700 150"
                fill="none"
                stroke="#d2bbff"
                strokeWidth="2"
              ></path>
              <path
                className="path-animated"
                d="M 450 300 L 150 400"
                fill="none"
                stroke="#d2bbff"
                strokeWidth="2"
              ></path>
              <path
                className="path-animated"
                d="M 450 300 L 750 400"
                fill="none"
                stroke="#d2bbff"
                strokeWidth="2"
              ></path>
              <path
                className="path-animated"
                d="M 450 300 L 450 100"
                fill="none"
                stroke="#d2bbff"
                strokeWidth="2"
              ></path>
              <path
                className="path-animated"
                d="M 450 300 L 450 500"
                fill="none"
                stroke="#d2bbff"
                strokeWidth="2"
              ></path>
            </svg>
            {/* Center Hub */}
            <div className="absolute w-32 h-32 bg-primary text-white rounded-full flex flex-col items-center justify-center shadow-xl shadow-primary/30 z-10 animate-[pulse_4s_infinite]">
              <Database size={40} className="mb-1" />
              <span className="font-label-md text-label-md">Sabyy Hub</span>
            </div>
            {/* Nodes */}
            <div className="absolute top-[10%] left-[20%] w-24 h-24 bg-white border border-outline-variant rounded-2xl flex flex-col items-center justify-center shadow-lg z-10 transition-transform hover:scale-110">
              <Store className="text-primary mb-1" size={22} />
              <span className="font-label-sm text-label-sm text-on-surface">
                Storefront
              </span>
            </div>
            <div className="absolute top-[5%] left-[50%] -translate-x-1/2 w-24 h-24 bg-white border border-outline-variant rounded-2xl flex flex-col items-center justify-center shadow-lg z-10 transition-transform hover:scale-110">
              <ShoppingBag className="text-primary mb-1" size={22} />
              <span className="font-label-sm text-label-sm text-on-surface">
                Products
              </span>
            </div>
            <div className="absolute top-[10%] right-[20%] w-24 h-24 bg-white border border-outline-variant rounded-2xl flex flex-col items-center justify-center shadow-lg z-10 transition-transform hover:scale-110">
              <Receipt className="text-primary mb-1" size={22} />
              <span className="font-label-sm text-label-sm text-on-surface">
                Orders
              </span>
            </div>
            <div className="absolute bottom-[20%] left-[15%] w-24 h-24 bg-white border border-outline-variant rounded-2xl flex flex-col items-center justify-center shadow-lg z-10 transition-transform hover:scale-110">
              <Wallet className="text-primary mb-1" size={22} />
              <span className="font-label-sm text-label-sm text-on-surface">
                Payments
              </span>
            </div>
            <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 w-24 h-24 bg-white border border-outline-variant rounded-2xl flex flex-col items-center justify-center shadow-lg z-10 transition-transform hover:scale-110">
              <Package className="text-primary mb-1" size={22} />
              <span className="font-label-sm text-label-sm text-on-surface">
                Inventory
              </span>
            </div>
            <div className="absolute bottom-[20%] right-[15%] w-24 h-24 bg-white border border-outline-variant rounded-2xl flex flex-col items-center justify-center shadow-lg z-10 transition-transform hover:scale-110">
              <LineChart className="text-primary mb-1" size={22} />
              <span className="font-label-sm text-label-sm text-on-surface">
                Analytics
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep-Dives */}
      <section className="py-24 px-gutter bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto space-y-32">
          {/* Sell Everywhere */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 w-[85%] h-85 bg-surface-container rounded-2xl border border-outline-variant/50 relative overflow-visible">
              <img
                alt="Sabyy Storefront Interface"
                className="absolute inset-0 w-full h-full translate-x-[10%] translate-y-[10%] object-cover object-top rounded-xl shadow-2xl border border-outline-variant/40"
                src="/images/image-storefront/storefront-image-1.png"
              />
            </div>
            <div className="order-1 md:order-2">
              <span className="text-primary font-label-md text-label-md uppercase tracking-wider mb-2 block">
                Sell Everywhere
              </span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                Launch your beautiful online store in minutes.
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                No coding required. Choose a template, add your products, and
                start selling globally. Mobile-optimized checkout ensures you
                never lose a sale.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-on-surface-variant font-body-md">
                  <CheckCircle2 className="text-primary" size={20} /> Custom
                  domains
                </li>
                <li className="flex items-start gap-2 text-on-surface-variant font-body-md">
                  <CheckCircle2 className="text-primary" size={20} />{" "}
                  Mobile-first design
                </li>
                <li className="flex items-start gap-2 text-on-surface-variant font-body-md">
                  <CheckCircle2 className="text-primary" size={20} /> SEO
                  optimized
                </li>
              </ul>
              <a
                className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline"
                href="#"
              >
                Explore Storefronts <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Get Paid Instantly */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-label-md text-label-md uppercase tracking-wider mb-2 block">
                Get Paid Instantly
              </span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                Accept payments seamlessly, anywhere.
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                Give your customers the flexibility to pay how they want. From
                local bank transfers and mobile money to international cards.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-on-surface-variant font-body-md">
                  <CheckCircle2 className="text-primary" size={20} />{" "}
                  Automated invoicing
                </li>
                <li className="flex items-start gap-2 text-on-surface-variant font-body-md">
                  <CheckCircle2 className="text-primary" size={20} />{" "}
                  Multi-currency support
                </li>
                <li className="flex items-start gap-2 text-on-surface-variant font-body-md">
                  <CheckCircle2 className="text-primary" size={20} /> Instant
                  payout options
                </li>
              </ul>
            </div>
            <div className="w-[85%] h-85 bg-surface-container rounded-2xl border border-outline-variant/50 relative overflow-visible ml-auto">
              <img
                alt="Sabyy Payments Interface"
                className="absolute inset-0 w-full h-full translate-x-[-10%] translate-y-[10%] object-cover object-top rounded-xl shadow-2xl border border-outline-variant/40"
                src="/images/image-feature-section/01-payment-screen.png"
              />
            </div>
          </div>

          {/* Understand Your Business */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-primary font-label-md text-label-md uppercase tracking-wider mb-2 block">
              Understand Your Business
            </span>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              Insights that drive growth.
            </h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Don&apos;t guess. Know exactly what&apos;s selling, who&apos;s buying, and where
              your money is going with enterprise-grade analytics built for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-outline-variant/40 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Total Revenue
                </span>
                <TrendingUp className="text-primary" size={20} />
              </div>
              <h4 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                ₦1.2M
              </h4>
              <p className="font-label-sm text-label-sm text-green-600 flex items-center gap-1">
                <ArrowUp size={16} /> +15% this month
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-outline-variant/40 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Active Customers
                </span>
                <Users className="text-primary" size={20} />
              </div>
              <h4 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                842
              </h4>
              <p className="font-label-sm text-label-sm text-green-600 flex items-center gap-1">
                <ArrowUp size={16} /> +42 new today
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-outline-variant/40 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Top Product
                </span>
                <Star className="text-primary" size={20} />
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-2">
                Air Max 90s
              </h4>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                124 units sold
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Feature Grid */}
      <section className="py-24 px-gutter bg-surface">
        <div className="max-w-container-max mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              Everything else you need to scale
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Packed with powerful tools, yet simple to use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Large Card */}
            <div className="md:col-span-2 bg-surface-container-high rounded-2xl p-8 border border-outline-variant/40 flex flex-col justify-between overflow-hidden relative group">
              <div className="z-10 relative">
                <Smartphone className="text-primary mb-4" size={30} />
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  Powerful Mobile App
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  Manage your entire business on the go. Get push notifications
                  for new sales and low stock alerts.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white rounded-xl shadow-2xl border border-outline-variant/20 transform rotate-12 transition-transform group-hover:rotate-6"></div>
            </div>
            {/* Standard Card */}
            <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <ShieldCheck className="text-primary mb-4" size={30} />
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  Bank-grade Security
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your data and money are protected with state-of-the-art
                encryption.
              </p>
            </div>
            {/* Standard Card */}
            <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <Headphones className="text-primary mb-4" size={30} />
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  24/7 Support
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Real human help whenever you need it. We&apos;re invested in your
                success.
              </p>
            </div>
            {/* Large Card */}
            <div className="md:col-span-2 bg-surface-container-high rounded-2xl p-8 border border-outline-variant/40 flex flex-col justify-between overflow-hidden relative">
              <div className="z-10 relative">
                <Network className="text-primary mb-4" size={30} />
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  Multiple Store Locations
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  Easily manage inventory and staff across multiple physical
                  locations from one unified dashboard.
                </p>
              </div>
              <div className="absolute top-1/2 right-10 -translate-y-1/2 flex gap-4 opacity-50">
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-outline-variant/30 flex items-center justify-center">
                  <Store className="text-primary" size={22} />
                </div>
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-outline-variant/30 flex items-center justify-center mt-8">
                  <Store className="text-primary" size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-gutter bg-surface-container-lowest border-y border-outline-variant/30 relative overflow-hidden">
        <div className="ambient-glow-secondary bottom-0 right-0"></div>
        <div className="max-w-container-max mx-auto relative z-10">
          <TestimonialCarousel />
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-32 px-gutter relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="ambient-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-6">
            Ready to run your business differently?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Join thousands of businesses streamlining their operations and
            boosting their sales with Sabyy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              className="w-full sm:w-auto bg-primary text-white font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              href="#"
            >
              Start for free
              <ArrowRight size={18} />
            </a>
            <a
              className="w-full sm:w-auto bg-white text-on-surface font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-surface-container transition-colors border border-outline-variant flex items-center justify-center gap-2"
              href="#"
            >
              Talk to Sales
            </a>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-6">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface dark:bg-inverse-surface border-t border-outline-variant/30">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-unit-lg py-unit-xl px-gutter max-w-container-max mx-auto">
          <div className="col-span-2 lg:col-span-2">
            <a
              className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface mb-4 block flex items-center gap-2"
              href="#"
            >
              <Database size={20} />
              Sabyy
            </a>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 max-w-xs">
              One platform to manage orders, inventory, customers, and payments.
              Everything you need to scale.
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              © 2026 Sabyy Technologies. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Storefront
                </a>
              </li>
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Payments
                </a>
              </li>
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Inventory
                </a>
              </li>
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Analytics
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}
