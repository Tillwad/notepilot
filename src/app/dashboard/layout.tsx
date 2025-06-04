"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, FileText, CreditCard } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Hochladen", icon: Upload },
  { href: "/dashboard/notes", label: "Verlauf", icon: FileText },
  { href: "/dashboard/account", label: "Abo / Konto", icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: (typeof navLinks)[0]) => {
    const isActive =
      href === "/dashboard/notes"
        ? pathname.startsWith("/dashboard/notes")
        : pathname === href;

    return (
      <Link
        href={href}
        className={`flex-1 min-w-[120px] flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-center transition rounded-md
    ${
      isActive
        ? "border-purple-600 text-purple-700 bg-purple-50"
        : "border-transparent text-gray-600 hover:text-purple-700 hover:border-purple-300"
    }`}
      >
        <Icon size={16} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b shadow-sm px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 py-2">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
