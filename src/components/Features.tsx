import { ShieldCheck, Clock3, EyeOff, ServerCog } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Zero-Knowledge Proofs",
      description:
        "Verify computations without revealing sensitive data using cutting-edge ZK technology.",
      gradient: "from-green-400 to-yellow-400",
      bgGradient: "from-green-500/20 to-yellow-500/10",
    },
    {
      icon: Clock3,
      title: "Fast Verification",
      description:
        "Lightning-fast proof verification with optimized algorithms and scalable infrastructure.",
      gradient: "from-yellow-400 to-green-400",
      bgGradient: "from-yellow-500/20 to-green-500/10",
    },
    {
      icon: EyeOff,
      title: "Privacy First",
      description:
        "Complete privacy protection while maintaining computational integrity and transparency.",
      gradient: "from-green-400 to-yellow-400",
      bgGradient: "from-green-500/20 to-yellow-500/10",
    },
    {
      icon: ServerCog,
      title: "Trusted Infrastructure",
      description:
        "Enterprise-grade reliability with comprehensive documentation and developer tools.",
      gradient: "from-yellow-400 to-green-400",
      bgGradient: "from-yellow-500/20 to-green-500/10",
    },
  ];

  return (
    <section className="relative px-6 py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,193,7,0.08),transparent_50%)]" />

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-10 left-20 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-70"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text">
              zkEmployeeLoan
            </span>
            ?
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Power your employee loan platform with advanced zero-knowledge proof
            verification for enhanced{" "}
            <span className="text-green-400 font-semibold">privacy</span>,{" "}
            <span className="text-yellow-400 font-semibold">scalability</span>,
            and <span className="text-green-400 font-semibold">security</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(
            ({ icon: Icon, title, description, gradient, bgGradient }, idx) => (
              <div
                key={idx}
                className={`group text-center p-8 bg-gradient-to-br ${bgGradient} backdrop-blur-sm rounded-3xl border border-green-500/30 hover:border-yellow-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 animate-slideUp`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div
                  className={`bg-gradient-to-br ${bgGradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon
                    className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                    stroke="url(#myGradient)"
                  />
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient
                        id="myGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#facc15" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3
                  className={`font-bold text-xl mb-4 bg-gradient-to-r ${gradient} text-transparent bg-clip-text group-hover:scale-105 transition-transform duration-300`}
                >
                  {title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {description}
                </p>
              </div>
            )
          )}
        </div>

        <div className="mt-20 text-center animate-slideUp delay-700">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-green-500/20 to-yellow-500/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
            <span className="text-gray-300 font-medium">
              Ready to build with zkEmployeeLoan? Explore our comprehensive
              documentation.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
