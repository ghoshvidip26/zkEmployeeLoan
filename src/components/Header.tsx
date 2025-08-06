"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

export default function Header() {
  const { login } = useLogin();
  const { ready, authenticated, user, logout } = usePrivy();

  return (
    <header
      className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 border-b border-green-500/20 bg-black/80 backdrop-blur-xl shadow-2xl"
      role="banner"
      aria-label="Site Header"
    >
      {/* Enhanced Logo */}
      <Link href="/" className="flex items-center gap-4 group">
        <div className="flex items-center gap-4 text-white font-bold text-2xl">
          <div className="relative group-hover:scale-110 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-yellow-400 to-green-600 rounded-2xl rotate-12 animate-float"></div>
            <div className="absolute top-0 left-0 w-12 h-12 bg-black border-2 border-yellow-400 rounded-2xl -rotate-12 flex items-center justify-center">
              <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                zk
              </span>
            </div>
          </div>
          <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text group-hover:scale-105 transition-transform duration-300">
            zkEmployeeLoan
          </span>
        </div>
      </Link>

      {/* Navigation Menu */}
      {ready && authenticated && (
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/organization"
            className="text-gray-300 hover:text-green-400 transition-colors duration-300 font-medium hover:scale-105 transform"
          >
            Organization
          </Link>
          <Link
            href="/employee"
            className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium hover:scale-105 transform"
          >
            Employee Portal
          </Link>
        </nav>
      )}

      {/* Enhanced Auth Section */}
      <div className="flex items-center gap-4 text-white">
        {ready ? (
          authenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-500/20 to-yellow-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300 font-medium">
                  {user.email?.address?.slice(0, 20) ??
                    user.wallet?.address?.slice(0, 8) ??
                    "Logged In"}
                  {((user.email?.address?.length || 0) > 20 ||
                    (user.wallet?.address?.length || 0) > 8) &&
                    "..."}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-400 hover:to-red-500 transition-all duration-300 text-sm font-semibold transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 text-black hover:from-yellow-400 hover:via-green-400 hover:to-yellow-500 transition-all duration-300 text-sm font-bold transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
            >
              Connect Wallet
            </button>
          )
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        )}
      </div>
    </header>
  );
}
