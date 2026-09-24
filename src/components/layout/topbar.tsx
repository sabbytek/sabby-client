"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Bell } from "lucide-react";

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="bg-surface-container-lowest/90 backdrop-blur-md text-sm sticky top-0 w-full z-10 border-b border-outline-variant/60 flex justify-between items-center h-16 px-6">
      {/* Left Section */}
      <div className="flex items-center gap-1.5 text-on-surface-variant text-sm">
        <MapPin size={16} />
        <span>{user?.merchant_name || "Headquarters"}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="text-on-surface text-sm font-medium px-3.5 py-1.5 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low transition-colors"
        >
          Point of Sale
        </button>
        <Link
          href="/"
          className="bg-primary text-on-primary text-sm font-medium px-3.5 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          View Store
        </Link>

        <div className="flex items-center gap-1 ml-2 pl-4 border-l border-outline-variant/60">
          <button
            type="button"
            className="text-on-surface-variant hover:text-on-surface transition-colors w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low"
          >
            <Bell size={18} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-surface-container-low ml-1 flex items-center justify-center overflow-hidden cursor-pointer border border-outline-variant/60"
            >
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={user.name}
                  className="w-full h-full object-cover"
                  src={user.avatar}
                />
              ) : (
                <span className="text-on-surface-variant text-xs font-medium">
                  {user?.name?.charAt(0) || "U"}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-surface-container-lowest border border-outline-variant/60 rounded-lg shadow-lg z-10 overflow-hidden py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/dashboard/settings");
                  }}
                  className="block w-full text-left px-3.5 py-2 text-sm text-on-surface hover:bg-surface-container-low transition"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/dashboard/profile");
                  }}
                  className="block w-full text-left px-3.5 py-2 text-sm text-on-surface hover:bg-surface-container-low transition"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-3.5 py-2 text-sm text-error hover:bg-error-container/30 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
