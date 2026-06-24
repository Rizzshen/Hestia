export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-white py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} Hestia. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-muted">v1.0.0</span>
          <a href="#" className="text-xs text-primary hover:underline">
            Help & Support
          </a>
        </div>
      </div>
    </footer>
  );
}