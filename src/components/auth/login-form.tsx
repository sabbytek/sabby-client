"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/auth-context";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLocalError(null);

    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setLocalError(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface border border-border rounded-lg p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-secondary mb-8">Sign in to your merchant dashboard</p>

        {(authError || localError) && (
          <div className="mb-6 p-3 bg-danger-bg border border-danger rounded-md">
            <p className="text-danger text-sm">{authError || localError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-secondary focus:outline-none focus:border-accent"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-secondary focus:outline-none focus:border-accent"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-accent-light rounded-md border border-accent-soft">
          <p className="text-sm text-foreground font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-secondary">Email: merchant@sabyy.app</p>
          <p className="text-xs text-secondary">Password: anything (mock)</p>
        </div>
      </div>
    </div>
  );
}
