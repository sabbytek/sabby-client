import { ArrowRight, Briefcase, Globe, Heart, Zap } from "lucide-react";

export const metadata = {
  title: "Careers — Sabyy",
  description: "Help us build the operating system for African commerce.",
};

const PERKS = [
  { icon: Globe, title: "Remote-first", body: "Work from anywhere in Africa. We have team members across Lagos, Abuja, Accra, and Nairobi." },
  { icon: Zap, title: "Move fast", body: "Small team, big impact. Your work ships to real merchants within days, not quarters." },
  { icon: Heart, title: "Meaningful work", body: "Every feature you build helps a real business owner spend less time on admin and more time growing." },
  { icon: Briefcase, title: "Competitive pay", body: "Market-rate salaries benchmarked against top African tech companies, paid in your local currency." },
];

const ROLES = [
  {
    title: "Senior Backend Engineer",
    team: "Engineering",
    type: "Full-time · Remote",
    description: "Own and scale our core API — payments, inventory, and multi-tenant architecture. Node.js, TypeScript, PostgreSQL.",
  },
  {
    title: "Product Designer",
    team: "Design",
    type: "Full-time · Remote",
    description: "Design intuitive experiences for merchants who may be using business software for the first time. Figma, design systems, user research.",
  },
  {
    title: "Frontend Engineer",
    team: "Engineering",
    type: "Full-time · Remote",
    description: "Build the merchant dashboard and storefront builder. React, Next.js, TypeScript, Tailwind.",
  },
  {
    title: "Growth & Partnerships",
    team: "Growth",
    type: "Full-time · Lagos",
    description: "Drive merchant acquisition through partnerships with trade associations, logistics companies, and payment providers across Nigeria.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-gutter overflow-hidden">
        <div className="ambient-glow top-0 left-1/2 -translate-x-1/2"></div>
        <div className="max-w-container-max mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 text-primary font-label-sm text-label-sm mb-6 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            We&apos;re hiring
          </div>
          <h1 className="font-headline-xl text-headline-xl md:text-[56px] md:leading-[64px] text-on-surface max-w-3xl mx-auto mb-6 tracking-tight">
            Help us build the future of African commerce.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            We&apos;re a small team with a big mission. If you want your work to matter — to real people, running real businesses — you&apos;ll fit right in.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 px-gutter bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">Why Sabyy</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title} className="bg-surface rounded-2xl border border-outline-variant/40 p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{perk.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{perk.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 px-gutter bg-surface">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-10">Open roles</h2>
          <div className="space-y-4">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{role.title}</h3>
                    <span className="rounded-full bg-primary-container/10 text-primary font-label-sm text-label-sm px-2.5 py-0.5">{role.team}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{role.type}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">{role.description}</p>
                </div>
                <a
                  href={`mailto:sabbytek@gmail.com?subject=Application: ${encodeURIComponent(role.title)}`}
                  className="shrink-0 inline-flex items-center gap-2 bg-primary text-white font-label-md text-label-md px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Apply <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't see your role */}
      <section className="py-20 px-gutter bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Don&apos;t see your role?</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            We&apos;re always interested in exceptional people. Send us a note about what you do and why you want to work on African commerce.
          </p>
          <a
            href="mailto:sabbytek@gmail.com?subject=General Application"
            className="inline-flex items-center gap-2 bg-primary text-white font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Get in touch <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
