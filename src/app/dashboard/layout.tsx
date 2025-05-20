"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Upload,
  FileText,
  CreditCard,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Hochladen", icon: Upload },
  { href: "/dashboard/notes", label: "Verlauf", icon: FileText },
  { href: "/dashboard/account", label: "Abo / Konto", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: (typeof navLinks)[0]) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)} // mobile closes after click
        className={`flex items-center gap-3 text-sm px-2 py-2 rounded-md transition ${
          isActive ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700 hover:text-purple-600"
        }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800 relative">
      {/* Mobile Nav Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`${mobileOpen ? "translate-x-65" : ""} md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md`}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "flex" : "hidden"
        } md:flex flex-col justify-between w-64 bg-white shadow-md border-r px-6 py-8 fixed md:relative z-40 h-full md:h-auto`}
      >
        <div>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>
        <div className="text-xs text-gray-400 hidden md:block">© 2025 NotePilot</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
