import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center p-4">
      <div className="w-full">
        {/* Logo / Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-block mb-8">
            <div className="text-4xl font-bold text-accent">Sabyy</div>
          </Link>
          <p className="text-secondary">Merchant Dashboard</p>
        </div>

        {/* Signup Form */}
        <SignupForm />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-secondary text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
