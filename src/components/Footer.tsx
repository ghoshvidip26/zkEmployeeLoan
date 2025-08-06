export default function Footer() {
  return (
    <footer className="relative z-10 text-center py-8 text-neutral-400 border-t border-neutral-800 bg-black/70 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm mb-2">
          &copy; {new Date().getFullYear()} RapidDistro. Built with blockchain
          technology for secure payroll management.
        </p>
        <p className="text-xs text-neutral-500">
          Powered by Privy Auth • Base Network • Built for the future of work
        </p>
      </div>
    </footer>
  );
}
