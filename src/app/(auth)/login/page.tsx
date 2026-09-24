import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
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

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-secondary text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-accent hover:text-accent-hover font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
