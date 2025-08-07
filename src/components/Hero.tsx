"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef } from "react";
import {
  Shield,
  DollarSign,
  Users,
  ArrowRight,
  CheckCircle,
  Lock,
} from "lucide-react";
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

  const handleLogin = () => {
    login();
  };

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-40 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden min-h-screen">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-10rem] left-[-10rem] w-[500px] h-[500px] bg-green-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-500/5 to-yellow-500/5 rounded-full blur-3xl" />

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-40 right-32 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-70"></div>
      <div className="absolute bottom-32 left-16 w-4 h-4 bg-yellow-300 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-20 right-20 w-3 h-3 bg-green-300 rounded-full animate-ping opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Logo/Icon Section */}
        <div className="mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 via-yellow-400 to-green-600 rounded-3xl mb-6 shadow-2xl shadow-yellow-500/20 animate-float">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center">
              <DollarSign className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white max-w-5xl drop-shadow-2xl mb-8 animate-slideUp">
          Secure{" "}
          <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text animate-pulse">
            zkEmployeeLoan
          </span>{" "}
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-yellow-300 via-green-300 to-yellow-400 text-transparent bg-clip-text">
            Platform
          </span>
        </h1>

        <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed animate-slideUp delay-200">
          Enhancing employee loans with{" "}
          <span className="text-green-400 font-semibold">
            Zero-Knowledge Proofs
          </span>
          . Secure, private, and scalable loan verification with{" "}
          <span className="text-yellow-400 font-semibold">privacy-first</span>{" "}
          infrastructure.
        </p>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 animate-slideUp delay-300">
          <div className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-yellow-500/20 border border-green-500/30 rounded-full text-green-300 font-medium backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <Shield className="w-4 h-4 inline-block mr-2" />
            Privacy-First Loans
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-green-500/20 border border-yellow-500/30 rounded-full text-yellow-300 font-medium backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <Lock className="w-4 h-4 inline-block mr-2" />
            Secure Verification
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-yellow-500/20 border border-green-500/30 rounded-full text-green-300 font-medium backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CheckCircle className="w-4 h-4 inline-block mr-2" />
            Zero Data Leakage
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center animate-slideUp delay-500">
          {ready && !authenticated && (
            <button
              onClick={handleLogin}
              className="group px-10 py-5 bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 text-black font-bold rounded-2xl text-xl shadow-2xl hover:shadow-yellow-500/30 hover:scale-110 transition-all duration-500 transform hover:-translate-y-1 animate-glow relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Connect Wallet & Start
                <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          )}

          {ready && authenticated && (
            <>
              <a
                href="/organization"
                className="group px-10 py-5 bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 text-black font-bold rounded-2xl text-xl shadow-2xl hover:shadow-yellow-500/30 hover:scale-110 transition-all duration-500 transform hover:-translate-y-1 animate-glow relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Organization Dashboard
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </a>

              <a
                href="/employee"
                className="group px-10 py-5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-2 border-green-500/50 text-white font-bold rounded-2xl text-xl shadow-xl hover:shadow-green-500/30 hover:scale-110 hover:border-yellow-500/70 transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <span className="bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Employee Portal
                </span>
              </a>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slideUp delay-700">
          <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text mb-2">
              95%
            </div>
            <div className="text-gray-400 group-hover:text-green-300 transition-colors duration-300">
              Privacy Verification
            </div>
          </div>
          <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text mb-2">
              $50M+
            </div>
            <div className="text-gray-400 group-hover:text-yellow-300 transition-colors duration-300">
              Loans Processed
            </div>
          </div>
          <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text mb-2">
              1000+
            </div>
            <div className="text-gray-400 group-hover:text-green-300 transition-colors duration-300">
              Employees Verified
            </div>
          </div>
        </div>

        {/* Workflow Preview */}
        <div className="mt-24 max-w-4xl mx-auto animate-slideUp delay-1000">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text">
              How It Works
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect</h3>
              <p className="text-gray-400">
                Login with your wallet and verify identity
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Verify</h3>
              <p className="text-gray-400">
                Upload employment verification securely
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Access</h3>
              <p className="text-gray-400">
                Get approved for employee loans instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
