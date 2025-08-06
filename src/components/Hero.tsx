"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Hero() {
  const { login } = useLogin();
  const { ready, authenticated, user } = usePrivy();
  console.log("User: ", user);
  console.log("ID: ", user?.id);
  console.log("User:", user?.email?.address);

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 bg-gradient-to-b from-black to-neutral-900 overflow-hidden">
      {/* Background blur circles (optional aesthetic) */}
      <div className="absolute top-[-5rem] left-[-5rem] w-[300px] h-[300px] bg-green-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-5rem] right-[-5rem] w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-3xl" />

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white max-w-4xl drop-shadow-md">
        Powerful{" "}
        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          zkVerify
        </span>{" "}
        Documentation Hub
      </h1>

      {/* Subheading */}
      <p className="mt-6 text-lg text-neutral-400 max-w-2xl">
        Explore comprehensive documentation for zkVerify, the cutting-edge
        zero-knowledge proof verification platform. Build scalable, private, and
        secure applications with complete transparency.
      </p>

      {/* CTA Buttons */}
      {ready && !authenticated && (
        <button
          onClick={() => {
            if (!authenticated) {
              login();
            }
          }}
          className="mt-10 px-8 py-4 bg-green-500 text-black font-semibold rounded-full text-lg shadow-xl hover:bg-green-400 hover:scale-105 transition-all"
        >
          Connect Wallet & Explore Docs
        </button>
      )}

      {ready && authenticated && (
        <div className="mt-10">
          {/* <p className="text-green-400 text-sm mb-4">✅ Wallet Connected!</p> */}
          <a
            href="/organization"
            className="inline-block px-8 py-4 bg-green-500 text-black font-semibold rounded-full text-lg shadow-xl hover:bg-green-400 hover:scale-105 transition-all"
          >
            Wallet Connected!
          </a>
        </div>
      )}
    </section>
  );
}
