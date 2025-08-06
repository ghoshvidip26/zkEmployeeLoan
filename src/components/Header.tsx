"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

export default function Header() {
  const { login } = useLogin();
  const { ready, authenticated, user, logout } = usePrivy();

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black/70 backdrop-blur-md"
      role="banner"
      aria-label="Site Header"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded rotate-12"></div>
            <div className="absolute top-0 left-0 w-8 h-8 bg-black border-2 border-green-500 rounded -rotate-12"></div>
          </div>
          <span>zkVerify</span>
        </div>
      </Link>

      {/* Auth Section */}
      <div className="flex items-center gap-4 text-white">
        {ready ? (
          authenticated && user ? (
            <>
              <span className="text-sm text-gray-300 hidden sm:inline">
                {user.email?.address ?? user.wallet?.address ?? "Logged In"}
              </span>
              <button
                onClick={logout}
                className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="px-4 py-1 rounded bg-green-600 hover:bg-green-700 transition text-sm"
            >
              Login
            </button>
          )
        ) : (
          <span className="text-sm text-gray-400">Loading...</span>
        )}
      </div>
    </header>
  );
}
