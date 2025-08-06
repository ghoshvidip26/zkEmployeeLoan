export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-t from-black via-gray-900 to-black border-t border-green-500/20 backdrop-blur-xl">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-yellow-500/5"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-yellow-400 to-green-600 rounded-xl rotate-12"></div>
                <div className="absolute top-0 left-0 w-10 h-10 bg-black border-2 border-yellow-400 rounded-xl -rotate-12 flex items-center justify-center">
                  <span className="text-xs font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                    zk
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
                zkEmployeeLoan
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Secure employee loan platform with zero-knowledge proof
              verification for private and scalable financial services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-400 mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a
                href="/organization"
                className="block text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
              >
                Organization Dashboard
              </a>
              <a
                href="/employee"
                className="block text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm"
              >
                Employee Portal
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
              >
                Documentation
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              Powered By
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center md:justify-end gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Privy Auth</span>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Horizen Network</span>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Zero-Knowledge Proofs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-500/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text font-semibold">
              zkEmployeeLoan
            </span>
            . Built with blockchain technology for secure employee loan
            services.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-yellow-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300">
                Built for the future of finance
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
