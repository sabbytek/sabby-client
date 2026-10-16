import { ArrowRight, Heart, Lightbulb, Shield, Users, Zap } from "lucide-react";

export const metadata = {
  title: "About Us — Sabyy",
  description: "We're building the operating system for African commerce.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Merchant-first",
    body: "Every decision starts with one question: does this make life easier for the business owner? We build for the person behind the counter, not the investor deck.",
  },
  {
    icon: Zap,
    title: "Speed matters",
    body: "African businesses move fast. Our platform is built to keep up — fast load times, instant sync, and zero downtime during your busiest hours.",
  },
  {
    icon: Shield,
    title: "Trust is earned",
    body: "We handle your money and your customers' data. We take that seriously. Bank-grade encryption, transparent pricing, and no hidden fees — ever.",
  },
  {
    icon: Lightbulb,
    title: "Built for context",
    body: "We didn't copy a Silicon Valley playbook. We built for Nigerian internet speeds, local payment rails, and the realities of running a business in Africa.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-gutter overflow-hidden">
        <div className="ambient-glow top-0 left-1/2 -translate-x-1/2"></div>
        <div className="max-w-container-max mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 text-primary font-label-sm text-label-sm mb-6 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            Our story
          </div>
          <h1 className="font-headline-xl text-headline-xl md:text-[56px] md:leading-[64px] text-on-surface max-w-3xl mx-auto mb-6 tracking-tight">
            We&apos;re building the operating system for African commerce.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Sabyy was born from a simple frustration: great African businesses were being held back by tools that weren&apos;t built for them. We decided to fix that.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-gutter bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">How it started</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            In 2023, our founders watched a Lagos fashion retailer lose a day&apos;s revenue because her inventory app, payment processor, and WhatsApp order system couldn&apos;t talk to each other. She was running three phones and a notebook to manage what should have been one dashboard.
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            That retailer wasn&apos;t an edge case. Across Nigeria, Ghana, and Kenya, millions of ambitious merchants were stitching together tools designed for businesses in San Francisco or London — tools that didn&apos;t understand local payment rails, didn&apos;t work on 3G, and charged in dollars.
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Sabyy is our answer. One platform that handles storefront, inventory, orders, payments, staff, and analytics — built from the ground up for the African merchant. No workarounds. No duct tape. Just a business that runs.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-gutter bg-surface relative overflow-hidden">
        <div className="ambient-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="bg-primary rounded-2xl p-12 md:p-16 text-center text-white">
            <p className="font-label-sm text-label-sm uppercase tracking-widest mb-4 opacity-70">Our mission</p>
            <h2 className="font-headline-xl text-headline-xl md:text-[40px] md:leading-[48px] max-w-2xl mx-auto">
              To give every African business the tools that were previously only available to the biggest ones.
            </h2>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-gutter bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">What we believe</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">The principles that guide every line of code we write.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-surface rounded-2xl border border-outline-variant/40 p-8">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{v.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{v.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-gutter bg-surface">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">The team</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              A small, focused team of engineers, designers, and operators who have built and run businesses across Africa.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Sabby Technologies", role: "Founding Team", location: "Lagos, Nigeria" },
            ].map((member) => (
              <div key={member.name} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mb-4">
                  <Users size={28} />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">{member.name}</h3>
                <p className="font-body-sm text-body-sm text-primary mt-1">{member.role}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{member.location}</p>
              </div>
            ))}
          </div>
          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-10">
            We&apos;re growing. Check out our{" "}
            <a href="/careers" className="text-primary hover:underline">open roles</a>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-gutter bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Ready to see it in action?</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            Start your free trial today. No credit card required.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-primary text-white font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Get started free <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
