"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Hero() {
  const { login } = useLogin();
  const { ready, authenticated, user } = usePrivy();

  const hasPosted = useRef(false);
  useEffect(() => {
    const sendUserData = async () => {
      if (authenticated && user && !hasPosted.current) {
        hasPosted.current = true;
        try {
          await axios.post("/api/user", {
            id: user.id,
            email: user.email?.address,
          });
        } catch (err) {
          console.error("Error sending user data:", err);
        }
      }
    };

    sendUserData();
  }, [authenticated, user]);

  const handleLogin = () => login();

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden min-h-screen">
      {/* Glows */}
      <div className="absolute top-[-10rem] left-[-10rem] w-[500px] h-[500px] bg-green-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500/5 to-yellow-500/5 blur-[200px]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Logo / Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 via-yellow-400 to-green-600 rounded-3xl shadow-lg animate-float">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                zk
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-xl mb-6">
          zkEmployeeLoan{" "}
          <span className="block text-2xl sm:text-3xl font-medium text-gray-300 mt-2">
            Privacy-First Financial Infrastructure
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Secure employee loan verification using{" "}
          <span className="text-green-400 font-semibold">
            zero-knowledge proofs
          </span>
          . Scale with privacy, transparency, and trust.
        </p>

        {/* Features */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {[
            "Employee Loan Management",
            "Secure Verification",
            "Privacy-First Finance",
          ].map((text, i) => (
            <div
              key={i}
              className="px-5 py-2 text-sm text-green-300 bg-white/5 border border-green-500/20 rounded-full backdrop-blur hover:scale-105 transition-transform"
            >
              {text}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
          {ready && !authenticated && (
            <button
              onClick={handleLogin}
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 text-black rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              Connect Wallet & Access Loans
            </button>
          )}
          {ready && authenticated && (
            <>
              <a
                href="/organization"
                className="px-8 py-4 text-lg font-semibold bg-green-600 text-white rounded-xl hover:bg-green-500 transition"
              >
                Organization Dashboard
              </a>
              <a
                href="/employee"
                className="px-8 py-4 text-lg font-semibold border border-green-500 text-green-300 rounded-xl hover:bg-green-600/20 transition"
              >
                Employee Portal
              </a>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-gray-300">
          <div>
            <div className="text-3xl font-bold text-green-400">10M+</div>
            <div className="mt-1 text-sm">Proofs Verified</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">99.9%</div>
            <div className="mt-1 text-sm">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">500+</div>
            <div className="mt-1 text-sm">Developers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
