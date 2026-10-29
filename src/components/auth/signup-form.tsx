"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { signupMerchant } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/api/types";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your business name").max(100),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Handle must be at least 2 characters")
    .max(50, "Handle must be 50 characters or fewer")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  ownerFirstName: z.string().trim().min(1, "Enter your first name"),
  ownerLastName: z.string().trim().min(1, "Enter your last name"),
  businessEmail: z.string().email("Invalid email address"),
  businessPhone: z.string().trim().optional(),
  ownerPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm your password"),
}).refine((data) => data.ownerPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const INPUT_CLASS =
  "w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-secondary focus:outline-none focus:border-accent";

function PasswordInput({
  show,
  onToggle,
  ...props
}: React.ComponentProps<"input"> & { show: boolean; onToggle: () => void }) {
  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className={`${INPUT_CLASS} pr-11`} />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 px-3 text-secondary hover:text-foreground"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);

    try {
      const result = await signupMerchant({
        name: data.name,
        slug: data.slug,
        businessEmail: data.businessEmail,
        businessPhone: data.businessPhone || undefined,
        ownerFirstName: data.ownerFirstName,
        ownerLastName: data.ownerLastName,
        ownerPassword: data.ownerPassword,
      });
      router.push(`/login?registered=1&handle=${encodeURIComponent(result.slug)}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("That business handle is already taken. Try a different one.");
      } else if (err instanceof ApiError && err.status === 429) {
        setError("Too many signup attempts. Please try again later.");
      } else {
        setError(err instanceof Error ? err.message : "Signup failed");
      }
    }
  };

  const nameField = register("name");

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface border border-border rounded-lg p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
        <p className="text-secondary mb-8">Set up your merchant dashboard</p>

        {error && (
          <div className="mb-6 p-3 bg-danger-bg border border-danger rounded-md">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Business Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="organization"
              {...nameField}
              onChange={(e) => {
                void nameField.onChange(e);
                if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: isSubmitted });
              }}
              placeholder="Fashion Hub"
              className={INPUT_CLASS}
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
              Business Handle
            </label>
            <input
              id="slug"
              type="text"
              autoCapitalize="none"
              spellCheck={false}
              {...register("slug", { onChange: () => setSlugTouched(true) })}
              placeholder="fashion-hub"
              className={INPUT_CLASS}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-secondary">You&apos;ll use this to sign in.</p>
            {errors.slug && <p className="mt-1 text-sm text-danger">{errors.slug.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ownerFirstName" className="block text-sm font-medium text-foreground mb-2">
                First Name
              </label>
              <input
                id="ownerFirstName"
                type="text"
                autoComplete="given-name"
                {...register("ownerFirstName")}
                className={INPUT_CLASS}
                disabled={isSubmitting}
              />
              {errors.ownerFirstName && (
                <p className="mt-1 text-sm text-danger">{errors.ownerFirstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="ownerLastName" className="block text-sm font-medium text-foreground mb-2">
                Last Name
              </label>
              <input
                id="ownerLastName"
                type="text"
                autoComplete="family-name"
                {...register("ownerLastName")}
                className={INPUT_CLASS}
                disabled={isSubmitting}
              />
              {errors.ownerLastName && (
                <p className="mt-1 text-sm text-danger">{errors.ownerLastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="businessEmail" className="block text-sm font-medium text-foreground mb-2">
              Business Email
            </label>
            <input
              id="businessEmail"
              type="email"
              autoComplete="email"
              {...register("businessEmail")}
              placeholder="you@example.com"
              className={INPUT_CLASS}
              disabled={isSubmitting}
            />
            {errors.businessEmail && (
              <p className="mt-1 text-sm text-danger">{errors.businessEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="businessPhone" className="block text-sm font-medium text-foreground mb-2">
              Phone <span className="text-secondary font-normal">(optional)</span>
            </label>
            <input
              id="businessPhone"
              type="tel"
              autoComplete="tel"
              {...register("businessPhone")}
              placeholder="0803 123 4567"
              className={INPUT_CLASS}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="ownerPassword" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <PasswordInput
              id="ownerPassword"
              autoComplete="new-password"
              {...register("ownerPassword")}
              placeholder="••••••••"
              disabled={isSubmitting}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
            {errors.ownerPassword && (
              <p className="mt-1 text-sm text-danger">{errors.ownerPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              {...register("confirmPassword")}
              placeholder="••••••••"
              disabled={isSubmitting}
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-danger">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
