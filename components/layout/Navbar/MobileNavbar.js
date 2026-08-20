"use client";

// Mobile özel, hamburger veya alt bar tasarımı
export default function MobileNavbar() {
  return (
    <nav className="w-full h-14 border-b border-border bg-background/90 sticky top-0 z-50">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="text-lg font-bold text-primary">Blog (Mobil)</div>
        <button className="p-2">
          {/* Hamburger Icon Placeholder */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
