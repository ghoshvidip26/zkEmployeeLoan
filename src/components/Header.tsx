"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";

export default function Header() {
  const { login } = useLogin();
  const { ready, authenticated, user, logout } = usePrivy();
  console.log("User:", user);

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black/70 backdrop-blur-md"
      role="banner"
      aria-label="Site Header"
    >
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 text-white font-bold text-xl">
        <div className="relative">
          <div className="w-8 h-8 bg-green-500 rounded transform rotate-12"></div>
          <div className="absolute top-0 left-0 w-8 h-8 bg-black border-2 border-green-500 rounded transform -rotate-12"></div>
        </div>
        <span className="text-white">zkVerify</span>
      </div>
    </header>
  );
}
