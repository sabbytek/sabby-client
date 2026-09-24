"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  image: string;
  alt: string;
  quote: string;
  name: string;
  title: string;
  statValue: string;
  statLabel: string;
  statSub: string;
}

const testimonials: Testimonial[] = [
  {
    image: "/images/image-success-story-section/01-success-story-chioma-fashion.png",
    alt: "Chioma Adebayo, Founder of Chioma Fashion",
    quote:
      "Before Sabyy, I was using WhatsApp to take orders, a notebook for inventory, and my bank app to check payments. It was chaos. Now, everything is in one place. I finally have time to focus on growing my brand.",
    name: "Chioma Adebayo",
    title: "Founder, Chioma Fashion",
    statValue: "45%",
    statLabel: "Revenue Increase",
    statSub: "in just 3 months",
  },
  {
    image: "/images/image-success-story-section/02-success-story-ibrahim-grocery.png",
    alt: "Ibrahim Musa, Founder of Ibrahim Grocery",
    quote:
      "Managing stock across three grocery branches used to mean spreadsheets and guesswork. With Sabyy, I can see what's low in real time and reorder before we run out. We haven't lost a sale to an empty shelf in months.",
    name: "Ibrahim Musa",
    title: "Founder, Ibrahim Grocery",
    statValue: "60%",
    statLabel: "Fewer Stockouts",
    statSub: "in just 4 months",
  },
  {
    image: "/images/image-success-story-section/03-success-story-chukwu-elcetronics.png",
    alt: "Chukwu Emeka, Founder of Chukwu Electronics",
    quote:
      "Customers used to ask if we accepted transfers, cards, or USSD. Now Sabyy handles all of it automatically and the money hits my account instantly. It's completely changed how fast we can serve people.",
    name: "Chukwu Emeka",
    title: "Founder, Chukwu Electronics",
    statValue: "3x",
    statLabel: "Faster Checkout",
    statSub: "per transaction",
  },
  {
    image: "/images/image-success-story-section/04-success-story-chinwe-stylist-salon.png",
    alt: "Chinwe Okafor, Founder of Chinwe Stylist Salon",
    quote:
      "My clients now book and pay for appointments right from my Sabyy storefront. I spend less time chasing payments and more time doing what I love: styling.",
    name: "Chinwe Okafor",
    title: "Founder, Chinwe Stylist Salon",
    statValue: "50%",
    statLabel: "More Repeat Bookings",
    statSub: "in just 6 months",
  },
];

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  const t = testimonials[index];

  return (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="w-[85%] aspect-3/2 bg-surface-container rounded-2xl border border-outline-variant/30 relative overflow-visible">
          <img
            alt={t.alt}
            className="absolute inset-0 w-full h-full translate-x-[10%] translate-y-[10%] object-cover rounded-xl shadow-2xl border border-outline-variant/40"
            src={t.image}
          />
        </div>
        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-outline-variant/20 z-20">
          <p className="font-headline-lg text-headline-lg text-primary mb-1">
            {t.statValue}
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            {t.statLabel}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
            {t.statSub}
          </p>
        </div>
      </div>
      <div>
        <Quote className="text-primary mb-6 opacity-50" size={48} />
        <h3 className="font-headline-lg text-headline-lg text-on-surface mb-8 leading-tight min-h-[8rem]">
          &quot;{t.quote}&quot;
        </h3>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-label-md text-label-md text-on-surface text-lg">
              {t.name}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container/10 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container/10 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to ${item.name}'s testimonial`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-primary" : "w-2 bg-outline-variant"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
