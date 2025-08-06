import { Shield, Zap, Lock, CheckCircle } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Zero-Knowledge Proofs",
      description:
        "Verify computations without revealing sensitive data using cutting-edge ZK technology.",
    },
    {
      icon: Zap,
      title: "Fast Verification",
      description:
        "Lightning-fast proof verification with optimized algorithms and scalable infrastructure.",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description:
        "Complete privacy protection while maintaining computational integrity and transparency.",
    },
    {
      icon: CheckCircle,
      title: "Trusted Infrastructure",
      description:
        "Enterprise-grade reliability with comprehensive documentation and developer tools.",
    },
  ];

  return (
    <section className="z-10 relative px-6 py-16 bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose zkVerify?
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Power your applications with advanced zero-knowledge proof
            verification for enhanced privacy, scalability, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, description }, idx) => (
            <div
              key={idx}
              className="text-center p-6 bg-neutral-800 rounded-xl border border-neutral-700 hover:border-green-500 transition-all"
            >
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
